import type { FastifyInstance } from "fastify";
import type { TransportInput } from "@repo/schemas"

export function createTransport(fastify: FastifyInstance, input: TransportInput) {
    const { roomId, userId } = input;



}