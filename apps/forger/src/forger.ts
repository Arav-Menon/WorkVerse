import { Worker } from "bullmq";
import { connection } from "@repo/queue";
import { chat } from "@repo/evaluator"

export const worker = new Worker('chat_response-queue', async (job) => {
    console.log("worker is started.....")
    const { workspaceId, userPrompt, organizationId, promptId, userId } = job.data;

    try {
        console.log("reached to worker")
        const response = await chat(userPrompt);
        console.log("get the response from the worker")
        console.log(response)
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
            success: true,
            statusCode: error.statusCode ?? 500,
            error
        }
    }

}, { connection })