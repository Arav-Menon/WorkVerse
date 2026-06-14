import { WebSocket } from "ws";
import axios from "axios";
import { API_URL } from "../API/api_url";
import { socketStore } from "../store/socketStore";

export const handleConnection = (socket: WebSocket) => {
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

    socketStore.add(promptId, socket);

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
      socketStore.remove(promptId);
      socket.send(JSON.stringify({ error: "Failed to enqueue prompt", promptId }));
    }
  });

  socket.on("close", () => {
    console.log("[Flux] Client disconnected");
    socketStore.removeBySocket(socket);
  });

  socket.on("error", (err) => console.error("[Flux] Socket error:", err));
};
