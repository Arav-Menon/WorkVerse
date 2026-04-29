/**
 * Queue Integration Pattern for Distributed MCP
 * Shows how tools flow through the system
 */

import { createCategoryWorker, startWorker, WorkerContext } from "../core/workerFactory";

/**
 * Job structure in Redis queue
 */
export interface ToolJob {
  id: string;
  toolName: string;
  category: string;
  params: Record<string, any>;
  requestedAt: number;
  correlationId: string; // Link back to original request from Cortex
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
 * Worker with queue integration
 * This replaces the startWorker function with queue awareness
 */
export async function startWorkerWithQueue(context: WorkerContext) {
  console.log(`Starting ${context.category} worker: ${context.workerId}`);

  const redis = getRedisClient(); // Your Redis client

  // Main job processing loop
  while (true) {
    try {
      // Pull job from category queue
      const queueName = `queue:${context.category}`;
      const job = await redis.blpop(queueName, 0); // Blocking pop

      if (!job) continue;

      const toolJob: ToolJob = JSON.parse(job);

      console.log(`[${context.workerId}] Processing job:`, {
        jobId: toolJob.id,
        toolName: toolJob.toolName,
      });

      // Get tool from registry
      const tool = context.toolRegistry.tools.get(toolJob.toolName);
      if (!tool) {
        await pushResult({
          jobId: toolJob.id,
          toolName: toolJob.toolName,
          correlationId: toolJob.correlationId,
          result: null,
          error: `Tool ${toolJob.toolName} not found`,
          executedAt: Date.now(),
        });
        continue;
      }

      // Execute tool
      let result;
      try {
        result = await tool.execute(toolJob.params);
      } catch (error) {
        result = {
          error: String(error),
        };
      }

      // Push result back
      await pushResult({
        jobId: toolJob.id,
        toolName: toolJob.toolName,
        correlationId: toolJob.correlationId,
        result: result,
        executedAt: Date.now(),
      });

      console.log(`[${context.workerId}] Job completed:`, toolJob.id);
    } catch (error) {
      console.error(`Worker ${context.workerId} error:`, error);
      // Implement backoff/retry logic
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

/**
 * Push result back to Redis for Orion to pick up
 */
async function pushResult(result: ToolResult) {
  const redis = getRedisClient();
  const resultKey = `result:${result.correlationId}`;
  await redis.setex(resultKey, 300, JSON.stringify(result)); // 5 min TTL
  await redis.lpush(`results:ready`, resultKey);
}

/**
 * In Orion: Queue a tool execution request
 */
export async function queueToolExecution(
  toolName: string,
  category: string,
  params: Record<string, any>,
  correlationId: string
): Promise<string> {
  const redis = getRedisClient();
  const jobId = `job:${Date.now()}:${Math.random()}`;

  const job: ToolJob = {
    id: jobId,
    toolName,
    category,
    params,
    requestedAt: Date.now(),
    correlationId,
  };

  const queueName = `queue:${category}`;
  await redis.rpush(queueName, JSON.stringify(job));

  console.log(`[Orion] Queued job:`, { jobId, toolName, category });

  return jobId;
}

/**
 * In Orion: Poll for result
 */
export async function getToolResult(correlationId: string): Promise<ToolResult | null> {
  const redis = getRedisClient();
  const resultKey = `result:${correlationId}`;
  const result = await redis.get(resultKey);

  if (result) {
    return JSON.parse(result);
  }
  return null;
}

/**
 * Helper: Get Redis client
 * Replace with your actual Redis connection
 */
function getRedisClient() {
  // TODO: Replace with actual Redis client from @repo/redis
  return {
    blpop: async (key: string, timeout: number) => {
      // Mock implementation
      return null;
    },
    rpush: async (key: string, value: string) => {
      // Mock implementation
    },
    setex: async (key: string, ttl: number, value: string) => {
      // Mock implementation
    },
    get: async (key: string) => {
      // Mock implementation
      return null;
    },
    lpush: async (key: string, value: string) => {
      // Mock implementation
    },
  };
}

/**
 * Example: Complete flow
 *
 * 1. Cortex calls: POST /api/v1/orion/tools/slack-send-message/execute
 *    Payload: { input: { channel: "#general", message: "Hello" } }
 *
 * 2. Orion does:
 *    - Finds tool in registry: category = "comms"
 *    - Calls: queueToolExecution("slack-send-message", "comms", input, correlationId)
 *    - Returns immediately: { status: "queued", jobId, estimatedTime: "2s" }
 *
 * 3. Cortex polls: GET /api/v1/orion/results/:correlationId
 *
 * 4. comms-worker pulls from queue:
 *    - Calls: slack_tool({ channel, message })
 *    - Gets: { type: "text", text: "Message sent" }
 *    - Pushes result back to Redis
 *
 * 5. Orion retrieves result and sends to Cortex
 *
 * 6. Cortex shows result to LLM
 */
