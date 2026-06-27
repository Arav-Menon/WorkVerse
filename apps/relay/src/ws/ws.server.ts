import { Server } from "http";
import { WebSocketServer as WSS, WebSocket } from "ws";
import { wsGateway } from "./ws.gateway.ts";

class SocketRegistry {
    private userSockets = new Map<string, WebSocket>();

    register(userId: string, socket: WebSocket) {
        const existing = this.userSockets.get(userId);
        if (existing && existing !== socket) {
            try { existing.close(); } catch {}
        }
        this.userSockets.set(userId, socket);
        console.log(`[Relay] Registered user=${userId} (total: ${this.userSockets.size})`);
    }

    unregister(userId: string) {
        this.userSockets.delete(userId);
        console.log(`[Relay] Unregistered user=${userId} (total: ${this.userSockets.size})`);
    }

    getSocket(userId: string): WebSocket | undefined {
        return this.userSockets.get(userId);
    }

    sendToUser(userId: string, message: string): boolean {
        const socket = this.userSockets.get(userId);
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
            return true;
        }
        return false;
    }

    sendToRoom(roomId: string, message: string, excludeUserId?: string) {
        for (const [userId, socket] of this.userSockets) {
            if (userId === excludeUserId) continue;
            if ((socket as any).roomId === roomId && socket.readyState === WebSocket.OPEN) {
                try { socket.send(message); } catch {}
            }
        }
    }
}

export const socketRegistry = new SocketRegistry();

export class WebSocketServer {
    private wss: WSS;
    private wsGateWay: typeof wsGateway = wsGateway;
    constructor(private server: Server) {
        this.wss = new WSS({ server });
    }

    initialize() {
        this.wss.on("connection", (socket) => {
            console.log("[Relay] Client connected");

            socket.on("message", async (message) => {
                const wsGateway = this.wsGateWay;
                await wsGateway.handle(socket, message.toString());
            })

            socket.on("close", () => {
                console.log("[Relay] Client disconnected");
                wsGateway.handleDisconnect(socket);
            })
        });

    }
}
