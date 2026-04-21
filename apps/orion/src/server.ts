import Fastify from "fastify";
import producerPlugin from "./plugins/producer";
import cachePlugin from "./plugins/cache";
import { ingestRoutes } from "./routes/ingest.routes";
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
