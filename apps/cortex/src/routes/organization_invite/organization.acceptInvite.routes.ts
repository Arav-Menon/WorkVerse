import type { AcceptOrganizationInviteBody } from "@repo/schemas";
import type { FastifyInstance } from "fastify";
import { acceptOrganizationInviteController } from "../../controllers";

export default async function organizationAcceptInviteRoutes(
  fastify: FastifyInstance,
) {
  fastify.post<{
    Body: AcceptOrganizationInviteBody;
  }>("/", {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: 300000,
        keyGenerator: (request) => {
          const userId = (request.user as any)?.userId || request.ip;
          return `ratelimit:org:accept:${userId}`;
        },
      },
    },
    preHandler: [fastify.authenticate],
    handler: acceptOrganizationInviteController,
  });
}
