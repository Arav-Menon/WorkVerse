import fp from "fastify-plugin";
import fastifyCors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

export default fp(async (fastify: FastifyInstance) => {
    fastify.register(fastifyCors, {
        origin: process.env.CORS_ORIGIN ?? "*",
        credentials: true,
    });
});
