import { createClient } from "redis";

const redisConfig = {
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379"),
  },
};

export const client = await createClient(redisConfig)
  .on("error", (err) => console.log("Redis client error", err))
  .connect();
