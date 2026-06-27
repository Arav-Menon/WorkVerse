import { client } from "@repo/redis";
import { db } from "@repo/db/db";
import { DM_PERSISTENCE_QUEUE } from "@repo/redis";

const BATCH_SIZE = 100;
const TICK_INTERVAL = 5000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    console.log("Scribe DM Worker: Active and listening for DM messages...");

    if (!client.isOpen) {
        await client.connect();
    }

    while (true) {
        try {
            const messages: any[] = [];

            for (let i = 0; i < BATCH_SIZE; i++) {
                const rawMessage = await client.rPop(DM_PERSISTENCE_QUEUE);
                if (!rawMessage) break;

                try {
                    messages.push(JSON.parse(rawMessage));
                } catch (e) {
                    console.error("Failed to parse DM message from queue", e);
                }
            }

            if (messages.length > 0) {
                console.log(`Scribe DM: Processing batch of ${messages.length} messages...`);

                // Note: Messages are already persisted by DmService.sendMessage
                // This worker is a backup/retry mechanism
                // In case of failure, we log but don't re-insert to avoid duplicates
                for (const msg of messages) {
                    try {
                        // Check if message already exists
                        const existing = await db.directMessage.findUnique({
                            where: { id: msg.messageId },
                        });

                        if (!existing) {
                            await db.directMessage.create({
                                data: {
                                    id: msg.messageId,
                                    conversationId: msg.conversationId,
                                    senderId: msg.senderId,
                                    content: msg.content,
                                    createdAt: new Date(msg.createdAt),
                                },
                            });
                        }
                    } catch (err) {
                        console.error("Scribe DM: Failed to persist message:", err);
                    }
                }

                console.log(`Scribe DM: Processed ${messages.length} messages.`);
            }

        } catch (error) {
            console.error("Scribe DM Worker Error:", error);
            await sleep(2000);
        }

        await sleep(TICK_INTERVAL);
    }
}

main().catch((err) => {
    console.error("Scribe DM Worker Fatal Crash:", err);
    process.exit(1);
});
