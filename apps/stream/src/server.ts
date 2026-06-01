import Fastify from "fastify"

export const fastify = Fastify({
    logger: {
        transport: {
            target: "pino-pretty",
            options: { colorize: true },
        },
    },
});


