import { createClient } from "redis";

export const redisConfig = {
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
    reconnectStrategy: (retries: number) => {
      const delay = Math.min(retries * 50, 2000);
      return delay;
    }
  },
};

export const createRedisClient = () => createClient(redisConfig);

export const client = createRedisClient();
