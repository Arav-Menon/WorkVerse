import { Worker } from "bullmq";
import { connection } from "@repo/queue";
import { chat } from "@repo/evaluator";
import type { ChatCompletedEvent } from "@repo/events";
import { EventBus } from "@repo/events";
import { client } from "@repo/redis";
import { insertBulk, insertBulkUserMessage } from "../utils/bulkInsert";

export const worker = new Worker(
  "chat_response-queue",
  async (job) => {
    console.log("worker is started.....");
    const {
      workspaceId,
      spaceId,
      userPrompt,
      organizationId,
      promptId,
      userId,
    } = job.data;

    try {
      await insertBulkUserMessage({
        promptId,
        userId,
        organizationId,
        workspaceId,
        content: userPrompt,
      });

      const response = await chat(userPrompt);

      const chatCompletePayload: ChatCompletedEvent = {
        promptId,
        userId,
        spaceId,
        organizationId,
        workspaceId,
        content: response,
        status: "completed",
      };

      await client.set(
        `chat${promptId}:access`,
        JSON.stringify(chatCompletePayload),
        "EX",
        86400,
      );

      await insertBulk(chatCompletePayload);

      await EventBus.publish("chat_completed", chatCompletePayload);

      return {
        success: true,
        statusCode: 200,
        info: {
          promptId,
          userId,
          organizationId,
          workspaceId,
          content: response,
        },
      };
    } catch (error: any) {
      const failPayload: ChatCompletedEvent = {
        promptId,
        userId,
        spaceId,
        organizationId,
        workspaceId,
        content: null,
        status: "failed",
      };

      await EventBus.publish("chat_completed", failPayload);

      return {
        success: false,
        statusCode: error.statusCode ?? 500,
        error,
      };
    }
  },
  { connection, concurrency: 100 },
);
