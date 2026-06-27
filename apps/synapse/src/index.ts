import { publisherRedis as pubClient } from "@repo/redis/redis-client";
import { ChatServer } from "./chat-server";
import { EventBus } from "@repo/events";

const PORT = Number(process.env.PORT || 8080);
const server = new ChatServer(PORT, pubClient);

server.start().then(() => {
  // Bridge EventBus DM events to Synapse room channels
  // This enables real-time DM delivery: Cortex publishes to EventBus,
  // Synapse subscribes and republishes to the room channel for WebSocket delivery.

  EventBus.subscribe("dm_completed", (event) => {
    const channel = `dm:${event.conversationId}`;
    const message = JSON.stringify({
      type: "dm_message",
      messageId: event.messageId,
      conversationId: event.conversationId,
      senderId: event.senderId,
      senderName: event.senderName,
      content: event.content,
      createdAt: event.createdAt,
    });
    console.log(`[Synapse] DM bridge: publishing to ${channel}`);
    pubClient.publish(channel, message);
  });

  EventBus.subscribe("dm_typing", (event) => {
    const channel = `dm:${event.conversationId}`;
    const message = JSON.stringify({
      type: "dm_typing",
      conversationId: event.conversationId,
      userId: event.userId,
      isTyping: event.isTyping,
    });
    pubClient.publish(channel, message);
  });

  console.log("[Synapse] EventBus DM bridge active");
});
