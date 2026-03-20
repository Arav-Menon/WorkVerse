import type { RegisterOrganizationInviteBody } from "@repo/schemas";
import type { FastifyInstance } from "fastify";
import { createOrganizationInviteController } from "../../controllers";

export default async function organizationInviteLinkRoutes(
  fastify: FastifyInstance,
) {
  fastify.post<{
    Body: RegisterOrganizationInviteBody;
    Params: { orgId: string };
  }>("/:orgId", {
    preHandler: [fastify.authenticate],
    handler: createOrganizationInviteController,
  });
}
