import Redis from "ioredis";
import { redisConfig } from "./config";

const createRedisPublisher = () =>
  typeof redisConfig === "string"
    ? new Redis(redisConfig)
    : new Redis(redisConfig);

export const publisherRedis = createRedisPublisher();
