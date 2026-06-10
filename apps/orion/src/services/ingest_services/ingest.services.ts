import type { ingestPromptBody } from "@repo/schemas";
import { type FastifyInstance } from "fastify";
import { planExecution } from "@repo/evaluator";
import { get } from "http";

export async function registerIngestPromptService(
  fastify: FastifyInstance,
  input: ingestPromptBody,
): Promise<{
  success?: boolean;
  id?: string;
  statusCode?: number;
  message?: string;
  error?: any;
  jobStatus?: object;
}> {
  const {
    workspaceId,
    userPrompt,
    organizationId,
    // systemPrompt,
    promptId,
    userId,
  } = input;

  const jobStatusPayload2 = {
    status: "queued",
    userId,
    userPrompt,
    organizationId,
    workspaceId,
    promptId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  console.log(jobStatusPayload2)

  try {

    console.log("step:1")
    const getTheIntent = await planExecution(userPrompt);
    console.log("step:2")
    console.log(getTheIntent)
    return {
      success: true,
      // statusCode: error.statusCode,
      message: "DOne",
      // error: error,
    }
  } catch (error: any) {
    console.log("error from here", error);
    return {
      success: false,
      statusCode: error.statusCode,
      message: "Failed to send prompt in queue",
      error: error,
    }
  }

  // have to write the thinging logic which execution tool to use mcp or n8n. remove this pushUserInboundPromt queue from here because it does decide blindly pushing to the queue
  // try {
  //   await fastify.redisProducer.pushUserInboundPrompt({
  //     promptId,
  //     userId,
  //     organizationId,
  //     workspaceId,
  //     systemPrompt,
  //     userPrompt,
  //   });
  //
  //   const jobStatusPayload = {
  //     status: "queued",
  //     userId,
  //     organizationId,
  //     workspaceId,
  //     promptId,
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString(),
  //   };
  //
  //   console.log(jobStatusPayload);
  //
  //   // await Promise.all([
  //   //   fastify.db.workflowJob.create({
  //   //     data: {
  //   //       id: promptId,
  //   //       createdById: userId,
  //   //       organizationId,
  //   //       workspaceId,
  //   //       title: promptId,
  //   //       prompt: userPrompt,
  //   //       systemPrompt,
  //   //       status: "PENDING",
  //   //     },
  //   //   }),
  //   //
  //   //   fastify.cache.set(
  //   //     `promptId:${promptId}`,
  //   //     JSON.stringify(jobStatusPayload),
  //   //     "EX",
  //   //     3600,
  //   //   ),
  //   // ]);
  //
  //   return {
  //     success: true,
  //     id: promptId,
  //     jobStatus: jobStatusPayload,
  //   };
  // } catch (error: any) {
  //   console.log(error);
  //   };
  // }
}
