import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import * as redisProducer from "@repo/redis/redis-client";

declare module "fastify" {
  interface FastifyInstance {
    redisProducer: typeof redisProducer;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate("redisProducer", redisProducer);
});
