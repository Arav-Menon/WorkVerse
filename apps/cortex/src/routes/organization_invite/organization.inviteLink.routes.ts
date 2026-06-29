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
    config: {
      rateLimit: {
        max: 5,
        timeWindow: 300000,
        keyGenerator: (request) => {
          const userId = (request.user as any)?.userId || request.ip;
          return `ratelimit:org:invite:${userId}`;
        },
      },
    },
    preHandler: [fastify.authenticate, fastify.authorize("INVITE_MEMBER")],
    handler: createOrganizationInviteController,
  });
}
