import type { FastifyInstance } from "fastify";
import { validateInviteController } from "../../controllers";

export default async function organizationValidateInviteRoutes(
  fastify: FastifyInstance,
) {
  fastify.get<{
    Params: { token: string };
  }>("/:token", {
    handler: validateInviteController,
  });
}
