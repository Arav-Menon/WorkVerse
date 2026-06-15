import type { FastifyInstance } from "fastify";
import {
  getOrganizationsController,
  getOrganizationController,
} from "../../controllers/organization.get.controller";

export default async function organizationGetRoutes(fastify: FastifyInstance) {
  fastify.get("/", {
    preHandler: [fastify.authenticate],
    handler: getOrganizationsController,
  });

  fastify.get("/:orgId", {
    preHandler: [fastify.authenticate],
    handler: getOrganizationController,
  });
}
