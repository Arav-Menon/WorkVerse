import Fastify from "fastify";
import producerPlugin from "./plugins/producer";
import cachePlugin from "./plugins/cache";
import { ingestRoutes } from "./routes/ingest.routes";
import { setupToolRoutes, toolRegistry } from "./services/tool-manager";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  },
});

fastify.register(cachePlugin);
fastify.register(producerPlugin);

fastify.register(ingestRoutes, { prefix: "/api/v1/orion" });

fastify.register(async (fastify) => {
  await setupToolRoutes(fastify);
});

fastify.post("/api/v1/orion/admin/register-tool", async (request, reply) => {
  const tool = request.body as any;
  toolRegistry.registerTool({
    id: tool.id || `${tool.category}-${tool.name}`,
    name: tool.name,
    category: tool.category,
    description: tool.description,
    workerId: tool.workerId,
    inputSchema: tool.inputSchema || {},
  });
  return { ok: true, toolId: tool.id };
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
