import type { FastifyInstance } from "fastify";
import {
  getOrganizationsController,
  getOrganizationController,
} from "../../controllers/organization.get.controller";
import { getMembershipController } from "../../controllers/organization.membership.controller";

export default async function organizationGetRoutes(fastify: FastifyInstance) {
  fastify.get("/", {
    preHandler: [fastify.authenticate],
    handler: getOrganizationsController,
  });

  fastify.get("/:orgId", {
    preHandler: [fastify.authenticate],
    handler: getOrganizationController,
  });

  fastify.get("/:orgId/membership", {
    preHandler: [fastify.authenticate],
    handler: getMembershipController,
  });
}
