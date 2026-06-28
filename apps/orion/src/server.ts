import Fastify from "fastify";
import producerPlugin from "./plugins/producer";
import cachePlugin from "./plugins/cache";
import dbPlugin from "./plugins/db";
import { ingestRoutes } from "./routes/ingest.routes";
import { setupToolRoutes, toolRegistry } from "./services/tool-manager";
// import { setupMcpSseRoutes, registerToolToBridge } from "./services/mcp-bridge";
import { rateLimitPlugin } from "@repo/rate-limit";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  },
});

fastify.register(cachePlugin);
fastify.register(dbPlugin);
fastify.register(producerPlugin);
fastify.register(rateLimitPlugin);

fastify.register(ingestRoutes, { prefix: "/api/v1/orion" });

fastify.register(async (fastify) => {
  await setupToolRoutes(fastify);
  // await setupMcpSseRoutes(fastify);
});

fastify.post("/api/v1/orion/admin/register-tool", {
  config: {
    rateLimit: {
      max: 5,
      timeWindow: 60000,
      keyGenerator: (request) => `ratelimit:orion:admin:register:${request.ip}`,
    },
  },
  async (request, reply) => {
    const tool = request.body as any;
    const toolId = tool.id || `${tool.category}-${tool.name}`;
    const toolMetadata = {
      id: toolId,
      name: tool.name,
      category: tool.category,
      description: tool.description,
      workerId: tool.workerId,
      inputSchema: tool.inputSchema || {},
    };

    toolRegistry.registerTool(toolMetadata);

    return { ok: true, toolId };
  },
});

fastify.listen(
  { port: Number(process.env.PORT ?? 3002), host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`Server listening on ${address}`);
  },
);
