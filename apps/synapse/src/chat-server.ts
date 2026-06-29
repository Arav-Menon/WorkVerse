import { WebSocketServer, WebSocket } from "ws";
import { RedisManager } from "./services/redis-manager";
import { RoomManager } from "./services/room-manager";
import { verifyToken, type AuthUser } from "./services/auth.service";
import { db } from "@repo/db/db";

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

  private async handleConnection(socket: any, req: any) {
    const url = new URL(req.url!, "http://localhost");
    const roomId = url.searchParams.get("roomId");
    const token = url.searchParams.get("token");

    if (!roomId) {
      console.warn("Connection attempt without roomId rejected");
      socket.close(1008, "Room ID required");
      return;
    }

    // Authenticate DM rooms
    if (roomId.startsWith("dm:")) {
      if (!token) {
        console.warn("DM connection attempt without token rejected");
        socket.close(1008, "Authentication required for DM rooms");
        return;
      }

      const user = verifyToken(token);
      if (!user) {
        console.warn("DM connection attempt with invalid token rejected");
        socket.close(1008, "Invalid token");
        return;
      }

      const conversationId = roomId.slice(3); // Remove "dm:" prefix

      // Verify user is a participant in this conversation
      const conversation = await db.directMessageConversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        console.warn(`DM conversation ${conversationId} not found`);
        socket.close(1008, "Conversation not found");
        return;
      }

      if (conversation.user1Id !== user.userId && conversation.user2Id !== user.userId) {
        console.warn(`User ${user.userId} is not a participant in conversation ${conversationId}`);
        socket.close(1008, "Not a participant in this conversation");
        return;
      }

      // Attach user info to socket
      socket.userId = user.userId;
      socket.userEmail = user.email;
      socket.roomId = roomId;
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
        if (!message || message.length === 0) return;
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
