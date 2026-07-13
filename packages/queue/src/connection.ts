import { redisConfig } from "@repo/redis";

export const connection = typeof redisConfig === "string"
  ? { url: redisConfig }
  : {
      host: redisConfig.host,
      port: redisConfig.port,
      username: redisConfig.username,
      password: redisConfig.password,
    };
