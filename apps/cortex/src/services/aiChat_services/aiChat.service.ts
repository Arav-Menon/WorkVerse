import type { FastifyInstance } from "fastify";

const CHAT_HISTORY_TTL = 300;

interface AiChatHistoryQuery {
  workspaceId: string;
  limit?: number;
}

interface AiChatMessage {
  id: string;
  conversationId: string;
  promptId: string;
  role: string;
  content: unknown;
  createdAt: Date;
  userId: string;
}

export async function getAiChatHistory(
  fastify: FastifyInstance,
  query: AiChatHistoryQuery,
  userId: string,
): Promise<{ success: boolean; messages?: AiChatMessage[]; error?: string }> {
  const { workspaceId, limit = 20 } = query;

  if (!workspaceId) {
    return { success: false, error: "workspaceId is required" };
  }

  const cacheKey = `ai-chat:history:${workspaceId}:${userId}:${limit}`;

  try {
    const cached = await fastify.cache.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      parsed.forEach((msg: any) => {
        msg.createdAt = new Date(msg.createdAt);
      });
      return { success: true, messages: parsed };
    }

    const messages = await fastify.db.aiChatMessage.findMany({
      where: {
        workspaceId,
        userId,
      },
      take: Math.min(limit, 50),
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        conversationId: true,
        promptId: true,
        role: true,
        content: true,
        createdAt: true,
        userId: true,
      },
    });

    const result = messages.reverse();

    await fastify.cache.set(cacheKey, JSON.stringify(result), "EX", CHAT_HISTORY_TTL);

    return { success: true, messages: result };
  } catch (error: any) {
    fastify.log.error({ error }, "Failed to fetch AI chat history");
    return { success: false, error: "Failed to fetch chat history" };
  }
}

export async function deleteAiChatHistory(
  fastify: FastifyInstance,
  workspaceId: string,
  userId: string,
): Promise<{ success: boolean; deleted?: number; error?: string }> {
  if (!workspaceId) {
    return { success: false, error: "workspaceId is required" };
  }

  try {
    const result = await fastify.db.aiChatMessage.deleteMany({
      where: {
        workspaceId,
        userId,
      },
    });

    const cachePattern = `ai-chat:history:${workspaceId}:${userId}:*`;
    const keys = await fastify.cache.keys(cachePattern);
    if (keys.length > 0) {
      await fastify.cache.del(...keys);
    }

    return { success: true, deleted: result.count };
  } catch (error: any) {
    fastify.log.error({ error }, "Failed to delete AI chat history");
    return { success: false, error: "Failed to delete chat history" };
  }
}
