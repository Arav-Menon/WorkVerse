import type { FastifyInstance } from "fastify";
import type { RegisterOrganizationBody } from "@repo/schemas";
import { createOrganizationController } from "../../index";

export default async function organizationRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: RegisterOrganizationBody }>("/", {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: 300000,
        keyGenerator: (request) => {
          const userId = (request.user as any)?.userId || request.ip;
          return `ratelimit:org:register:${userId}`;
        },
      },
    },
    preHandler: [fastify.authenticate],
    handler: createOrganizationController,
  });
}
