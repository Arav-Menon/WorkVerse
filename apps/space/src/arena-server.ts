import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { spaceManager } from "./services/space-manager";
import { authenticate } from "./middleware/verify";
import { JOIN_SPACE } from "../config/config";
import { RedisManager } from "./services/redis-manager";

export class workspaceServer {
    private wss: WebSocketServer;
    private spaceManager: spaceManager;
    private redisManager: RedisManager;

    constructor(port: number, pubClient: any) {
        this.wss = new WebSocketServer({ port });
        this.spaceManager = new spaceManager();
        this.redisManager = new RedisManager(pubClient)
    }

    async start() {
        try {

            await this.redisManager.init()

            this.wss.on("connection", (socket, req) => {
                this.handleConnection(socket, req);

                const acitveUsers = this.wss.clients.size
                socket.send(`Total active user :- ${acitveUsers}`)
            });
            this.setupHeartbeat();
            const port = this.wss.options.port;
            console.log(`Workspace is running on port ${port}`);
        } catch (error) {
            console.error(`Failed to start workspace server:`, error);
            process.exit(1);
        }
    }

    private setupHeartbeat() {
        setInterval(() => {
            this.wss.clients.forEach((ws: any) => {
                if (ws.isAlive === false) return ws.terminate();
                ws.isAlive = false;
                ws.ping();
            });
        }, 30000);
    }

    private async handleConnection(socket: WebSocket, req: IncomingMessage) {

        const url = new URL(req.url!, "ws://localhost");
        const token = url.searchParams.get("token") as string;
        const organizationId = url.searchParams.get("orgId") as string;
        const workspaceId = url.searchParams.get("workspaceId") as string;

        const verify = authenticate(token) as any;
        if (!verify) {
            console.warn("Connection rejected: Invalid token");
            socket.send("Error: Unauthorized");
            socket.close(1008);
            return;
        }
        const userId = verify.userId;

        (socket as any).isAlive = true;
        socket.on("pong", () => {
            (socket as any).isAlive = true;
        });
        socket.on("message", (data: any) => {
            try {
                const message = JSON.parse(data.toString());
                if (message.type == JOIN_SPACE) {
                    this.spaceManager.addClient(workspaceId, socket, userId, organizationId)

                    const roomCount = this.spaceManager.activeUsers(workspaceId);

                    socket.send(`User ${userId} joined ${workspaceId}. users in space: ${roomCount}`)

                }
            } catch (error: any) {
                console.error("Failed to parse message", error);
                socket.send(JSON.stringify({ type: "ERROR", message: "Internal Server Error" }));

            }
        });

        socket.on("close", () => {
            const spaceToCleanup = (socket as any).currentSpace || workspaceId;
            this.spaceManager.removeClient(spaceToCleanup, socket);
            console.log(`Client left space: ${spaceToCleanup}`);
        });
        socket.send("Connected to space");
    }
}