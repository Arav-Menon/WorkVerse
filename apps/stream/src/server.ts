import Fastify from "fastify"
import transportRoute from "./routes/transport.route.ts";

export const fastify = Fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: { colorize: true },
        },
    },
});

fastify.register(transportRoute, {
  prefix : "/api/v1/"
})

