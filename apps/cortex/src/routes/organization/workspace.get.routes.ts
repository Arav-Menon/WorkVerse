import type { FastifyInstance } from "fastify";
import {
  getWorkspacesController,
  getWorkspaceController,
} from "../../controllers/workspace.get.controller";

export default async function workspaceGetRoutes(fastify: FastifyInstance) {
  fastify.get("/:orgId/workspaces", {
    preHandler: [fastify.authenticate],
    handler: getWorkspacesController,
  });

  fastify.get("/:orgId/workspaces/:workspaceId", {
    preHandler: [fastify.authenticate],
    handler: getWorkspaceController,
  });
}
