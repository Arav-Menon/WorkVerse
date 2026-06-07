import type { FastifyInstance } from "fastify";
import type { ingestPromptBody } from "@repo/schemas";
import { createIngestPromptController } from "../../controllers";

export async function ingestPromptRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: ingestPromptBody }>("/", {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: 60000, // 1 minute
        keyGenerator: (request) => {
          const userId = (request.user as any)?.userId || request.ip;
          return `ratelimit:ingest:${userId}`;
        },
      },
    },
    preHandler: [fastify.authenticate],
    handler: createIngestPromptController,
  });
}
