import Redis from "ioredis";
import { redisConfig } from "./config";

const createRedisSubscriber = () => new Redis(redisConfig);

export const publisherRedis = createRedisSubscriber();
