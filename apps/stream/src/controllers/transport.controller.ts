import type { FastifyReply, FastifyRequest } from "fastify";
import { createTransport } from "../services/transport.service.ts";
import { TransportManager } from "../managers/transport.manager.ts";
import { roomManager } from "../managers/router.manager.ts";
import { producerManager } from "../services/producer.manager.ts";

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
        const { transportId, kind, rtpParameters, roomId, userId } = request.body as any;
        const producerId = await TransportManager.produce(transportId, kind, rtpParameters, roomId, userId);
        return { producerId };
    } catch (err: any) {
        return reply.status(500).send({ success: false, message: err.message });
    }
}

export async function consume(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    try {
        const { transportId, producerId, rtpCapabilities, roomId, userId } = request.body as any;
        const result = await TransportManager.consume(transportId, producerId, rtpCapabilities, roomId, userId);
        return result;
    } catch (err: any) {
        return reply.status(500).send({ success: false, message: err.message });
    }
}

export async function resumeConsumer(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    try {
        const { consumerId } = request.body as any;
        const result = await TransportManager.resumeConsumer(consumerId);
        return result;
    } catch (err: any) {
        return reply.status(500).send({ success: false, message: err.message });
    }
}

export async function getProducers(request: FastifyRequest<{ Params: { roomId: string; userId: string } }>, reply: FastifyReply) {
    try {
        const { roomId, userId } = request.params;
        const producers = producerManager.getProducersForRoomExcluding(roomId, userId);
        return { producers };
    } catch (err: any) {
        return reply.status(500).send({ success: false, message: err.message });
    }
}

export async function pauseProducer(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    try {
        const { producerId } = request.body as any;
        const result = await TransportManager.pauseProducer(producerId);
        return result;
    } catch (err: any) {
        return reply.status(500).send({ success: false, message: err.message });
    }
}

export async function resumeProducer(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    try {
        const { producerId } = request.body as any;
        const result = await TransportManager.resumeProducer(producerId);
        return result;
    } catch (err: any) {
        return reply.status(500).send({ success: false, message: err.message });
    }
}

export async function removePeer(request: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    try {
        const { roomId, userId } = request.body as any;
        TransportManager.removePeer(roomId, userId);
        return { success: true };
    } catch (err: any) {
        return reply.status(500).send({ success: false, message: err.message });
    }
}
