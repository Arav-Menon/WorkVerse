import { WebSocket } from "ws";
import { client } from "@repo/redis";

export class spaceManager {
    private workspace: Map<string, Set<WebSocket>> = new Map();

    async addClient(workSpaceId: string, socket: WebSocket, userId: string, organizationId: string) {
        const cachedAccess = await client.get(`user:${userId}:access`);

        if (!cachedAccess) {
            socket.send("Error: Access denied or session expired");
            socket.close(1008);
            return;
        }

        let allowedId: string;
        try {
            allowedId = JSON.parse(cachedAccess);
        } catch {
            allowedId = cachedAccess;
        }

        if (allowedId !== organizationId) {
            socket.send("Error: You do not have access to this workspace");
            socket.close(1008);
            return;
        }

        if (!this.workspace.has(workSpaceId)) {
            this.workspace.set(workSpaceId, new Set());
        }
        this.workspace.get(workSpaceId)!.add(socket);

        socket.send(JSON.stringify({ type: "INFO", message: `Joined workspace: ${workSpaceId}` }));
    }

    removeClient(workSpaceId: string, socket: WebSocket) {
        const clients = this.workspace.get(workSpaceId);
        if (clients) {
            clients.delete(socket);
            if (clients.size === 0) {
                this.workspace.delete(workSpaceId);
            }
        }
    }

    activeUsers(workSpaceId: string) {
        return this.workspace.get(workSpaceId)?.size || 0;
    }


    /**
     * Sends a message to everyone in the workspace.
     * @param excludeSocket - If provided, this socket will NOT receive the message (useful for the sender).
     */
    broadcast(workSpaceId: string, message: any, excludeSocket?: WebSocket) {
        const clients = this.workspace.get(workSpaceId);
        if (!clients) return;

        const payload = typeof message === "string" ? message : JSON.stringify(message);

        clients.forEach((ws) => {
            if (ws !== excludeSocket && ws.readyState === WebSocket.OPEN) {
                ws.send(payload);
            }
        });
    }
}
