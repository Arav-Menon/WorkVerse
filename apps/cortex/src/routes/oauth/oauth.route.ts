import type { FastifyInstance } from "fastify";
import { oauthController } from "../../controllers/oauth.controller";

export default async function oauthRoutes(fastify: FastifyInstance) {
    fastify.get("/:provider/connect", {
        config: {
            rateLimit: {
                max: 10,
                timeWindow: 60000,
                keyGenerator: (request) => `ratelimit:oauth:connect:${request.ip}`,
            },
        },
        handler: oauthController.connect.bind(oauthController),
    });

    fastify.get("/:provider/callback", {
        config: {
            rateLimit: {
                max: 10,
                timeWindow: 60000,
                keyGenerator: (request) => `ratelimit:oauth:callback:${request.ip}`,
            },
        },
        handler: oauthController.callback.bind(oauthController),
    });
}
