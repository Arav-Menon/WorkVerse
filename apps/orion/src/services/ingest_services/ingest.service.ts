import type { ingestPromptBody } from "@repo/schemas";
import { type FastifyBaseLogger } from "fastify";
import { planExecution } from "@repo/evaluator";
import { ExecutionRouter } from "../execution-router";

interface JobStatusPayLoad {
    promptId: string;
    status: "queued";
    userId: string;
    userPrompt: string;
    spaceId: string,
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
    const { log } = deps;
    const { workspaceId, userPrompt, organizationId, promptId, userId, spaceId } = input;

    try {
        const intent = await planExecution(userPrompt);

        const jobPayload: JobStatusPayLoad = {
            promptId,
            status: "queued",
            userId,
            spaceId,
            userPrompt,
            organizationId,
            workspaceId,
            intent,
        };

        const responseMessage = await ExecutionRouter.dispatch(intent, jobPayload);

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

