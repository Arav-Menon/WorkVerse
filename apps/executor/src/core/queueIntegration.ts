import { client as redis } from "@repo/redis";
import { WorkerContext } from "../core/workerFactory";
import { ToolJob, ToolResult, pushToolResult } from "@repo/mcp";
import os from "os";

/**
 * Worker with Redis Stream integration
 */
export async function startWorkerWithQueue(context: WorkerContext) {
  const streamName = `mcp:${context.category}:stream`;
  const groupName = `mcp:${context.category}:group`;
  const consumerName = `${context.workerId}:${os.hostname()}`;

  console.log(`Starting ${context.category} worker: ${context.workerId} on stream ${streamName}`);

  // 1. Ensure Consumer Group exists
  try {
    await redis.xGroupCreate(streamName, groupName, "0", { MKSTREAM: true });
  } catch (err: any) {
    if (!err.message.includes("BUSYGROUP")) {
      console.error("Error creating consumer group:", err);
    }
  }

  while (true) {
    try {
      // 2. Read from Stream using Consumer Group
      const response = await redis.xReadGroup(
        groupName,
        consumerName,
        { key: streamName, id: ">" },
        { COUNT: 1, BLOCK: 5000 }
      );

      if (!response || response.length === 0) continue;

      // response structure: [{ key: 'streamName', messages: [{ id: '...', message: { payload: '...' } }] }]
      const streamMessage = response[0].messages[0];
      const messageId = streamMessage.id;
      const toolJob: ToolJob = JSON.parse(streamMessage.message.payload);

      console.log(`[${context.workerId}] Processing job:`, {
        jobId: toolJob.id,
        messageId,
        toolName: toolJob.toolName,
      });

      const tool = context.toolRegistry.tools.get(toolJob.toolName);
      if (!tool) {
        await pushToolResult({
          jobId: toolJob.id,
          toolName: toolJob.toolName,
          correlationId: toolJob.correlationId,
          result: null,
          error: `Tool ${toolJob.toolName} not found`,
          executedAt: Date.now(),
        });
        // Acknowledge the message so it's not redelivered
        await redis.xAck(streamName, groupName, messageId);
        continue;
      }

      let result;
      try {
        result = await tool.execute(toolJob.params);
      } catch (error) {
        result = { error: String(error) };
      }

      await pushToolResult({
        jobId: toolJob.id,
        toolName: toolJob.toolName,
        correlationId: toolJob.correlationId,
        result: result,
        executedAt: Date.now(),
      });

      // 3. Acknowledge the message
      await redis.xAck(streamName, groupName, messageId);

      console.log(`[${context.workerId}] Job completed:`, toolJob.id);
    } catch (error) {
      console.error(`Worker ${context.workerId} error:`, error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}
