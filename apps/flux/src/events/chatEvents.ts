import { WebSocket } from "ws";
import { EventBus } from "@repo/events";
import { socketStore } from "../store/socketStore";

export function registerChatEvents() {
  EventBus.subscribe("chat_completed", (payload: any) => {
    const socket = socketStore.get(payload.promptId);

    if (!socket) return;

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        status: "completed",
        userId: payload.userId,
        organizationId: payload.organizationId,
        workspaceID: payload.workSpaceId,
        promptId: payload.promptId,
        content: payload.content,
      }));
      console.log(`[Flux] Response delivered — promptId: ${payload.promptId}`);
    }

    socketStore.remove(payload.promptId);
  });
}
