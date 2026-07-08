import Redis from "ioredis";
import { redisConfig } from "./config";

const createRedisPublisher = () =>
  typeof redisConfig === "string"
    ? new Redis(redisConfig)
    : new Redis(redisConfig);

export const publisherRedis = createRedisPublisher();
publisherRedis.on("error", (err) => console.error("[Redis Publisher] Error:", err));
