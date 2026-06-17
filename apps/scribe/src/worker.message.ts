import { client } from "@repo/redis";
import { db } from "@repo/db/db";

const BATCH_SIZE = 100;
const TICK_INTERVAL = 5000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
    console.log("Scribe Worker: Active and listening for chat messages...");

    if (!client.isOpen) {
        await client.connect();
    }

    while (true) {
        try {
            const messages: any[] = [];

            for (let i = 0; i < BATCH_SIZE; i++) {
                const rawMessage = await client.rPop("chat_persistence_queue");
                if (!rawMessage) break;

                try {
                    messages.push(JSON.parse(rawMessage));
                } catch (e) {
                    console.error("Failed to parse message from queue", e);
                }
            }

            if (messages.length > 0) {
                console.log(`Scribe: Processing batch of ${messages.length} messages...`);

                await db.chatMessage.createMany({
                    data: messages.map((m) => ({
                        content: m.chatMessage,
                        workspaceId: m.workSpaceId,
                        userId: m.userId,
                        createdAt: new Date(m.timestamp),
                    })),
                });

                console.log(`Scribe: Successfully saved ${messages.length} messages to Postgres.`);
            }

        } catch (error) {
            console.error("Scribe Worker Error:", error);
            await sleep(2000);
        }

        await sleep(TICK_INTERVAL);
    }
}

main().catch((err) => {
    console.error("Scribe Worker Fatal Crash:", err);
    process.exit(1);
});
