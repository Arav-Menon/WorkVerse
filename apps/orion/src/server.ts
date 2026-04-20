import Fastify from "fastify";
import producerPlugin from "./plugins/producer"
import cachePlugin from "./plugins/cache"
const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  },
});

fastify.register(cachePlugin)
fastify.register(producerPlugin)

fastify.register()