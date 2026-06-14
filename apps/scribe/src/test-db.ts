import { db } from "@repo/db/db";
import { randomUUID } from "crypto";

async function main() {
    try {
        const batch = [{
            id: randomUUID(),
            promptId: "test-prompt-id",
            workspaceId: "test-workspace-id",
            userId: "test-user-id",
            conversationId: "test-conv-id",
            role: "ASSISTANT" as const,
            content: "test content",
            createdAt: new Date()
        }];

        console.log("Attempting to insert:", batch);

        await db.aiChatMessage.createMany({
            data: batch
        });
        
        console.log("Insert successful!");
    } catch (e) {
        console.error("Insert failed:");
        console.error(e);
    }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
