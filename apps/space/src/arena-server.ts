import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import { spaceManager } from "./services/space-manager";
import { authenticate } from "./middleware/verify";
import { CHAT, JOIN_SPACE, MOVE, PING, PONG, SPACE_JOIN, SPACE_LEAVE, PLAYER_MOVE } from "../config/config";
import { RedisManager } from "./services/redis-manager";

export class workspaceServer {
  private wss: WebSocketServer;
  private spaceManager: spaceManager;
  private redisManager: RedisManager;

  private subscribedChannels: Set<string> = new Set();

  constructor(port: number, pubClient: any) {
    this.wss = new WebSocketServer({ port });
    this.redisManager = new RedisManager(pubClient);
    this.spaceManager = new spaceManager(this.redisManager);
  }

  async start() {
    try {
      await this.redisManager.init();

      this.wss.on("connection", (socket, req) => {
        this.handleConnection(socket, req);
      });
      this.setupHeartbeat();
      const port = this.wss.options.port;
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
    const token = url.searchParams.get("token") || "";
    const organizationId = url.searchParams.get("orgId") as string;
    const workspaceId = url.searchParams.get("workspaceId") as string;

    const verify = authenticate(token as string) as any;
    if (!verify) {
      console.warn("[Arena] Connection rejected: Invalid token");
      socket.send(JSON.stringify({ type: "ERROR", message: "Unauthorized" }));
      socket.close(1008);
      return;
    }

    const userId = verify.userId;
    (socket as any).userId = userId;
    (socket as any).workspaceId = workspaceId;

    (socket as any).isAlive = true;
    socket.on("pong", () => {
      (socket as any).isAlive = true;
    });

    socket.on("message", async (data: any) => {
      try {
        const message = JSON.parse(data.toString());

        // Handle both new and legacy event type names
        const msgType = message.type;
        const isJoin = msgType === SPACE_JOIN || msgType === JOIN_SPACE;
        const isMove = msgType === PLAYER_MOVE || msgType === MOVE;
        const isPing = msgType === PING;
        const isLeave = msgType === SPACE_LEAVE;

        if (isJoin) {
          if (!this.subscribedChannels.has(workspaceId)) {
            this.redisManager.subscribe(`space:${workspaceId}`, (redisMsg) => {
              this.spaceManager.broadcastLocal(workspaceId, redisMsg);
            });
            this.subscribedChannels.add(workspaceId);
          }

          await this.spaceManager.addClient(
            workspaceId,
            socket,
            userId,
            organizationId,
          );
        }

        if (isMove) {
          const { x, y } = message.payload || {};
          if (typeof x === "number" && typeof y === "number") {
            this.spaceManager.moveClient(workspaceId, userId, { x, y });
          }
        }

        if (isLeave) {
          await this.spaceManager.removeClient(workspaceId, socket);
          socket.send(JSON.stringify({ type: "INFO", message: "Left space" }));
          socket.close(1000);
          return;
        }

        if (isPing) {
          socket.send(JSON.stringify({ type: PONG }));
        }

        if (msgType === CHAT) {
          const { chatMessage } = message.payload || {}
          if (typeof chatMessage == "string") {
            this.spaceManager.chatMessage(workspaceId, userId, chatMessage)
          }
        }

      } catch (error: any) {
        console.error("[Arena] Failed to parse message", error);
        socket.send(
          JSON.stringify({ type: "ERROR", message: "Internal Server Error" }),
        );
      }
    });

    socket.on("close", async () => {
      const spaceToCleanup = (socket as any).workspaceId || workspaceId;
      await this.spaceManager.removeClient(spaceToCleanup, socket);
    });

    // Send initial connection acknowledgement
    socket.send(JSON.stringify({ type: "INFO", message: "Connected to space" }));
  }
}
