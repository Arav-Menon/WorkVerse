/**
 * Worker Factory - Creates typed workers for different tool categories
 * Each worker manages a subset of MCP tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createCategoryServer, createToolRegistry } from "@repo/mcp/distributed";
import type { ToolDefinition, DistributedToolRegistry } from "@repo/mcp/distributed";


export interface WorkerContext {
  category: string;
  workerId: string;
  mcpServer: McpServer;
  toolRegistry: DistributedToolRegistry;
  jobQueue: AsyncIterableIterator<any>;
}

/**
 * Create a typed worker for a tool category
 * Pass all tools for that category here
 */
export async function createCategoryWorker(
  category: string,
  tools: Record<string, ToolDefinition>,
  jobQueue: AsyncIterableIterator<any>
): Promise<WorkerContext> {
  const workerId = `${category}-worker-${Date.now()}`;

  // Initialize MCP server (runs in this worker process)
  const mcpServer = createCategoryServer({
    category,
    workerId
  });

  // Create tool registry for this category
  const toolRegistry = createToolRegistry(category, workerId);

  // Register all tools for this category
  for (const [toolName, toolDef] of Object.entries(tools)) {
    // Register with MCP server
    mcpServer.tool(
      toolDef.name,
      toolDef.description,
      toolDef.inputSchema as any,
      toolDef.execute as any
    );

    // Track in registry
    toolRegistry.tools.set(toolName, toolDef);
  }

  return {
    category,
    workerId,
    mcpServer,
    toolRegistry,
    jobQueue,
  };
}

/**
 * Start a worker and begin processing jobs from queue
 */
export async function startWorker(context: WorkerContext) {
  console.log(`Starting ${context.category} worker: ${context.workerId}`);

  // Start MCP server
  // NOTE: Transport is handled by the parent process or orchestrator

  // Begin consuming jobs
  while (true) {
    try {
      // Pull job from queue
      // const job = await pullJobFromQueue(context.category);

      // Process job...
      // This is where LLM decisions come in from Cortex

      // TODO: Implement job processing loop

      // Send result back through Orion/Redis

    } catch (error) {
      console.error(`Worker ${context.workerId} error:`, error);
      // Implement backoff/retry logic
    }
  }
}
