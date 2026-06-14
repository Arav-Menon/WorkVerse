import { Worker } from "bullmq";
import { connection } from "@repo/queue";
import { chat } from "@repo/evaluator";
import type { ChatCompletedEvent } from "@repo/events";
import { EventBus } from "@repo/events";
import { client } from "@repo/redis";
import { insertBulk } from "../utils/bulkInsert";

export const worker = new Worker('chat_response-queue', async (job) => {
    console.log("worker is started.....")
    const { workspaceId, userPrompt, organizationId, promptId, userId } = job.data;

    try {
        const response = await chat(userPrompt);

        const chatCompletePayload: ChatCompletedEvent = {
            promptId,
            userId,
            organizationId,
            workspaceId,
            content: response,
            status: "completed"
        }

        await client.set(`chat${promptId}:access`, JSON.stringify(chatCompletePayload), "EX", 86400);

        const dbCheck = await insertBulk(chatCompletePayload) as any;

        await EventBus.publish("chat_completed", chatCompletePayload);

        return {
            success: true,
            statusCode: 200,
            info: {
                promptId,
                userId,
                organizationId,
                workspaceId,
                content: response,
            }
        };
    } catch (error: any) {
        return {
            success: false,
            statusCode: error.statusCode ?? 500,
            error
        }
    }

}, { connection, concurrency: 100 })