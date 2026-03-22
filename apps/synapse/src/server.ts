import { WebSocketServer, WebSocket } from "ws";
import { client as pubClient } from "@repo/redis/redis-client";
class RedisManager {
  private subClient: any;
  private pubClient: any;
  private subscriptions: Set<string> = new Set();

  constructor(pubClient: any) {
    this.pubClient = pubClient;
    this.subClient = pubClient.duplicate();
  }

  async init() {
    await this.subClient.on("error", (err: any) =>
      console.error("Redis Sub Client Error", err),
    );
    await this.subClient.connect();
    console.log("Redis Sub Client connected");
  }

  async subscribe(channel: string, callback: (message: string) => void) {
    if (this.subscriptions.has(channel)) return;

    this.subscriptions.add(channel);
    await this.subClient.subscribe(channel, (message: string) => {
      callback(message);
    });
  }

  async publish(channel: string, message: string) {
    await this.pubClient.publish(channel, message);
  }
}

/**
 * Manages local room state and broadcasting to local clients.
 */
class RoomManager {
  private rooms: Map<string, Set<WebSocket>> = new Map();

  addClient(roomId: string, socket: WebSocket) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId)!.add(socket);
  }

  removeClient(roomId: string, socket: WebSocket) {
    const clients = this.rooms.get(roomId);
    if (clients) {
      clients.delete(socket);
      if (clients.size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  broadcastLocal(roomId: string, message: string) {
    const clients = this.rooms.get(roomId);
    if (!clients) return;

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

/**
 * Core WebSocket Server handling connection lifecycle and message routing.
 */
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

    // Ensure we are subscribed to the Redis channel for this room
    this.redisManager.subscribe(roomId, (message) => {
      this.roomManager.broadcastLocal(roomId, message);
    });

    socket.on("message", (data: any) => {
      try {
        const message = data.toString();
        // Distribute to all instances via Redis Pub/Sub
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

const PORT = Number(process.env.PORT || 8080);
const server = new ChatServer(PORT, pubClient);
server.start();
