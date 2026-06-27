import { dmService } from "../services/dm_services/dm.service";
import { dmTypingService } from "../services/dm_services/dm-typing.service";

export async function createOrGetConversationController(request: any, reply: any) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId } = request.params;
    const { otherUserId } = request.body;

    if (!orgId || !otherUserId) {
      return reply.status(400).send({ success: false, message: "Organization ID and other user ID required" });
    }

    if (userId === otherUserId) {
      return reply.status(400).send({ success: false, message: "Cannot create conversation with yourself" });
    }

    // Verify both users are members of the organization
    const [membership1, membership2] = await Promise.all([
      request.server.db.organizationMember.findUnique({
        where: { organizationId_userId: { organizationId: orgId, userId } },
      }),
      request.server.db.organizationMember.findUnique({
        where: { organizationId_userId: { organizationId: orgId, userId: otherUserId } },
      }),
    ]);

    if (!membership1 || !membership2) {
      return reply.status(403).send({ success: false, message: "Both users must be members of this organization" });
    }

    const conversation = await dmService.getOrCreateConversation(orgId, userId, otherUserId);

    return reply.status(200).send({ success: true, data: conversation });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(500).send({ success: false, message: err.message ?? "Internal Server Error" });
  }
}

export async function getConversationsController(request: any, reply: any) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId } = request.params;
    if (!orgId) {
      return reply.status(400).send({ success: false, message: "Organization ID required" });
    }

    const membership = await request.server.db.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId } },
    });

    if (!membership) {
      return reply.status(403).send({ success: false, message: "Not a member of this organization" });
    }

    const conversations = await dmService.getConversations(orgId, userId);

    return reply.status(200).send({ success: true, data: conversations });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(500).send({ success: false, message: err.message ?? "Internal Server Error" });
  }
}

export async function getMessagesController(request: any, reply: any) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId, conversationId } = request.params;
    const { cursor, limit } = request.query;

    if (!orgId || !conversationId) {
      return reply.status(400).send({ success: false, message: "Organization ID and conversation ID required" });
    }

    const membership = await request.server.db.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId } },
    });

    if (!membership) {
      return reply.status(403).send({ success: false, message: "Not a member of this organization" });
    }

    const messages = await dmService.getMessages(
      conversationId,
      userId,
      cursor,
      limit ? parseInt(limit as string) : 50
    );

    return reply.status(200).send({ success: true, data: messages });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(500).send({ success: false, message: err.message ?? "Internal Server Error" });
  }
}

export async function sendMessageController(request: any, reply: any) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId, conversationId } = request.params;
    const { content } = request.body;

    if (!orgId || !conversationId || !content) {
      return reply.status(400).send({ success: false, message: "Organization ID, conversation ID, and content required" });
    }

    const membership = await request.server.db.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId } },
    });

    if (!membership) {
      return reply.status(403).send({ success: false, message: "Not a member of this organization" });
    }

    const message = await dmService.sendMessage(conversationId, userId, content);

    return reply.status(201).send({ success: true, data: message });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(500).send({ success: false, message: err.message ?? "Internal Server Error" });
  }
}

export async function markAsReadController(request: any, reply: any) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId, conversationId } = request.params;

    if (!orgId || !conversationId) {
      return reply.status(400).send({ success: false, message: "Organization ID and conversation ID required" });
    }

    const membership = await request.server.db.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId } },
    });

    if (!membership) {
      return reply.status(403).send({ success: false, message: "Not a member of this organization" });
    }

    await dmService.markAsRead(conversationId, userId);

    return reply.status(200).send({ success: true, message: "Marked as read" });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(500).send({ success: false, message: err.message ?? "Internal Server Error" });
  }
}

export async function sendTypingController(request: any, reply: any) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId, conversationId } = request.params;

    if (!orgId || !conversationId) {
      return reply.status(400).send({ success: false, message: "Organization ID and conversation ID required" });
    }

    const membership = await request.server.db.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId } },
    });

    if (!membership) {
      return reply.status(403).send({ success: false, message: "Not a member of this organization" });
    }

    await dmTypingService.setTyping(conversationId, userId, orgId);

    return reply.status(200).send({ success: true, message: "Typing indicator sent" });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(500).send({ success: false, message: err.message ?? "Internal Server Error" });
  }
}
