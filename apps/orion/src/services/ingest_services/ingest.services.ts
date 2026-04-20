import type { ingestPromptBody } from "@repo/schemas";
import { type FastifyInstance } from "fastify";

export async function registerIngestPrompt(
  fastify: FastifyInstance,
  input: ingestPromptBody,
): Promise<{
  success?: boolean;
  id?: string;
  statusCode?: number;
  message?: string;
  error?: any;
  jobStatus?: string;
}> {
  const {
    workspaceId,
    userPrompt,
    organizationId,
    systemPrompt,
    promptId,
    userId,
  } = input;

  try {
    const result = await fastify.redisProducer.pushUserInboundPrompt({
      promptId,
      userId,
      organizationId,
      workspaceId,
      systemPrompt,
      userPrompt,
    });

    const jobStatusPayload = {
      status: "queued",
      userId,
      organizationId,
      workspaceId,
      promptId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await fastify.cache.set(
      `promptId:${promptId}`,
      JSON.stringify(jobStatusPayload), { EX: 1000 });

    return {
      success: true,
      id: promptId,
      jobStatus: JSON.stringify(jobStatusPayload),
    };
  } catch (error: any) {
    return {
      success: false,
      statusCode: error.statusCode,
      message: "Failed to send prompt in queue",
      error,
    };
  }
}
