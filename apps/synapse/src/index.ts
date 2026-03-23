import { client as pubClient } from "@repo/redis/redis-client";
import { ChatServer } from "./chat-server";

const PORT = Number(process.env.PORT || 8080);
const server = new ChatServer(PORT, pubClient);
server.start();
