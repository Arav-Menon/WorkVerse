import { WebSocket } from "ws";
import { client } from "@repo/redis";
import { RedisManager } from "./redis-manager";
import { db } from "@repo/db/db"

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
                    await client.set(`user:${userId}:access`, organizationId, "EX", 24 * 60 * 60);
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
            await client.hset(`space:${workSpaceId}:users`, userId, JSON.stringify(initialPosition));

            await this.redisManager.publish(`space:${workSpaceId}`, {
                type: "JOIN",
                userId,
                position: initialPosition
            });

            const [allUsersRaw, historyRaw] = await Promise.all([
                client.hgetall(`space:${workSpaceId}:users`),
                client.lrange(`space:${workSpaceId}:chat`, 0, -1)
            ]);

            const users: Record<string, any> = {};
            for (const [id, data] of Object.entries(allUsersRaw)) {
                users[id] = JSON.parse(data);
            }

            let chatHistory: any[] = [];

            if (historyRaw.length > 0) {
                chatHistory = historyRaw.map(m => JSON.parse(m));
            } else {
                console.log(`[SpaceManager] Cache miss for ${workSpaceId}. Fetching from DB...`);
                const dbMessages = await db.chatMessage.findMany({
                    where: { workspaceId: workSpaceId },
                    take: 50,
                    orderBy: { createdAt: 'desc' },
                });

                chatHistory = dbMessages.map(m => ({
                    workSpaceId: m.workspaceId,
                    userId: m.userId,
                    chatMessage: m.content,
                    timestamp: m.createdAt.getTime()
                })).reverse();

                if (chatHistory.length > 0) {
                    const historyKey = `space:${workSpaceId}:chat`;
                    for (const msg of chatHistory) {
                        await client.rpush(historyKey, JSON.stringify(msg));
                    }
                    await client.ltrim(historyKey, -50, -1);
                }
            }

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
        await client.hset(`space:${workSpaceId}:users`, userId, JSON.stringify(position));

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

        const historyKey = `space:${workSpaceId}:chat`;
        await client.rpush(historyKey, JSON.stringify(data));
        await client.ltrim(historyKey, -50, -1);
        console.log(`[SpaceManager] Chat saved to Redis: ${historyKey}`);

        await client.lpush("chat_persistence_queue", JSON.stringify(data));

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
            await client.hdel(`space:${workSpaceId}:users`, userId);

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
