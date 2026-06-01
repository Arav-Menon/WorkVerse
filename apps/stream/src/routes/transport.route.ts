import type { FastifyInstance } from "fastify";
import type { TransportInput } from "@repo/schemas";
import { transportController } from "../controllers/transport.controller.ts";

export default async function transportRoute(fastify: FastifyInstance) {
    fastify.post<{ Body: TransportInput }>("/create-transport", {
        // schema: {
        //     body: $ref("createTransportSchema"),
        //     response: { 201: $ref("createTransportResponseSchema") },
        // },
        handler: transportController
    })
}