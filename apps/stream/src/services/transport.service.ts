import type { FastifyInstance } from "fastify";
import type { TransportInput } from "@repo/schemas";
import { TransportManager } from "../managers/transport.manager.ts";
import type { DtlsParameters, IceCandidate, IceParameters } from "mediasoup/types";

export async function createTransport(fastify: FastifyInstance, input: TransportInput): Promise<{
    id: string,
    iceParameters: IceParameters,
    iceCandidates: IceCandidate[],
    dtlsParameters: DtlsParameters,
}> {
    const { roomId, userId } = input;

    if (!roomId || !userId) throw new Error("please provide roomId and userId");

    return TransportManager.createTransport(roomId, userId);
}