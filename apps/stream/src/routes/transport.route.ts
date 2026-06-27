import type { FastifyInstance } from "fastify";
import {
    transportController,
    getRouterCapabilities,
    connectTransport,
    produce,
    consume,
    resumeConsumer,
    getProducers,
    removePeer,
    pauseProducer,
    resumeProducer
} from "../controllers/transport.controller.ts";

export default async function transportRoute(fastify: FastifyInstance) {
    fastify.get("/router-capabilities/:roomId", getRouterCapabilities);
    fastify.post("/create-transport", transportController);
    fastify.post("/connect-transport", connectTransport);
    fastify.post("/produce", produce);
    fastify.post("/consume", consume);
    fastify.post("/resume-consumer", resumeConsumer);
    fastify.get("/producers/:roomId/:userId", getProducers);
    fastify.post("/pause-producer", pauseProducer);
    fastify.post("/resume-producer", resumeProducer);
    fastify.post("/remove-peer", removePeer);
}
