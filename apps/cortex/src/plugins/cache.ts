import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { client } from "@repo/redis/redis-client";

declare module "fastify" {
  interface FastifyInstance {
    cache: typeof client;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate("cache", client);
  fastify.addHook("onClose", async () => {
    await client.disconnect();
  });
});
