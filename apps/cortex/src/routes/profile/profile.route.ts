import type { FastifyInstance } from "fastify";
import { getProfileController } from "../../controllers/profile.controller";

export default async function profileRoutes(fastify: FastifyInstance) {
  fastify.get("/me", {
    preHandler: [fastify.authenticate],
    handler: getProfileController,
  });
}
