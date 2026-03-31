import { type FastifyInstance } from "fastify";
import type { ingestPromptBody } from "@repo/schemas";
import { tokenId } from "./getId";
import { aiSystemPrompt } from "./systemPrompt";

export async function registerIngestPrompt(
  fastify: FastifyInstance,
  input: ingestPromptBody,
  userId: string,
): Promise<{ success: boolean; id?: string; error?: string }> {
  const { userPrompt, organizationId, workspaceId } = input;

  const systemPrompt = aiSystemPrompt();

  const result = await fastify.redisProducer.pushUserInboundPrompt({
    promptId: tokenId(),
    userId,
    organizationId,
    workspaceId,
    systemPrompt,
    userPrompt,
  });
  return result;
}
