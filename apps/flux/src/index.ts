import { WebSocket, WebSocketServer } from "ws";
import axios from "axios";
import { API_URL } from "./API/api_url";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket: WebSocket) => {
  socket.on("message", async (message) => {
    try {
      const parsed = JSON.parse(message.toString());

      const { token, workspaceId, userPrompt, organizationId } = parsed;

      if (!token || !workspaceId || !userPrompt) {
        socket.send(JSON.stringify({ error: "Missing required fields" }));
        return;
      }

      const response = await axios.post(
        API_URL,
        {
          workspaceId,
          userPrompt,
          organizationId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("Prompt recived")

      socket.send(JSON.stringify(response.data));
    } catch (err) {
      console.error("Error processing message:", err);
      socket.send(JSON.stringify({ error: "Failed to process message" }));
    }
  });
});
