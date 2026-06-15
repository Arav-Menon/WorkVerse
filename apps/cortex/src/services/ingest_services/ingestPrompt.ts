import { type FastifyInstance } from "fastify";
import type { ingestPromptBody } from "@repo/schemas";
import axios from "axios";
import { API_URL } from "../../../utils";

export async function registerIngestPrompt(
  fastify: FastifyInstance,
  input: ingestPromptBody,
  userId: string,
): Promise<{
  success: boolean;
  id?: string;
  error?: any;
  statuscode?: number;
  message?: string;
  jobStatus?: string;
}> {
  const { userPrompt, organizationId, workspaceId, promptId, spaceId } = input;

  try {
    await axios.post(
      API_URL,
      {
        workspaceId,
        spaceId,
        userPrompt,
        organizationId,
        promptId,
        userId,
      },
      {
        headers: {
          Authorization: `Bearer ${userId}`,
        },
      },
    );

    const jobStatusPayload = {
      status: "received",
      userId,
      spaceId,
      organizationId,
      workspaceId,
      promptId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // const setExecute = await fastify.db.

    await fastify.cache.set(
      `promptId:${promptId}`,
      JSON.stringify(jobStatusPayload),
      "EX",
      3600
    );

    return {
      success: true,
      id: promptId,
      jobStatus: JSON.stringify(jobStatusPayload),
    };
  } catch (error: any) {
    return {
      success: false,
      statuscode: error.statuscode,
      message: "Failed to ingest prompt",
      error,
    };
  }
}
