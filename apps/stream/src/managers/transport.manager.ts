import { roomManager } from "./router.manager"
import type { DtlsParameters, WebRtcTransport } from "mediasoup/types";

type PeerTransport = {
    peerId: string,
    roomId: string,
    transport: WebRtcTransport
}

class RtcTransportManager {
    private transports = new Map<string, PeerTransport>()

    async createTransport(roomId: string, peerId: string) {
        const room = await roomManager.obtainRoom(roomId);
        const router = room.router;
        const transport = await router.createWebRtcTransport({
            listenIps: [
                {
                    ip: process.env.MEDIASOUP_LISTEN_IP || "127.0.0.1",
                    announcedIp: "43.251.215.146"
                }
            ],
            enableUdp: true,
            enableTcp: true,
            preferUdp: true,
        });
        this.transports.set(transport.id, {
            peerId,
            roomId,
            transport
        });
        return {
            id: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters
        };
    }

    async connectTransport(transportId: string, dtlsParameters: DtlsParameters) {
        const transport = this.findTransport(transportId);
        if (!transport) throw new Error("Transport not found")

        const transportConnected = await transport.connect({ dtlsParameters });
        console.log(transportConnected);
    }
    findTransport(transportId: string) {
        return this.transports.get(transportId)?.transport || null;
    }

    async produce(transportId: string, kind: "audio" | "video", rtpParameters: any) {
        const transport = this.findTransport(transportId);
        if (!transport) throw new Error("Transport not found");

        const producer = await transport.produce({ kind, rtpParameters });
        
        // Mediasoup requires us to handle producer events (like close)
        producer.on("transportclose", () => {
            producer.close();
        });

        return producer.id;
    }

    async consume(transportId: string, producerId: string, rtpCapabilities: any, roomId: string) {
        const transport = this.findTransport(transportId);
        if (!transport) throw new Error("Transport not found");

        const room = roomManager.getRoom(roomId);
        if (!room) throw new Error("Room not found");

        // The router needs to check if we can consume this producer
        if (!room.router.canConsume({ producerId, rtpCapabilities })) {
            throw new Error("Cannot consume this producer");
        }

        const consumer = await transport.consume({
            producerId,
            rtpCapabilities,
            paused: true // Best practice: start paused, then let client unpause when ready
        });

        consumer.on("transportclose", () => {
            consumer.close();
        });

        consumer.on("producerclose", () => {
            consumer.close();
        });

        return {
            id: consumer.id,
            producerId: producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters
        };
    }

    closeTransport(transportId: string) {
        const transport = this.findTransport(transportId);
        if (!transport) return;
        transport.close()
    }

}

export const TransportManager = new RtcTransportManager();