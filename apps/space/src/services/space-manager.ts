import { WebSocket } from "ws";
import { client } from "@repo/redis";
import { RedisManager } from "./redis-manager";
import { db } from "@repo/db/db"

const AVATAR_COLORS = [
    "#d06858", "#4a70c0", "#5a9060",
    "#9070b0", "#c09030", "#708898",
];

function pickColor(userId: string): string {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0;
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]!;
}

export interface SpaceUser {
    userId: string;
    username: string;
    position: { x: number; y: number };
    color: string;
}

export class spaceManager {
    private workspace: Map<string, Set<WebSocket>> = new Map();
    private workspaceUsers: Map<string, Set<string>> = new Map();
    private userSocketCount: Map<string, Map<string, number>> = new Map();
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

            if (!this.workspaceUsers.has(workSpaceId)) {
                this.workspaceUsers.set(workSpaceId, new Set());
            }
            const isFirstSocket = !this.workspaceUsers.get(workSpaceId)!.has(userId);
            this.workspaceUsers.get(workSpaceId)!.add(userId);

            if (!this.userSocketCount.has(workSpaceId)) {
                this.userSocketCount.set(workSpaceId, new Map());
            }
            const wsSocketCounts = this.userSocketCount.get(workSpaceId)!;
            wsSocketCounts.set(userId, (wsSocketCounts.get(userId) || 0) + 1);

            const user = await db.user.findUnique({ where: { id: userId }, select: { name: true } });
            const username = user?.name || "Anonymous";
            const color = pickColor(userId);
            const initialPosition = { x: 0, y: 0 };

            const spaceUser: SpaceUser = { userId, username, position: initialPosition, color };
            await client.hset(`space:${workSpaceId}:users`, userId, JSON.stringify(spaceUser));

            const onlineCount = this.activeUsers(workSpaceId);

            if (isFirstSocket) {
                await this.redisManager.publish(`space:${workSpaceId}`, {
                    type: "USER_JOINED",
                    user: spaceUser,
                    onlineCount
                });
            }

            const [allUsersRaw, historyRaw] = await Promise.all([
                client.hgetall(`space:${workSpaceId}:users`),
                client.lrange(`space:${workSpaceId}:chat`, 0, -1)
            ]);

            const users: SpaceUser[] = [];
            for (const [id, data] of Object.entries(allUsersRaw)) {
                try {
                    users.push(JSON.parse(data));
                } catch {
                    const pos = JSON.parse(data);
                    users.push({ userId: id, username: "User", position: pos, color: pickColor(id) });
                }
            }

            let chatHistory: any[] = [];

            if (historyRaw.length > 0) {
                chatHistory = historyRaw.map(m => JSON.parse(m));
            } else {
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
                type: "SPACE_STATE",
                users,
                chatHistory
            }));

        } catch (error: any) {
            console.error(`[SpaceManager] Error in addClient:`, error);
            socket.send(JSON.stringify({ type: "Error", message: "Internal server error" }))
        }
    }

    async moveClient(workSpaceId: string, userId: string, position: { x: number, y: number }) {
        console.log("some")
        const raw = await client.hget(`space:${workSpaceId}:users`, userId);
        if (!raw) return;
        let spaceUser: SpaceUser;
        try {
            spaceUser = JSON.parse(raw);
            spaceUser.position = position;
        } catch {
            spaceUser = { userId, username: "User", position, color: pickColor(userId) };
        }

        await client.hset(`space:${workSpaceId}:users`, userId, JSON.stringify(spaceUser));

        await this.redisManager.publish(`space:${workSpaceId}`, {
            type: "PLAYER_MOVED",
            userId,
            position
        });
        const PROXIMITY_THRESHOLD = 50;
        const allUsersRaw = await client.hgetall(`space:${workSpaceId}:users`);

        for (const [otherUserId, data] of Object.entries(allUsersRaw)) {
            if (otherUserId === userId) continue;

            try {
                const other: SpaceUser = JSON.parse(data);
                const distance = Math.sqrt(
                    Math.pow(other.position.x - position.x, 2) + Math.pow(other.position.y - position.y, 2)
                );

                if (distance <= PROXIMITY_THRESHOLD) {
                    await this.redisManager.publish(`space:${workSpaceId}`, {
                        type: "CAN_CONNECT",
                        users: [userId, otherUserId]
                    });
                }
            } catch (err) {
                console.error("Error calculating proximity", err);
            }
        }
    }

    async chatMessage(workSpaceId: string, userId: string, chatMessage: string) {
        const timestamp = Date.now();

        let username = "Anonymous";
        let color = pickColor(userId);
        const userRaw = await client.hget(`space:${workSpaceId}:users`, userId);
        if (userRaw) {
            try {
                const spaceUser: SpaceUser = JSON.parse(userRaw);
                username = spaceUser.username;
                color = spaceUser.color;
            } catch {}
        }

        const data = {
            workSpaceId,
            userId,
            chatMessage,
            timestamp,
            username,
            color
        };

        const historyKey = `space:${workSpaceId}:chat`;
        await client.rpush(historyKey, JSON.stringify(data));
        await client.ltrim(historyKey, -50, -1);

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
            const wsSocketCounts = this.userSocketCount.get(workSpaceId);
            if (wsSocketCounts) {
                const currentCount = wsSocketCounts.get(userId) || 0;
                if (currentCount <= 1) {
                    wsSocketCounts.delete(userId);
                } else {
                    wsSocketCounts.set(userId, currentCount - 1);
                }
            }

            const userSet = this.workspaceUsers.get(workSpaceId);
            const stillHasSocket = wsSocketCounts?.has(userId) && (wsSocketCounts.get(userId) || 0) > 0;

            if (userSet && !stillHasSocket) {
                userSet.delete(userId);
                if (userSet.size === 0) {
                    this.workspaceUsers.delete(workSpaceId);
                }

                await client.hdel(`space:${workSpaceId}:users`, userId);
            }

            const remainingCount = this.activeUsers(workSpaceId);

            await this.redisManager.publish(`space:${workSpaceId}`, {
                type: "USER_LEFT",
                userId,
                onlineCount: remainingCount
            });

            await this.redisManager.publish(`space:${workSpaceId}`, {
                type: "SPACE_PRESENCE_UPDATED",
                onlineCount: remainingCount
            });
        }
    }

    activeUsers(workSpaceId: string) {
        return this.workspaceUsers.get(workSpaceId)?.size || 0;
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
