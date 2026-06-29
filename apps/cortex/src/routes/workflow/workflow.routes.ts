import type { FastifyInstance } from "fastify";
import {
  listOrganizationWorkflowsController,
  getWorkflowController,
  deleteWorkflowController,
  listWorkspaceWorkflowsController,
  listWorkspaceWorkflowHistoryController,
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
    config: {
      rateLimit: {
        max: 10,
        timeWindow: 60000,
        keyGenerator: (request) => {
          const userId = (request.user as any)?.userId || request.ip;
          return `ratelimit:workflow:delete:${userId}`;
        },
      },
    },
    preHandler: [fastify.authenticate],
    handler: deleteWorkflowController,
  });

  fastify.get("/workspaces/:workspaceId/workflows", {
    preHandler: [fastify.authenticate],
    handler: listWorkspaceWorkflowsController,
  });

  fastify.get("/workspaces/:workspaceId/workflows/history", {
    preHandler: [fastify.authenticate],
    handler: listWorkspaceWorkflowHistoryController,
  });
}
