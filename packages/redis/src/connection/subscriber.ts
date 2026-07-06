import Redis from "ioredis";
import { redisConfig } from "./config";

export const createRedisSubscriber = () =>
  typeof redisConfig === "string"
    ? new Redis(redisConfig)
    : new Redis(redisConfig);

export const subscriberRedis = createRedisSubscriber();
