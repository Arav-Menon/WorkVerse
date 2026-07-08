import Redis from "ioredis";
import { redisConfig } from "./config";

const createRedisPublisher = () => {
  const isUrl = typeof redisConfig === "string";
  const client = isUrl
    ? new Redis(redisConfig, { lazyConnect: true })
    : new Redis(redisConfig);

  client.on("error", (err) => {
    const target = isUrl ? redisConfig : `${(redisConfig as any).host}:${(redisConfig as any).port}`;
    console.error(`[Redis Publisher] Connection error → target=${target}`, err.message);
  });
  client.on("connect", () => console.log("[Redis Publisher] Connected"));
  client.on("ready", () => console.log("[Redis Publisher] Ready"));
  client.on("close", () => console.warn("[Redis Publisher] Connection closed"));
  client.on("reconnecting", (delay: number) => console.warn(`[Redis Publisher] Reconnecting in ${delay}ms...`));

  return client;
};

export const publisherRedis = createRedisPublisher();
