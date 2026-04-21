import type { ingestPromptBody } from "@repo/schemas";
import type { FastifyReply, FastifyRequest } from "fastify";
import { registerIngestPromptService } from "../services/ingest_services/ingest.services";
export async function createIngestController(
  request: FastifyRequest<{ Body: ingestPromptBody }>,
  reply: FastifyReply,
) {
  const ingest = await registerIngestPromptService(
    request.server,
    request.body,
  );
  if (!ingest.success) {
    return reply
      .status(ingest.statusCode ?? 500)
      .send({ message: ingest.message, error: ingest.error });
  }
  return reply.status(200).send(ingest);
}