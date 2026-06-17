import Redis from "ioredis";
import { redisConfig } from "./config";

export const createRedisSubscriber = () => new Redis(redisConfig);

export const subscriberRedis = createRedisSubscriber();
