import type { FastifyInstance } from "fastify";
import { getAiChatHistoryController, deleteAiChatHistoryController } from "../../controllers/aiChat.controller";

export async function aiChatRoutes(fastify: FastifyInstance) {
  fastify.get("/", {
    preHandler: [fastify.authenticate],
    handler: getAiChatHistoryController,
  });

  fastify.delete("/", {
    preHandler: [fastify.authenticate],
    handler: deleteAiChatHistoryController,
  });
}
