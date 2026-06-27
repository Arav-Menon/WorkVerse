import { db } from "@repo/db/db";
import { EventBus } from "@repo/events";
import { client as redisClient } from "@repo/redis/redis-client";
import { DM_PERSISTENCE_QUEUE } from "@repo/redis";

export class DmService {
  async getOrCreateConversation(orgId: string, user1Id: string, user2Id: string) {
    // Normalize user order to ensure uniqueness
    const sorted = [user1Id, user2Id].sort();
    const sortedUser1: string = sorted[0]!;
    const sortedUser2: string = sorted[1]!;

    const conversation = await db.directMessageConversation.upsert({
      where: {
        organizationId_user1Id_user2Id: {
          organizationId: orgId,
          user1Id: sortedUser1,
          user2Id: sortedUser2,
        },
      },
      create: {
        organizationId: orgId,
        user1Id: sortedUser1,
        user2Id: sortedUser2,
      },
      update: {},
      include: {
        user1: { select: { id: true, name: true, email: true } },
        user2: { select: { id: true, name: true, email: true } },
      },
    });

    return conversation;
  }

  async getConversations(orgId: string, userId: string) {
    const conversations = await db.directMessageConversation.findMany({
      where: {
        organizationId: orgId,
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: { select: { id: true, name: true, email: true } },
        user2: { select: { id: true, name: true, email: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            content: true,
            senderId: true,
            createdAt: true,
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Get unread counts for each conversation
    const unreadCounts = await this.getUnreadCounts(userId, orgId);

    return conversations.map((conv: any) => {
      const otherUser = conv.user1Id === userId ? conv.user2 : conv.user1;
      const lastMessage = conv.messages[0] || null;

      return {
        id: conv.id,
        otherUser,
        lastMessage: lastMessage
          ? {
              id: lastMessage.id,
              content: lastMessage.content,
              senderId: lastMessage.senderId,
              createdAt: lastMessage.createdAt,
            }
          : null,
        unreadCount: unreadCounts[conv.id] || 0,
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt,
      };
    });
  }

  async getMessages(conversationId: string, userId: string, cursor?: string, limit = 50) {
    // Verify user is a participant
    const conversation = await db.directMessageConversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      throw new Error("Not a participant in this conversation");
    }

    const messages = await db.directMessage.findMany({
      where: {
        conversationId,
        ...(cursor
          ? {
              createdAt: {
                lt: new Date(cursor),
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        sender: { select: { id: true, name: true, email: true } },
      },
    });

    return messages.reverse();
  }

  async sendMessage(conversationId: string, senderId: string, content: string) {
    // Verify user is a participant
    const conversation = await db.directMessageConversation.findUnique({
      where: { id: conversationId },
      include: {
        user1: { select: { id: true, name: true } },
        user2: { select: { id: true, name: true } },
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found");
    }

    if (conversation.user1Id !== senderId && conversation.user2Id !== senderId) {
      throw new Error("Not a participant in this conversation");
    }

    // Create message in DB
    const message = await db.directMessage.create({
      data: {
        conversationId,
        senderId,
        content,
      },
      include: {
        sender: { select: { id: true, name: true, email: true } },
      },
    });

    // Update conversation timestamp
    await db.directMessageConversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Push to persistence queue for async processing (backup)
    await redisClient.lpush(
      DM_PERSISTENCE_QUEUE,
      JSON.stringify({
        conversationId,
        senderId,
        content,
        messageId: message.id,
        createdAt: message.createdAt,
      })
    );

    // Publish to EventBus for real-time delivery
    await EventBus.publish("dm_completed", {
      conversationId,
      organizationId: conversation.organizationId,
      senderId,
      senderName: conversation.user1Id === senderId
        ? conversation.user1.name
        : conversation.user2.name,
      content,
      messageId: message.id,
      createdAt: message.createdAt.toISOString(),
    });

    return message;
  }

  async getUnreadCounts(userId: string, orgId: string) {
    const conversations = await db.directMessageConversation.findMany({
      where: {
        organizationId: orgId,
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      select: { id: true },
    });

    const unreadCounts: Record<string, number> = {};

    for (const conv of conversations) {
      // Get the user's last read timestamp from Redis
      const lastReadKey = `dm:lastRead:${conv.id}:${userId}`;
      const lastReadStr = await redisClient.get(lastReadKey);

      if (!lastReadStr) {
        // If never read, count all messages from the other user
        const count = await db.directMessage.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
          },
        });
        unreadCounts[conv.id] = count;
      } else {
        const lastRead = new Date(lastReadStr);
        const count = await db.directMessage.count({
          where: {
            conversationId: conv.id,
            senderId: { not: userId },
            createdAt: { gt: lastRead },
          },
        });
        unreadCounts[conv.id] = count;
      }
    }

    return unreadCounts;
  }

  async markAsRead(conversationId: string, userId: string) {
    const lastReadKey = `dm:lastRead:${conversationId}:${userId}`;
    await redisClient.set(lastReadKey, new Date().toISOString());
  }
}

export const dmService = new DmService();
