import type { FastifyInstance } from "fastify";
import { validateInviteController } from "../../controllers";

export default async function organizationValidateInviteRoutes(
  fastify: FastifyInstance,
) {
  fastify.get<{
    Params: { token: string };
  }>("/:token", {
    config: {
      rateLimit: {
        max: 20,
        timeWindow: 60000,
        keyGenerator: (request) => `ratelimit:invite:validate:${request.ip}`,
      },
    },
    handler: validateInviteController,
  });
}
