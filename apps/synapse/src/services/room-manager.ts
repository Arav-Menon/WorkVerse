import { WebSocket } from "ws";

export class RoomManager {
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
