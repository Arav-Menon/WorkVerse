import Redis from "ioredis";
import { redisConfig } from "./config";

export const createRedisSubscriber = () => {
  const isUrl = typeof redisConfig === "string";
  const client = isUrl
    ? new Redis(redisConfig, { lazyConnect: true })
    : new Redis(redisConfig);

  client.on("error", (err) => {
    const target = isUrl ? redisConfig : `${(redisConfig as any).host}:${(redisConfig as any).port}`;
    console.error(`[Redis Subscriber] Connection error → target=${target}`, err.message);
  });
  client.on("connect", () => console.log("[Redis Subscriber] Connected"));
  client.on("ready", () => console.log("[Redis Subscriber] Ready"));
  client.on("close", () => console.warn("[Redis Subscriber] Connection closed"));
  client.on("reconnecting", (delay: number) => console.warn(`[Redis Subscriber] Reconnecting in ${delay}ms...`));

  return client;
};

export const subscriberRedis = createRedisSubscriber();
