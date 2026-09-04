import http from "http";
import { WebSocketServer } from "ws";
import { registerChatEvents, registerWorklfowEvents } from "./events/chatEvents";
import { handleConnection } from "./handlers/socketHandler";

const PORT = Number(process.env.PORT ?? 8080);

if (!process.env.REDIS_URL && !process.env.REDIS_HOST) {
  console.error(
    "[Flux] FATAL: Neither REDIS_URL nor REDIS_HOST is set.\n" +
    "  ioredis will default to 'localhost:6379' which WILL FAIL in Kubernetes.\n" +
    "  Set REDIS_HOST to your Redis service name (e.g. 'redis.default.svc.cluster.local').\n" +
    "  Exiting to prevent silent failure."
  );
  process.exit(1);
}

console.log(`[Flux] Redis target: ${process.env.REDIS_URL || `${process.env.REDIS_HOST || "localhost"}:${process.env.REDIS_PORT || "6379"}`}`);
console.log(`[Flux] CORTEX_API_URL: ${process.env.CORTEX_API_URL || "http://localhost:3000/api/v1/ingest-prompt (DEFAULT)"}`);

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200);
    res.end("OK");
    return;
  }
  res.writeHead(404);
  res.end();
});

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(PORT, async () => {
  console.log(`[Flux] HTTP + WebSocket server listening on port ${PORT}`);

  try {
    await registerChatEvents();
    await registerWorklfowEvents();
    console.log("[Flux] EventBus subscriptions active");
  } catch (err) {
    console.error("[Flux] FATAL: Failed to subscribe to EventBus:", err);
    process.exit(1);
  }

  wss.on("connection", handleConnection);
});