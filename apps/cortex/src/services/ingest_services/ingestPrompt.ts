import { type FastifyInstance } from "fastify";
import type { ingestPromptBody } from "@repo/schemas";

export async function registerIngestPrompt(
  fastify: FastifyInstance,
  input: ingestPromptBody,
  userId: string,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const { userPrompt, promptId, organizationId, workspaceId, systemPrompt } =
    input;

  const result = await fastify.redisProducer.pushUserInboundPrompt({
    promptId,
    userId,
    organizationId,
    workspaceId,
    systemPrompt,
    userPrompt,
  });

  return result;
}
