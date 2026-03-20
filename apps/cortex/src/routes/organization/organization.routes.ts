import type { FastifyInstance } from "fastify";
import type { RegisterOrganizationBody } from "@repo/schemas";
import { createOrganizationController } from "../../index";

export default async function organizationRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: RegisterOrganizationBody }>("/", {
    preHandler: [fastify.authenticate],
    handler: createOrganizationController,
  });
}