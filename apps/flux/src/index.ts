import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket: WebSocket) => {
  socket.on("message", async (mssg) => {
    try {
      const { token, ...data } = JSON.parse(mssg.toString());

      const response = await fetch("http://localhost:3000/api/v1/ingest-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      socket.send(JSON.stringify(result));
    } catch (err) {
      console.error("Error processing message:", err);
      socket.send(JSON.stringify({ error: "Failed to process message" }));
    }
  });
});
