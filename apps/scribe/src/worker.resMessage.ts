import "./env";

import { Worker } from "bullmq"
import { db } from "@repo/db/db";
import { connection } from "@repo/queue"
import { randomUUID } from "crypto";

const buffer: any[] = [];

async function flushToDB() {
    if (!buffer.length) return;

    const batch = buffer.splice(0, 1000);

    try {
        await db.aiChatMessage.createMany({
            data: batch
        })
        console.log(`Successfully inserted ${batch.length} messages into DB.`);
    } catch (error: any) {
        console.error("Bulk insert failed:", error);
        buffer.unshift(...batch)
        return {
            success: false,
            statusCode: error.statusCode ?? 500,
            error
        }
    }

}

setInterval(async () => {
    flushToDB()
}, 3000);

export const worker = new Worker('bulk_insert_chat-response-queue', async (job) => {
    console.log("Received job from queue:", job.id);
    try {

        const data = job.data;

        buffer.push({
            id: randomUUID(),
            promptId: data.promptId,
            organizationId: data.organizationId,
            workspaceId: data.workspaceId,
            userId: data.userId,
            conversationId: data.promptId,
            role: data.role === "USER" ? "USER" : "ASSISTANT",
            content: data.content,
            createdAt: new Date()
        });

        if (buffer.length >= 1000) {
            await flushToDB()
        }

    } catch (error: any) {
        return {
            success: false,
            statusCode: error.statusCode ?? 500,
            error
        }
    }

}, { connection, concurrency: 100 })