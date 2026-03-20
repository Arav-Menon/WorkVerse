import { createWorkspaceController } from "../../controllers/workspace.controller";
import type { FastifyInstance } from "fastify";
import type { RegisterWorkspaceBody } from "@repo/schemas";

export default async function workspaceRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: RegisterWorkspaceBody; Params: { orgId: string } }>(
    "/:orgId",
    {
      preHandler: [fastify.authenticate],
      handler: createWorkspaceController,
    },
  );
}
