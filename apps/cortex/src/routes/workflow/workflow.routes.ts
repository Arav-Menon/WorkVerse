import type { FastifyInstance } from "fastify";
import {
  listOrganizationWorkflowsController,
  getWorkflowController,
  deleteWorkflowController,
  listWorkspaceWorkflowsController,
} from "../../controllers/workflow.controller";

export default async function workflowRoutes(fastify: FastifyInstance) {
  fastify.get("/:orgId/workflows", {
    preHandler: [fastify.authenticate],
    handler: listOrganizationWorkflowsController,
  });

  fastify.get("/:orgId/workflows/:workflowId", {
    preHandler: [fastify.authenticate],
    handler: getWorkflowController,
  });

  fastify.delete("/:orgId/workflows/:workflowId", {
    preHandler: [fastify.authenticate],
    handler: deleteWorkflowController,
  });

  fastify.get("/workspaces/:workspaceId/workflows", {
    preHandler: [fastify.authenticate],
    handler: listWorkspaceWorkflowsController,
  });
}
