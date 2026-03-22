import type { FastifyInstance } from "fastify";
import type { CreateRoomBody } from "@repo/schemas";
import { registerCreateRoomController } from "../../controllers";

export default async function createRoomRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: CreateRoomBody }>("/", {
    preHandler: [fastify.authenticate],
    handler: registerCreateRoomController,
  });
}
