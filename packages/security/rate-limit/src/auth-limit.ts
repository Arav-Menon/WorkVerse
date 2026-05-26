import fp from "fastify-plugin";
import fastifyRateLimit from "@fastify/rate-limit";
import { client } from "@repo/redis";
import type { AuthRateLimitOptions } from "../limit-validation-options/options";

export const authRateLimit = fp(
  async (fastify, options: AuthRateLimitOptions = {}) => {
    const { redis = client, max = 5, timeWindow = 300000 } = options;

    await fastify.register(fastifyRateLimit, {
      redis,
      max,
      timeWindow,
      keyGenerator: (request) => {
        const ip = request.ip;
        const bodyEmail = (request.body as any)?.email;
        const queryEmail = (request.query as any)?.email;
        const email = bodyEmail || queryEmail || "anonymous";

        return `ratelimit:auth:${ip}:${email}`;
      },
      errorResponseBuilder: (request, context) => {
        return {
          statusCode: 429,
          error: "Too Many Requests",
          message: `Rate limit exceeded, retry in ${context.after}`,
          retryAfter: context.after,
        };
      },
    });
  },
);
