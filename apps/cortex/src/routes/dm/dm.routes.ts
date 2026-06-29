import type { FastifyInstance } from "fastify";
import {
  createOrGetConversationController,
  getConversationsController,
  getMessagesController,
  sendMessageController,
  markAsReadController,
  sendTypingController,
} from "../../controllers/dm.controller";

export default async function dmRoutes(fastify: FastifyInstance) {
  fastify.post("/:orgId/dm/conversations", {
    preHandler: [fastify.authenticate],
    handler: createOrGetConversationController,
  });

  fastify.get("/:orgId/dm/conversations", {
    preHandler: [fastify.authenticate],
    handler: getConversationsController,
  });

  fastify.get("/:orgId/dm/conversations/:conversationId/messages", {
    preHandler: [fastify.authenticate],
    handler: getMessagesController,
  });

  fastify.post("/:orgId/dm/conversations/:conversationId/messages", {
    config: {
      rateLimit: {
        max: 30,
        timeWindow: 60000,
        keyGenerator: (request) => {
          const userId = (request.user as any)?.userId || request.ip;
          return `ratelimit:dm:send:${userId}`;
        },
      },
    },
    preHandler: [fastify.authenticate],
    handler: sendMessageController,
  });

  fastify.post("/:orgId/dm/conversations/:conversationId/read", {
    preHandler: [fastify.authenticate],
    handler: markAsReadController,
  });

  fastify.post("/:orgId/dm/conversations/:conversationId/typing", {
    preHandler: [fastify.authenticate],
    handler: sendTypingController,
  });
}
