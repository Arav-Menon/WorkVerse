import { WebSocket } from "ws";
import axios from "axios";
import { API_URL } from "../API/api_url";
import { socketStore } from "../store/socketStore";

export const handleConnection = (socket: WebSocket) => {

  socket.on("message", async (raw) => {
    let parsed: {
      type?: string;
      token: string;
      workspaceId: string;
      userPrompt: string;
      spaceId: string;
      organizationId: string;
    };

    try {
      parsed = JSON.parse(raw.toString());
    } catch {
      socket.send(JSON.stringify({ type: "error", error: "Invalid JSON payload" }));
      return;
    }

    if (parsed.type === "ping") {
      socket.send(JSON.stringify({ type: "pong" }));
      return;
    }

    const { token, workspaceId, userPrompt, organizationId, spaceId } = parsed;

    if (!token || !workspaceId || !userPrompt || !organizationId || !spaceId) {
      socket.send(JSON.stringify({ type: "error", error: "Missing required fields" }));
      return;
    }

    const promptId = crypto.randomUUID();

    socketStore.add(promptId, socket);

    try {
      await axios.post(
        API_URL,
        { workspaceId, userPrompt, promptId, organizationId, spaceId },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      socket.send(JSON.stringify({
        type: "prompt_queued",
        promptId,
        message: "Your prompt has been queued for processing.",
      }));

      console.log(`[Flux] Prompt queued — promptId: ${promptId}`);
    } catch (err: any) {
      console.error("[Flux] Failed to enqueue prompt:", err);
      socketStore.remove(promptId);
      socket.send(JSON.stringify({ type: "error", error: "Failed to enqueue prompt", promptId }));
    }
  });

  socket.on("close", () => {
    console.log("[Flux] Client disconnected");
    socketStore.removeBySocket(socket);
  });

  socket.on("error", (err) => console.error("[Flux] Socket error:", err));
};
