import fp from "fastify-plugin";
import fastifyRateLimit from "@fastify/rate-limit";
import { client } from "@repo/redis";

export const rateLimitPlugin = fp(async (fastify) => {
  await fastify.register(fastifyRateLimit, {
    redis: client,
    global: false,
    errorResponseBuilder: (request, context) => ({
      statusCode: 429,
      error: "Too Many Requests",
      message: `Rate limit exceeded, retry in ${context.after}`,
      retryAfter: context.after,
    }),
  });
});
