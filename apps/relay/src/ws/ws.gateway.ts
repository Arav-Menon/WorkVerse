import { transportManager } from "../handlers/transport.handler";
import { socketRegistry } from "./ws.server";

class WsGateway {
    async handle(socket: any, rawMessage: string) {
        let requestId: string | null = null;
        try {
            const message = JSON.parse(rawMessage.toString());
            requestId = message.requestId;

            const send = (payload: Record<string, any>) => {
                socket.send(JSON.stringify({ ...payload, requestId }));
            };

            if (message.type === "PING") {
                send({ type: "PONG" });
                return;
            }

            if (message.type === "join-room") {
                (socket as any).roomId = message.roomId;
                (socket as any).userId = message.userId;
                socketRegistry.register(message.userId, socket);
                console.log(`[Relay] Peer joined room=${message.roomId} user=${message.userId}`);
                send({ type: "room-joined" });
                return;
            }

            if (message.type === "leave-room") {
                const roomId = (socket as any).roomId;
                const userId = (socket as any).userId;
                if (roomId && userId) {
                    await transportManager.removePeer(roomId, userId);
                    console.log(`[Relay] Peer left room=${roomId} user=${userId}`);
                }
                (socket as any).roomId = null;
                (socket as any).userId = null;
                send({ type: "room-left" });
                return;
            }

            if (message.type === "get-router-capabilities") {
                const capabilities = await transportManager.getRouterCapabilities(message.roomId);
                send({
                    type: "router-capabilities",
                    data: capabilities
                });
                return;
            }

            if (message.type === "create-transport") {
                const transportOptions = await transportManager.createTransport(message.roomId, message.userId);
                send({
                    type: "transport-created",
                    data: transportOptions
                });
                return;
            }

            if (message.type === "connect-transport") {
                await transportManager.connectTransport(message.transportId, message.dtlsParameters);
                send({
                    type: "transport-connected"
                });
                return;
            }

            if (message.type === "produce") {
                const result = await transportManager.produce(
                    message.transportId, 
                    message.kind, 
                    message.rtpParameters, 
                    message.roomId, 
                    message.userId
                );
                send({
                    type: "produced",
                    data: result
                });

                socketRegistry.sendToRoom(
                    message.roomId,
                    JSON.stringify({
                        type: "new-producer",
                        requestId: null,
                        producerId: result.producerId,
                        userId: socket.userId,
                        kind: message.kind,
                    }),
                    socket.userId
                );
                return;
            }

            if (message.type === "consume") {
                const consumerOptions = await transportManager.consume(
                    message.transportId,
                    message.producerId,
                    message.rtpCapabilities,
                    message.roomId,
                    message.userId
                );
                send({
                    type: "consumed",
                    data: consumerOptions
                });
                return;
            }

            if (message.type === "resume-consumer") {
                const result = await transportManager.resumeConsumer(message.consumerId);
                send({
                    type: "consumer-resumed",
                    data: result
                });
                return;
            }

            if (message.type === "pause-producer") {
                try {
                    const result = await transportManager.pauseProducer(message.producerId);
                    send({
                        type: "producer-paused",
                        data: result
                    });
                } catch (err: any) {
                    console.warn(`[Relay] pause-producer failed for ${message.producerId}:`, err.message);
                    send({
                        type: "producer-paused",
                        data: { success: true, note: "producer may already be paused or removed" }
                    });
                }
                return;
            }

            if (message.type === "resume-producer") {
                try {
                    const result = await transportManager.resumeProducer(message.producerId);
                    send({
                        type: "producer-resumed",
                        data: result
                    });
                } catch (err: any) {
                    console.warn(`[Relay] resume-producer failed for ${message.producerId}:`, err.message);
                    send({
                        type: "producer-resumed",
                        data: { success: true, note: "producer may not exist" }
                    });
                }
                return;
            }

            if (message.type === "get-producers") {
                const producers = await transportManager.getProducers(message.roomId, message.userId);
                send({
                    type: "producers-list",
                    data: producers
                });
                return;
            }

            if (message.type === "call-request") {
                const targetSocket = socketRegistry.getSocket(message.targetUserId);
                if (targetSocket && targetSocket.readyState === 1) {
                    targetSocket.send(JSON.stringify({
                        type: "call-request",
                        requestId: null,
                        callerId: socket.userId,
                        callerName: message.callerName,
                        callType: message.callType,
                    }));
                    send({ type: "call-request-sent" });
                } else {
                    send({ type: "error", error: "User is not online" });
                }
                return;
            }

            if (message.type === "call-accepted") {
                socketRegistry.sendToUser(message.targetUserId, JSON.stringify({
                    type: "call-accepted",
                    requestId: null,
                    calleeId: socket.userId,
                }));
                send({ type: "call-accepted-sent" });
                return;
            }

            if (message.type === "call-rejected") {
                socketRegistry.sendToUser(message.targetUserId, JSON.stringify({
                    type: "call-rejected",
                    requestId: null,
                    calleeId: socket.userId,
                }));
                send({ type: "call-rejected-sent" });
                return;
            }

            if (message.type === "call-ended") {
                socketRegistry.sendToUser(message.targetUserId, JSON.stringify({
                    type: "call-ended",
                    requestId: null,
                    callerId: socket.userId,
                }));
                send({ type: "call-ended-sent" });
                return;
            }

            if (message.type === "call-cancelled") {
                socketRegistry.sendToUser(message.targetUserId, JSON.stringify({
                    type: "call-cancelled",
                    requestId: null,
                    callerId: socket.userId,
                }));
                send({ type: "call-cancelled-sent" });
                return;
            }

        } catch (error: any) {
            console.error("[Relay] Error handling message:", error?.message || error);
            try {
                socket.send(JSON.stringify({
                    type: "error",
                    requestId: requestId,
                    error: error?.message || "Failed to process WebRTC signaling message"
                }));
            } catch {}
        }
    }

    async handleDisconnect(socket: any) {
        try {
            const roomId = socket.roomId;
            const userId = socket.userId;
            if (userId) {
                socketRegistry.unregister(userId);
            }
            if (roomId && userId) {
                console.log(`[Relay] Disconnect cleanup room=${roomId} user=${userId}`);
                await transportManager.removePeer(roomId, userId);
            }
        } catch (error) {
            console.error("[Relay] Error during disconnect cleanup:", error);
        }
    }
}

export const wsGateway = new WsGateway();
