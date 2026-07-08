import { WebSocketServer } from "ws";
import { registerChatEvents, registerWorklfowEvents } from "./events/chatEvents";
import { handleConnection } from "./handlers/socketHandler";

const PORT = 8080;

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
// ─────────────────────────────────────────────────────────────────

const wss = new WebSocketServer({ port: PORT });

console.log(`[Flux] WebSocket server listening on port ${PORT}`);

registerChatEvents();
registerWorklfowEvents();
wss.on("connection", handleConnection);