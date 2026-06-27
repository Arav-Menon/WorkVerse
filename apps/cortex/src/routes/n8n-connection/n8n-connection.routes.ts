import type { FastifyInstance } from "fastify";
import {
  connectN8nController,
  getN8nStatusController,
  testN8nConnectionController,
  disconnectN8nController,
} from "../../controllers/n8n-connection.controller";

export default async function n8nConnectionRoutes(fastify: FastifyInstance) {
  fastify.post("/:orgId/n8n/connect", {
    preHandler: [fastify.authenticate],
    handler: connectN8nController,
  });

  fastify.get("/:orgId/n8n/status", {
    preHandler: [fastify.authenticate],
    handler: getN8nStatusController,
  });

  fastify.post("/:orgId/n8n/test", {
    preHandler: [fastify.authenticate],
    handler: testN8nConnectionController,
  });

  fastify.delete("/:orgId/n8n/disconnect", {
    preHandler: [fastify.authenticate],
    handler: disconnectN8nController,
  });
}
