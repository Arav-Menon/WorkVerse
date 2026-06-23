import type { FastifyInstance } from "fastify";
import { getWorkspaceByIdController } from "../../controllers/workspace.get.controller";

export default async function workspaceStandaloneRoutes(fastify: FastifyInstance) {
  fastify.get("/:workspaceId", {
    preHandler: [fastify.authenticate],
    handler: getWorkspaceByIdController,
  });
}
