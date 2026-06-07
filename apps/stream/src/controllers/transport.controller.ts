import type { FastifyReply, FastifyRequest } from "fastify";
import { createTransport } from "../services/transport.service.ts";
import { TransportManager } from "../managers/transport.manager.ts";
import { roomManager } from "../managers/router.manager.ts";

export async function transportController(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    try {
        const response = await createTransport(request.server, request.body as any)
        return response;
    } catch (err: any) {
        return reply.status(500).send({ success: false, message: err.message });
    }
}

export async function getRouterCapabilities(request: FastifyRequest<{ Params: { roomId: string } }>, reply: FastifyReply) {
    try {
        const room = await roomManager.obtainRoom(request.params.roomId);
        return room.router.rtpCapabilities;
    } catch (err: any) {
        return reply.status(500).send({ success: false, message: err.message });
    }
}

export async function connectTransport(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    try {
        const { transportId, dtlsParameters } = request.body as any;
        await TransportManager.connectTransport(transportId, dtlsParameters);
        return { success: true };
    } catch (err: any) {
        return reply.status(500).send({ success: false, message: err.message });
    }
}

export async function produce(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    try {
        const { transportId, kind, rtpParameters } = request.body as any;
        const producerId = await TransportManager.produce(transportId, kind, rtpParameters);
        return { producerId };
    } catch (err: any) {
        return reply.status(500).send({ success: false, message: err.message });
    }
}

export async function consume(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    try {
        const { transportId, producerId, rtpCapabilities, roomId } = request.body as any;
        const result = await TransportManager.consume(transportId, producerId, rtpCapabilities, roomId);
        return result;
    } catch (err: any) {
        return reply.status(500).send({ success: false, message: err.message });
    }
}