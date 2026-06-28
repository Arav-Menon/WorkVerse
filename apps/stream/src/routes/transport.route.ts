import type { FastifyInstance } from "fastify";
import {
    transportController,
    getRouterCapabilities,
    connectTransport,
    produce,
    consume,
    resumeConsumer,
    getProducers,
    removePeer,
    pauseProducer,
    resumeProducer
} from "../controllers/transport.controller.ts";

export default async function transportRoute(fastify: FastifyInstance) {
    fastify.get("/router-capabilities/:roomId", {
        config: {
            rateLimit: {
                max: 100,
                timeWindow: 60000,
                keyGenerator: (request) => `ratelimit:stream:capabilities:${request.ip}`,
            },
        },
        handler: getRouterCapabilities,
    });

    fastify.post("/create-transport", {
        config: {
            rateLimit: {
                max: 60,
                timeWindow: 60000,
                keyGenerator: (request) => `ratelimit:stream:create-transport:${request.ip}`,
            },
        },
        handler: transportController,
    });

    fastify.post("/connect-transport", {
        config: {
            rateLimit: {
                max: 60,
                timeWindow: 60000,
                keyGenerator: (request) => `ratelimit:stream:connect-transport:${request.ip}`,
            },
        },
        handler: connectTransport,
    });

    fastify.post("/produce", {
        config: {
            rateLimit: {
                max: 60,
                timeWindow: 60000,
                keyGenerator: (request) => `ratelimit:stream:produce:${request.ip}`,
            },
        },
        handler: produce,
    });

    fastify.post("/consume", {
        config: {
            rateLimit: {
                max: 60,
                timeWindow: 60000,
                keyGenerator: (request) => `ratelimit:stream:consume:${request.ip}`,
            },
        },
        handler: consume,
    });

    fastify.post("/resume-consumer", {
        config: {
            rateLimit: {
                max: 60,
                timeWindow: 60000,
                keyGenerator: (request) => `ratelimit:stream:resume-consumer:${request.ip}`,
            },
        },
        handler: resumeConsumer,
    });

    fastify.get("/producers/:roomId/:userId", {
        config: {
            rateLimit: {
                max: 100,
                timeWindow: 60000,
                keyGenerator: (request) => `ratelimit:stream:producers:${request.ip}`,
            },
        },
        handler: getProducers,
    });

    fastify.post("/pause-producer", {
        config: {
            rateLimit: {
                max: 60,
                timeWindow: 60000,
                keyGenerator: (request) => `ratelimit:stream:pause-producer:${request.ip}`,
            },
        },
        handler: pauseProducer,
    });

    fastify.post("/resume-producer", {
        config: {
            rateLimit: {
                max: 60,
                timeWindow: 60000,
                keyGenerator: (request) => `ratelimit:stream:resume-producer:${request.ip}`,
            },
        },
        handler: resumeProducer,
    });

    fastify.post("/remove-peer", {
        config: {
            rateLimit: {
                max: 30,
                timeWindow: 60000,
                keyGenerator: (request) => `ratelimit:stream:remove-peer:${request.ip}`,
            },
        },
        handler: removePeer,
    });
}
