import fp from "fastify-plugin";
import { clerkPlugin } from "@clerk/fastify";

export default fp(async (fastify) => {
  await fastify.register(clerkPlugin);
});
