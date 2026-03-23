import { WebSocketServer, WebSocket } from "ws";
import { RedisManager } from "./services/redis-manager";
import { RoomManager } from "./services/room-manager";

export class ChatServer {
  private wss: WebSocketServer;
  private redisManager: RedisManager;
  private roomManager: RoomManager;

  constructor(port: number, pubClient: any) {
    this.wss = new WebSocketServer({ port });
    this.redisManager = new RedisManager(pubClient);
    this.roomManager = new RoomManager();
  }

  async start() {
    try {
      await this.redisManager.init();

      this.wss.on("connection", (socket: WebSocket, req) => {
        this.handleConnection(socket, req);
      });

      this.setupHeartbeat();
      const port = this.wss.options.port;
      console.log(`Chat Server is running on port ${port}`);
    } catch (error) {
      console.error("Failed to start Chat Server:", error);
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

  private handleConnection(socket: any, req: any) {
    const url = new URL(req.url!, "http://localhost");
    const roomId = url.searchParams.get("roomId");

    if (!roomId) {
      console.warn("Connection attempt without roomId rejected");
      socket.close(1008, "Room ID required");
      return;
    }

    socket.isAlive = true;
    socket.on("pong", () => {
      socket.isAlive = true;
    });

    this.roomManager.addClient(roomId, socket);
    console.log(`Client joined room: ${roomId}`);

    this.redisManager.subscribe(roomId, (message) => {
      this.roomManager.broadcastLocal(roomId, message);
    });

    socket.on("message", (data: any) => {
      try {
        const message = data.toString();
        this.redisManager.publish(roomId, message);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    });

    socket.on("close", () => {
      this.roomManager.removeClient(roomId, socket);
      console.log(`Client disconnected from room: ${roomId}`);
    });

    socket.on("error", (err: any) => {
      console.error(`Socket error from room ${roomId}:`, err);
    });
  }
}
