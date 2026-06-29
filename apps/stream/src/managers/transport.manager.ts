import { roomManager } from "./router.manager"
import type { DtlsParameters, WebRtcTransport, Consumer, Producer } from "mediasoup/types";
import { producerManager } from "../services/producer.manager";

type PeerTransport = {
    peerId: string,
    roomId: string,
    transport: WebRtcTransport
}

type TrackedConsumer = {
    consumerId: string;
    transportId: string;
    roomId: string;
    userId: string;
    producerId: string;
    consumer: Consumer;
};

class RtcTransportManager {
    private transports = new Map<string, PeerTransport>()
    private consumers = new Map<string, TrackedConsumer>()
    private peerTransports = new Map<string, Set<string>>()
    private producers = new Map<string, Producer>()

    async createTransport(roomId: string, peerId: string) {
        const room = await roomManager.obtainRoom(roomId);
        const router = room.router;
        const transport = await router.createWebRtcTransport({
            listenIps: [
                {
                    ip: process.env.MEDIASOUP_LISTEN_IP || "127.0.0.1",
                    announcedIp: process.env.SERVER_PUBLIC_IP || "127.0.0.1"
                }
            ],
            enableUdp: true,
            enableTcp: true,
            preferUdp: true,
        });

        transport.on("@close" as any, () => {
            console.log(`[TransportManager] Transport closed id=${transport.id} peer=${peerId}`);
            this.transports.delete(transport.id);
            this.removePeerTransport(peerId, transport.id);
        });

        this.transports.set(transport.id, {
            peerId,
            roomId,
            transport
        });

        this.addPeerTransport(peerId, transport.id);

        console.log(`[TransportManager] Created transport id=${transport.id} room=${roomId} peer=${peerId}`);
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

        await transport.connect({ dtlsParameters });
        console.log(`[TransportManager] Connected transport id=${transportId}`);
    }

    findTransport(transportId: string) {
        return this.transports.get(transportId)?.transport || null;
    }

    getTransportInfo(transportId: string): PeerTransport | undefined {
        return this.transports.get(transportId);
    }

    async produce(transportId: string, kind: "audio" | "video", rtpParameters: any, roomId?: string, userId?: string) {
        const transport = this.findTransport(transportId);
        if (!transport) throw new Error("Transport not found");

        const producer = await transport.produce({ kind, rtpParameters });

        this.producers.set(producer.id, producer);

        producer.on("transportclose", () => {
            console.log(`[TransportManager] Producer ${producer.id} transport closed`);
            this.producers.delete(producer.id);
            producer.close();
            producerManager.removeProducer(producer.id);
        });

        producer.on("@close" as any, () => {
            console.log(`[TransportManager] Producer ${producer.id} closed`);
            this.producers.delete(producer.id);
            producerManager.removeProducer(producer.id);
        });

        if (roomId && userId) {
            producerManager.trackProducer(producer.id, roomId, userId, kind);
        }

        console.log(`[TransportManager] Created producer id=${producer.id} kind=${kind} peer=${userId}`);
        return producer.id;
    }

    async consume(transportId: string, producerId: string, rtpCapabilities: any, roomId: string, userId?: string) {
        const transport = this.findTransport(transportId);
        if (!transport) throw new Error("Transport not found");

        const room = roomManager.getRoom(roomId);
        if (!room) throw new Error("Room not found");

        if (!room.router.canConsume({ producerId, rtpCapabilities })) {
            throw new Error("Cannot consume this producer");
        }

        const consumer = await transport.consume({
            producerId,
            rtpCapabilities,
            paused: true
        });

        consumer.on("transportclose", () => {
            console.log(`[TransportManager] Consumer ${consumer.id} transport closed`);
            this.consumers.delete(consumer.id);
        });

        consumer.on("producerclose", () => {
            console.log(`[TransportManager] Consumer ${consumer.id} producer closed`);
            this.consumers.delete(consumer.id);
        });

        if (userId) {
            this.consumers.set(consumer.id, {
                consumerId: consumer.id,
                transportId,
                roomId,
                userId,
                producerId,
                consumer
            });
        }

        console.log(`[TransportManager] Created consumer id=${consumer.id} producer=${producerId} peer=${userId}`);
        return {
            id: consumer.id,
            producerId: producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters
        };
    }

    async resumeConsumer(consumerId: string) {
        const tracked = this.consumers.get(consumerId);
        if (!tracked) throw new Error("Consumer not found");

        await tracked.consumer.resume();
        console.log(`[TransportManager] Resumed consumer id=${consumerId}`);
        return { success: true };
    }

    closeConsumer(consumerId: string) {
        const tracked = this.consumers.get(consumerId);
        if (tracked) {
            tracked.consumer.close();
            this.consumers.delete(consumerId);
            console.log(`[TransportManager] Closed consumer id=${consumerId}`);
        }
    }

    async pauseProducer(producerId: string) {
        const producer = this.producers.get(producerId);
        if (!producer) {
            console.warn(`[TransportManager] pauseProducer: producer ${producerId} not found (may already be closed)`);
            return { success: true, note: "producer not found" };
        }
        producer.pause();
        console.log(`[TransportManager] Paused producer id=${producerId}`);
        return { success: true };
    }

    async resumeProducer(producerId: string) {
        const producer = this.producers.get(producerId);
        if (!producer) {
            console.warn(`[TransportManager] resumeProducer: producer ${producerId} not found (may already be closed)`);
            return { success: true, note: "producer not found" };
        }
        producer.resume();
        console.log(`[TransportManager] Resumed producer id=${producerId}`);
        return { success: true };
    }

    closeTransport(transportId: string) {
        const transport = this.findTransport(transportId);
        if (!transport) return;
        transport.close()
    }

    removePeer(roomId: string, userId: string) {
        const peerKey = `${roomId}:${userId}`;
        const transportIds = this.peerTransports.get(peerKey);

        if (transportIds) {
            for (const transportId of transportIds) {
                const peerTransport = this.transports.get(transportId);
                if (peerTransport) {
                    try {
                        peerTransport.transport.close();
                    } catch (e) {
                        // Already closed
                    }
                    this.transports.delete(transportId);
                }
            }
            this.peerTransports.delete(peerKey);
        }

        producerManager.removeProducersForUser(roomId, userId);

        const consumersToRemove: string[] = [];
        for (const [id, tracked] of this.consumers.entries()) {
            if (tracked.roomId === roomId && tracked.userId === userId) {
                consumersToRemove.push(id);
            }
        }
        for (const id of consumersToRemove) {
            const tracked = this.consumers.get(id);
            if (tracked) {
                try {
                    tracked.consumer.close();
                } catch (e) {
                    // Already closed
                }
            }
            this.consumers.delete(id);
        }

        console.log(`[TransportManager] Cleaned up peer room=${roomId} user=${userId}`);
    }

    private addPeerTransport(userId: string, transportId: string) {
        if (!this.peerTransports.has(userId)) {
            this.peerTransports.set(userId, new Set());
        }
        this.peerTransports.get(userId)!.add(transportId);
    }

    private removePeerTransport(userId: string, transportId: string) {
        const set = this.peerTransports.get(userId);
        if (set) {
            set.delete(transportId);
            if (set.size === 0) {
                this.peerTransports.delete(userId);
            }
        }
    }

    getConsumersForUser(roomId: string, userId: string): TrackedConsumer[] {
        const result: TrackedConsumer[] = [];
        for (const tracked of this.consumers.values()) {
            if (tracked.roomId === roomId && tracked.userId === userId) {
                result.push(tracked);
            }
        }
        return result;
    }
}

export const TransportManager = new RtcTransportManager();
