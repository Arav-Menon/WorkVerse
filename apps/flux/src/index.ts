import { WebSocketServer } from "ws";
import { registerChatEvents } from "./events/chatEvents";
import { handleConnection } from "./handlers/socketHandler";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`[Flux] WebSocket server listening on port ${PORT}`);

registerChatEvents();

wss.on("connection", handleConnection);

