import { createWorkspaceController } from "../../controllers/workspace.controller";
import type { FastifyInstance } from "fastify";
import type { RegisterWorkspaceBody } from "@repo/schemas";

export default async function workspaceRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: RegisterWorkspaceBody; Params: { orgId: string } }>(
    "/:orgId",
    {
      config: {
        rateLimit: {
          max: 10,
          timeWindow: 300000,
          keyGenerator: (request) => {
            const userId = (request.user as any)?.userId || request.ip;
            return `ratelimit:workspace:register:${userId}`;
          },
        },
      },

      preHandler: [fastify.authenticate],
      handler: createWorkspaceController,
    },
  );
}
