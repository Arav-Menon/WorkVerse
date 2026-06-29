import type { FastifyInstance } from "fastify";
import { getIntegrationStatusController, disconnectIntegrationController } from "../../controllers/integration.controller";

export default async function integrationRoutes(fastify: FastifyInstance) {
    fastify.get("/:orgId/integrations", {
        preHandler: [fastify.authenticate],
        handler: getIntegrationStatusController,
    });

    fastify.delete("/:orgId/integrations/:provider", {
        config: {
            rateLimit: {
                max: 10,
                timeWindow: 60000,
                keyGenerator: (request) => {
                    const userId = (request.user as any)?.userId || request.ip;
                    return `ratelimit:integration:disconnect:${userId}`;
                },
            },
        },
        preHandler: [fastify.authenticate],
        handler: disconnectIntegrationController,
    });
}
