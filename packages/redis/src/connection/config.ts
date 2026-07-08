import { Redis } from "ioredis";
import type { RedisOptions } from "ioredis";

function buildRedisConfig(): RedisOptions | string {
  // Production: REDIS_URL takes priority (Upstash, cloud Redis, etc.)
  if (process.env.REDIS_URL) {
    console.log("[Redis Config] Using REDIS_URL (host/port ignored)");
    return process.env.REDIS_URL;
  }

  const host = process.env.REDIS_HOST;
  const port = process.env.REDIS_PORT;

  if (!host) {
    console.error(
      "[Redis Config] WARNING: REDIS_HOST is not set. " +
      "Defaulting to 'localhost' — this WILL fail in Kubernetes " +
      "because Redis runs in a separate pod."
    );
  }

  console.log(`[Redis Config] host=${host || "localhost (DEFAULT)"} port=${port || "6379 (DEFAULT)"}`);

  // Local development: host/port with optional username/password
  const config: RedisOptions = {
    host: host || "localhost",
    port: parseInt(port || "6379"),
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

export const createRedisClient = () => {
  const isUrl = typeof redisConfig === "string";
  const client = isUrl
    ? new Redis(redisConfig, { lazyConnect: true })
    : new Redis(redisConfig);

  client.on("error", (err) => {
    const target = isUrl ? redisConfig : `${(redisConfig as RedisOptions).host}:${(redisConfig as RedisOptions).port}`;
    console.error(`[Redis Client] Connection error → target=${target}`, err.message);
  });
  client.on("connect", () => console.log("[Redis Client] Connected"));
  client.on("ready", () => console.log("[Redis Client] Ready"));
  client.on("close", () => console.warn("[Redis Client] Connection closed"));
  client.on("reconnecting", (delay: number) => console.warn(`[Redis Client] Reconnecting in ${delay}ms...`));

  return client;
};

export const client = createRedisClient();
