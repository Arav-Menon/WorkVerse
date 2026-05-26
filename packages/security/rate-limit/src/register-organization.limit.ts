import fp from "fastify-plugin";
import fastifyRateLimit from "@fastify/rate-limit";
import { client } from "@repo/redis";
import type { RegisterOrgRateLimitOptions } from "../limit-validation-options/options";

export const orgRateLimit = fp(
  async (fastify, options: RegisterOrgRateLimitOptions = {}) => {
    const { redis = client, max = 10, timeWindow = 120000 } = options;

    await fastify.register(fastifyRateLimit, {
      redis,
      max,
      timeWindow,
      keyGenerator: (req) => {
        const ip = req.ip;
        const bodyEmail = (req.body as any)?.email;
        const queryEmail = (req.query as any)?.email;
        const email = bodyEmail || queryEmail || "anonymous";
        return `ratelimit:auth: ${ip}:${email}`;
      },
      errorResponseBuilder: (request, context) => {
        return {
          statuscode: 429,
          error: "Too Many Requests",
          message: `Rate limit exceeded, retry in ${context.after}`,
          retryAfter: context.after,
        };
      },
    });
  },
);
