import { transportManager } from "../handlers/transport.handler";

class WsGateway {
    async handle(socket: any, rawMessage: string) {
        try {
            const message = JSON.parse(rawMessage.toString());

            if (message.type === "get-router-capabilities") {
                const capabilities = await transportManager.getRouterCapabilities(message.roomId);
                socket.send(JSON.stringify({
                    type: "router-capabilities",
                    data: capabilities
                }));
            }

            if (message.type === "create-transport") {
                const transportOptions = await transportManager.createTransport(message.roomId, message.userId);
                socket.send(JSON.stringify({
                    type: "transport-created",
                    data: transportOptions
                }));
            }

            if (message.type === "connect-transport") {
                await transportManager.connectTransport(message.transportId, message.dtlsParameters);
                socket.send(JSON.stringify({
                    type: "transport-connected"
                }));
            }

            if (message.type === "produce") {
                const result = await transportManager.produce(
                    message.transportId, 
                    message.kind, 
                    message.rtpParameters, 
                    message.roomId, 
                    message.userId
                );
                socket.send(JSON.stringify({
                    type: "produced",
                    data: result
                }));
            }

            if (message.type === "consume") {
                const consumerOptions = await transportManager.consume(
                    message.transportId,
                    message.producerId,
                    message.rtpCapabilities,
                    message.roomId,
                    message.userId
                );
                socket.send(JSON.stringify({
                    type: "consumed",
                    data: consumerOptions
                }));
            }

        } catch (error) {
            console.error("Error handling message:", error);
            socket.send(JSON.stringify({ error: "Failed to process WebRTC signaling message" }));
        }
    }
}

export const wsGateway = new WsGateway();