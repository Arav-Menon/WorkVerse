import type { FastifyInstance } from "fastify";
import type { ingestPromptBody } from "@repo/schemas";
import { createIngestPromptController } from "../../controllers";

export async function ingestPromptRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: ingestPromptBody }>("/", {
    preHandler: [fastify.authenticate],
    handler: createIngestPromptController,
  });
}
