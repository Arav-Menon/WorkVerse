import type { FastifyInstance } from "fastify";
import { createIngestController } from "../controllers/index";
import type { ingestPromptBody } from "@repo/schemas";

export async function ingestRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: ingestPromptBody }>("/execute", {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: 60000, // 1 minute
        keyGenerator: (request) => {
          const userId = (request.user as any)?.userId || request.ip;
          return `ratelimit:ingest-execute:orion:${userId}`;
        },
      },
    },
    handler: createIngestController,
  });
}
