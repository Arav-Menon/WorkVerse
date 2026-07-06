import { Redis } from "ioredis";
import type { RedisOptions } from "ioredis";

function buildRedisConfig(): RedisOptions | string {
  // Production: REDIS_URL takes priority (Upstash, cloud Redis, etc.)
  if (process.env.REDIS_URL) {
    return process.env.REDIS_URL;
  }

  // Local development: host/port with optional username/password
  const config: RedisOptions = {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    lazyConnect: true,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    maxRetriesPerRequest: null,
  };

  if (process.env.REDIS_USERNAME) {
    config.username = process.env.REDIS_USERNAME;
  }
  if (process.env.REDIS_PASSWORD) {
    config.password = process.env.REDIS_PASSWORD;
  }

  return config;
}

export const redisConfig = buildRedisConfig();

export const createRedisClient = () =>
  typeof redisConfig === "string"
    ? new Redis(redisConfig)
    : new Redis(redisConfig);

export const client = createRedisClient();
