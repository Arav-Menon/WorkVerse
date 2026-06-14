import { WebSocket } from "ws";

class SocketStore {
  private pendingSockets = new Map<string, WebSocket>();

  add(promptId: string, socket: WebSocket) {
    this.pendingSockets.set(promptId, socket);
  }

  get(promptId: string): WebSocket | undefined {
    return this.pendingSockets.get(promptId);
  }

  remove(promptId: string) {
    this.pendingSockets.delete(promptId);
  }

  removeBySocket(socket: WebSocket) {
    for (const [id, sock] of this.pendingSockets.entries()) {
      if (sock === socket) {
        this.pendingSockets.delete(id);
      }
    }
  }
}

export const socketStore = new SocketStore();
