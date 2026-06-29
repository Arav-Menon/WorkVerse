import { client as redisClient } from "@repo/redis/redis-client";
import { EventBus } from "@repo/events";

const TYPING_TTL = 5; // seconds

export class DmTypingService {
  async setTyping(conversationId: string, userId: string, organizationId: string) {
    const key = `dm:typing:${conversationId}:${userId}`;
    await redisClient.set(key, "1", "EX", TYPING_TTL);

    // Publish typing event
    await EventBus.publish("dm_typing", {
      conversationId,
      organizationId,
      userId,
      isTyping: true,
    });
  }

  async clearTyping(conversationId: string, userId: string, organizationId: string) {
    const key = `dm:typing:${conversationId}:${userId}`;
    await redisClient.del(key);

    // Publish stop typing event
    await EventBus.publish("dm_typing", {
      conversationId,
      organizationId,
      userId,
      isTyping: false,
    });
  }

  async getTypingUsers(conversationId: string, currentUserId: string): Promise<string[]> {
    const pattern = `dm:typing:${conversationId}:*`;
    const keys: string[] = [];

    // Scan for typing keys (excluding current user)
    let cursor = "0";
    do {
      const result: [string, string[]] = await redisClient.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = result[0];
      keys.push(...result[1]);
    } while (cursor !== "0");

    // Extract user IDs and exclude current user
    return keys
      .map((key) => key.split(":").pop()!)
      .filter((userId) => userId !== currentUserId);
  }
}

export const dmTypingService = new DmTypingService();
