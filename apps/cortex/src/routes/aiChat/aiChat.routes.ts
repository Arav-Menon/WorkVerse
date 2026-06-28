import type { FastifyInstance } from "fastify";
import { getAiChatHistoryController, deleteAiChatHistoryController } from "../../controllers/aiChat.controller";

export async function aiChatRoutes(fastify: FastifyInstance) {
  fastify.get("/", {
    preHandler: [fastify.authenticate],
    handler: getAiChatHistoryController,
  });

  fastify.delete("/", {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: 60000,
        keyGenerator: (request) => {
          const userId = (request.user as any)?.userId || request.ip;
          return `ratelimit:aichat:delete:${userId}`;
        },
      },
    },
    preHandler: [fastify.authenticate],
    handler: deleteAiChatHistoryController,
  });
}
