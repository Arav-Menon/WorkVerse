import type { AcceptOrganizationInviteBody } from "@repo/schemas";
import type { FastifyInstance } from "fastify";
import { acceptOrganizationInviteController } from "../../controllers";

export default async function organizationAcceptInviteRoutes(
  fastify: FastifyInstance,
) {
  fastify.post<{
    Body: AcceptOrganizationInviteBody;
  }>("/", {
    preHandler: [fastify.authenticate],
    handler: acceptOrganizationInviteController,
  });
}
