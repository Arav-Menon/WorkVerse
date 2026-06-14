import { WebSocket, WebSocketServer } from "ws";
import axios from "axios";
import { EventBus } from "@repo/events"
import { API_URL } from "./API/api_url";

const wss = new WebSocketServer({ port: 8080 });
console.log("[Flux] WebSocket server listening on port 8080");

const pendingSockets = new Map<string, WebSocket>();

EventBus.subscribe("chat_completed", (payload: any) => {
  const socket = pendingSockets.get(payload.promptId);

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

  pendingSockets.delete(payload.promptId);
});


wss.on("connection", (socket: WebSocket) => {
  console.log("[Flux] Client connected");

  socket.on("message", async (raw) => {

    let parsed: {
      token: string;
      workspaceId: string;
      userPrompt: string;
      organizationId: string;
    };

    try {
      parsed = JSON.parse(raw.toString());
    } catch {
      socket.send(JSON.stringify({ error: "Invalid JSON payload" }));
      return;
    }

    const { token, workspaceId, userPrompt, organizationId } = parsed;

    if (!token || !workspaceId || !userPrompt || !organizationId) {
      socket.send(JSON.stringify({ error: "Missing required fields" }));
      return;
    }

    const promptId = crypto.randomUUID();

    pendingSockets.set(promptId, socket);

    try {
      await axios.post(
        API_URL,
        { workspaceId, userPrompt, promptId, organizationId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      socket.send(JSON.stringify({
        status: "queued",
        promptId,
        message: "Your prompt has been queued for processing.",
      }));

      console.log(`[Flux] Prompt queued — promptId: ${promptId}`);
    } catch (err: any) {
      console.error("[Flux] Failed to enqueue prompt:", err);
      pendingSockets.delete(promptId);
      socket.send(JSON.stringify({ error: "Failed to enqueue prompt", promptId }));
    }
  });

  socket.on("close", () => {
    console.log("[Flux] Client disconnected");
    for (const [id, sock] of pendingSockets) {
      if (sock === socket) pendingSockets.delete(id);
    }
  });

  socket.on("error", (err) => console.error("[Flux] Socket error:", err));
});
