import type { FastifyInstance } from "fastify";
import { getIntegrationStatusController, disconnectIntegrationController } from "../../controllers/integration.controller";

export default async function integrationRoutes(fastify: FastifyInstance) {
    fastify.get("/:orgId/integrations", {
        preHandler: [fastify.authenticate],
        handler: getIntegrationStatusController,
    });

    fastify.delete("/:orgId/integrations/:provider", {
        preHandler: [fastify.authenticate],
        handler: disconnectIntegrationController,
    });
}
