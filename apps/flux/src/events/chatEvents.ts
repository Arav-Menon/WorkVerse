import { WebSocket } from "ws";
import { EventBus } from "@repo/events";
import { socketStore } from "../store/socketStore";


export function registerChatEvents() {
  EventBus.subscribe("chat_completed", (payload: any) => {
    const socket = socketStore.get(payload.promptId);

    if (!socket) return;

    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "chat_completed",
        status: "completed",
        userId: payload.userId,
        organizationId: payload.organizationId,
        workspaceId: payload.workSpaceId,
        promptId: payload.promptId,
        content: payload.content,
      }));
      console.log(`[Flux] Response delivered — promptId: ${payload.promptId}`);
    }

    socketStore.remove(payload.promptId);
  });
}

export function registerWorklfowEvents() {
  EventBus.subscribe("workflow_event", (payload: any) => {
    const socket = socketStore.get(payload.promptId);

    if (!socket) return;

    if (socket.readyState == WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: "workflow_status",
        status: payload.status,
        message: payload.message,
        userId: payload.userId,
        organizationId: payload.organizationId,
        workspaceId: payload.workSpaceId,
        promptId: payload.promptId,
        content: payload.content,
      }))
    }

    if (payload.status === "completed" || payload.status === "failed") {
      socketStore.remove(payload.promptId);
    }
  })
}