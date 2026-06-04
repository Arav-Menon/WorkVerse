import type { FastifyInstance } from "fastify";
import { transportController, getRouterCapabilities, connectTransport, produce, consume } from "../controllers/transport.controller.ts";

export default async function transportRoute(fastify: FastifyInstance) {
    fastify.get("/router-capabilities/:roomId", getRouterCapabilities);
    fastify.post("/create-transport", transportController);
    fastify.post("/connect-transport", connectTransport);
    fastify.post("/produce", produce);
    fastify.post("/consume", consume);
}