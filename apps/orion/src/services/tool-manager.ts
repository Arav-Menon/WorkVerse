import type { FastifyInstance } from "fastify";
import { queueToolExecution, getToolResult } from "@repo/mcp";
import os from "os";

export interface ToolMetadata {
  id: string;
  name: string;
  category: string;
  description: string;
  workerId: string;
  inputSchema: Record<string, any>;
}

export class ToolRegistry {
  private tools: Map<string, ToolMetadata> = new Map();
  private toolsByCategory: Map<string, ToolMetadata[]> = new Map();
  private toolsByWorker: Map<string, ToolMetadata[]> = new Map();

  registerTool(tool: ToolMetadata) {
    this.tools.set(tool.id, tool);

    // Index by category
    if (!this.toolsByCategory.has(tool.category)) {
      this.toolsByCategory.set(tool.category, []);
    }
    this.toolsByCategory.get(tool.category)?.push(tool);

    // Index by worker
    if (!this.toolsByWorker.has(tool.workerId)) {
      this.toolsByWorker.set(tool.workerId, []);
    }
    this.toolsByWorker.get(tool.workerId)?.push(tool);
  }

  getToolsByCategory(category: string): ToolMetadata[] {
    return this.toolsByCategory.get(category) || [];
  }

  getToolsByWorker(workerId: string): ToolMetadata[] {
    return this.toolsByWorker.get(workerId) || [];
  }

  getAllTools(): ToolMetadata[] {
    return Array.from(this.tools.values());
  }

  getTool(id: string): ToolMetadata | undefined {
    return this.tools.get(id);
  }
}

export const toolRegistry = new ToolRegistry();

/**
 * Routes to expose available tools to Cortex
 * Cortex uses this to understand what tools are available
 */
export async function setupToolRoutes(fastify: FastifyInstance) {
  fastify.get("/api/v1/orion/tools", {
    config: {
      rateLimit: {
        max: 100,
        timeWindow: 60000,
        keyGenerator: (request) => `ratelimit:orion:tools:${request.ip}`,
      },
    },
    async (request, reply) => {
      return toolRegistry.getAllTools();
    },
  });

  fastify.get("/api/v1/orion/tools/category/:category", {
    config: {
      rateLimit: {
        max: 100,
        timeWindow: 60000,
        keyGenerator: (request) => `ratelimit:orion:tools:category:${request.ip}`,
      },
    },
    async (request, reply) => {
      const { category } = request.params as { category: string };
      return toolRegistry.getToolsByCategory(category);
    },
  });

  fastify.get("/api/v1/orion/tools/:toolId", {
    config: {
      rateLimit: {
        max: 100,
        timeWindow: 60000,
        keyGenerator: (request) => `ratelimit:orion:tools:detail:${request.ip}`,
      },
    },
    async (request, reply) => {
      const { toolId } = request.params as { toolId: string };
      const tool = toolRegistry.getTool(toolId);
      if (!tool) {
        return reply.status(404).send({ error: "Tool not found" });
      }
      return tool;
    },
  });

  fastify.post("/api/v1/orion/tools/:toolId/execute", {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: 60000,
        keyGenerator: (request) => `ratelimit:orion:tools:execute:${request.ip}`,
      },
    },
    async (request, reply) => {
      const { toolId } = request.params as { toolId: string };
      const { input } = request.body as { input: Record<string, any> };

      const tool = toolRegistry.getTool(toolId);
      if (!tool) {
        return reply.status(404).send({ error: "Tool not found" });
      }

      const correlationId = `corr:${Date.now()}:${os.hostname()}`;
      const jobId = await queueToolExecution(tool.id, tool.category, input, correlationId);

      return { status: "queued", jobId, correlationId, toolId, workerId: tool.workerId };
    },
  });

  fastify.get("/api/v1/orion/results/:correlationId", {
    config: {
      rateLimit: {
        max: 30,
        timeWindow: 60000,
        keyGenerator: (request) => `ratelimit:orion:results:${request.ip}`,
      },
    },
    async (request, reply) => {
      const { correlationId } = request.params as { correlationId: string };
      const result = await getToolResult(correlationId);

      if (!result) {
        return reply.status(202).send({ status: "pending" });
      }

      return result;
    },
  });
}
