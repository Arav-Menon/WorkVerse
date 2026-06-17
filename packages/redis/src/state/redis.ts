import { createRedisClient } from "../connection/config"

const createBrodClient = (name: string) => {
    const connection = createRedisClient();

    connection.on("error", (err) => console.error(`[Redis ${name}] Error:`, err));
    connection.on("connect", () => console.log(`[Redis ${name}] Connected`));
    connection.on("reconnecting", () => console.warn(`[Redis ${name}] Reconnecting...`));

    return connection;
}

export const pub = createBrodClient("Pub");
export const sub = createBrodClient("Sub");

try {
    await Promise.all([pub.connect(), sub.connect()]);
} catch (err) {
    console.error("Failed to connect Redis clients:", err);
}

process.on("SIGINT", async () => {
    console.log("Shutting down Redis connections...");
    await Promise.all([pub.quit(), sub.quit()]);
});