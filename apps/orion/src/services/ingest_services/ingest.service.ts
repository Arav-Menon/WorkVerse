import type { ingestPromptBody } from "@repo/schemas";
import { type FastifyBaseLogger } from "fastify";
import { planExecution } from "@repo/evaluator";
import { ExecutionRouter } from "../execution-router";

interface JobStatusPayLoad {
    promptId: string;
    status: "queued";
    userId: string;
    userPrompt: string;
    organizationId: string;
    workspaceId: string;
    intent: unknown;
}

export interface IngestServiceResponse {
    success: boolean;
    statusCode: number;
    message: string;
    error?: unknown;
}

export interface IngestServiceDeps {
    log: FastifyBaseLogger;
    redisProducer: {
        pushUserWorkflowJob: (payload: JobStatusPayLoad) => Promise<unknown>;
    };
}

export async function registerIngestPromptService(
    deps: IngestServiceDeps,
    input: ingestPromptBody,
): Promise<IngestServiceResponse> {
    const { log, redisProducer } = deps;
    const { workspaceId, userPrompt, organizationId, promptId, userId } = input;

    try {
        const intent = await planExecution(userPrompt);
        console.log("step:1")

        const jobPayload: JobStatusPayLoad = {
            promptId,
            status: "queued",
            userId,
            userPrompt,
            organizationId,
            workspaceId,
            intent,
        };

        console.log("Step:2")
        const responseMessage = await ExecutionRouter.dispatch(intent, jobPayload);
        console.log(responseMessage)

        return {
            success: true,
            statusCode: 200,
            message: responseMessage,
        };
    } catch (error: unknown) {
        log.error({ error }, "Failed to ingest prompt");
        const statusCode = (error as any)?.statusCode ?? 500;
        return {
            success: false,
            statusCode,
            message: "Failed to send prompt in queue",
            error,
        };
    }
}

