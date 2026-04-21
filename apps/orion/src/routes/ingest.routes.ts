import type { FastifyInstance } from "fastify";
import { createIngestController } from "../controllers/index";
import type { ingestPromptBody } from "@repo/schemas";

export async function ingestRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body : ingestPromptBody }>("/execute", {
    handler: createIngestController,
  });
}
