import { client as redis } from "@repo/redis/redis-client";

/**
 * Job structure in Redis stream
 */
export interface ToolJob {
  id: string;
  toolName: string;
  category: string;
  params: Record<string, any>;
  requestedAt: number;
  correlationId: string;
}

/**
 * Result structure pushed back
 */
export interface ToolResult {
  jobId: string;
  toolName: string;
  correlationId: string;
  result: any;
  error?: string;
  executedAt: number;
}

/**
 * In Orion: Queue a tool execution request using Redis Streams
 */
export async function queueToolExecution(
  toolName: string,
  category: string,
  params: Record<string, any>,
  correlationId: string
): Promise<string> {
  const jobId = `job:${Date.now()}:${Math.random()}`;

  const job: ToolJob = {
    id: jobId,
    toolName,
    category,
    params,
    requestedAt: Date.now(),
    correlationId,
  };

  const streamName = `mcp:${category}:stream`;

  const messageId = await redis.xAdd(streamName, "*", {
    payload: JSON.stringify(job)
  });

  console.log(`[Queue] Queued job in stream ${streamName}:`, { messageId, jobId, toolName });

  return messageId;
}

export async function getToolResult(correlationId: string): Promise<ToolResult | null> {
  const resultKey = `result:${correlationId}`;
  const result = await redis.get(resultKey);

  if (result) {
    return JSON.parse(result);
  }
  return null;
}

/**
 * Push result back to Redis
 */
export async function pushToolResult(result: ToolResult) {
  const resultKey = `result:${result.correlationId}`;
  await redis.setEx(resultKey, 300, JSON.stringify(result)); // 5 min TTL
}
