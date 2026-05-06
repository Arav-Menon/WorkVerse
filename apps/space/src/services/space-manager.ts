import { WebSocket } from "ws";
import { client } from "@repo/redis";
import { RedisManager } from "./redis-manager";
import { db } from "@repo/db/db"
import { timeStamp } from "node:console";

export class spaceManager {
    private workspace: Map<string, Set<WebSocket>> = new Map();
    private redisManager: RedisManager;

    constructor(redisManager: RedisManager) {
        this.redisManager = redisManager;
    }

    async addClient(workSpaceId: string, socket: WebSocket, userId: string, organizationId: string) {
        try {

            let cachedAccess = await client.get(`user:${userId}:access`);

            if (!cachedAccess) {
                const member = await db.organizationMember.findFirst({
                    where: {
                        userId: userId,
                        organizationId: organizationId
                    }
                })

                if (member) {
                    cachedAccess = organizationId;
                    await client.set(`user:${userId}:access`, organizationId, { EX: 3600 })
                } else {
                    socket.send("Error: Access denied");
                    socket.close(1008);
                    return;
                }
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

            const initialPosition = { x: 0, y: 0 };
            await client.hSet(`space:${workSpaceId}:users`, userId, JSON.stringify(initialPosition));

            await this.redisManager.publish(`space:${workSpaceId}`, {
                type: "JOIN",
                userId,
                position: initialPosition
            });

            const [allUsersRaw, historyRaw] = await Promise.all([
                client.hGetAll(`space:${workSpaceId}:users`),
                client.lRange(`space:${workSpaceId}:chat`, 0, -1)
            ]);

            const users: Record<string, any> = {};
            for (const [id, data] of Object.entries(allUsersRaw)) {
                users[id] = JSON.parse(data);
            }

            const chatHistory = historyRaw.map(m => JSON.parse(m));

            socket.send(JSON.stringify({
                type: "SPACE_JOINED",
                message: `Joined workspace: ${workSpaceId}`,
                users,
                chatHistory
            }));

        } catch (error: any) {
            console.log(`${error}`)
            socket.send(JSON.stringify({ type: "Error", message: "Internal server error" }))
        }
    }

    async moveClient(workSpaceId: string, userId: string, position: { x: number, y: number }) {
        await client.hSet(`space:${workSpaceId}:users`, userId, JSON.stringify(position));

        await this.redisManager.publish(`space:${workSpaceId}`, {
            type: "MOVE",
            userId,
            position
        });
    }

    async chatMessage(workSpaceId: string, userId: string, chatMessage: string) {
        const timestamp = Date.now();
        const data = {
            workSpaceId,
            userId,
            chatMessage,
            timestamp
        };

        // 1. Hot History (Capped at last 50 messages for this specific room)
        // Using rPush/lTrim to keep a rolling window of recent history
        await client.rPush(`space:${workSpaceId}:chat`, JSON.stringify(data));
        await client.lTrim(`space:${workSpaceId}:chat`, -50, -1);

        // 2. Persistence Queue (Global queue for the background worker to dump into Postgres)
        await client.lPush("chat_persistence_queue", JSON.stringify(data));

        // 3. Real-time Broadcast to all server instances
        await this.redisManager.publish(`space:${workSpaceId}`, {
            type: "CHAT",
            ...data
        });
    }

    broadcastLocal(workSpaceId: string, message: any) {
        const clients = this.workspace.get(workSpaceId);
        if (!clients) return;

        const payload = typeof message === "string" ? message : JSON.stringify(message);

        clients.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(payload);
            }
        });
    }

    async removeClient(workSpaceId: string, socket: WebSocket) {
        const userId = (socket as any).userId;
        const clients = this.workspace.get(workSpaceId);
        if (clients) {
            clients.delete(socket);
            if (clients.size === 0) {
                this.workspace.delete(workSpaceId);
            }
        }

        if (userId) {
            await client.hDel(`space:${workSpaceId}:users`, userId);

            await this.redisManager.publish(`space:${workSpaceId}`, {
                type: "LEAVE",
                userId
            });
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
