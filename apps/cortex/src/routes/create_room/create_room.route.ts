import type { FastifyInstance } from "fastify";
import type { CreateRoomBody } from "@repo/schemas";
import { registerCreateRoomController } from "../../controllers";

export default async function createRoomRoutes(fastify: FastifyInstance) {
  fastify.post<{ Body: CreateRoomBody }>("/", {
    config: {
      rateLimit: {
        max: 5,
        timeWindow: 60000,
        keyGenerator: (request) => {
          const userId = (request.user as any)?.userId || request.ip;
          return `ratelimit:room:create:${userId}`;
        },
      },
    },
    preHandler: [fastify.authenticate],
    handler: registerCreateRoomController,
  });
}
