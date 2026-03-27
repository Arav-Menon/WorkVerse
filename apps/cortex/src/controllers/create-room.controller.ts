import type { FastifyReply, FastifyRequest } from "fastify";
import { registerCreateRoom } from "../services";
import type { CreateRoomBody } from "@repo/schemas";

export async function registerCreateRoomController(
  request: FastifyRequest<{ Body: CreateRoomBody }>,
  reply: FastifyReply,
) {
  try {
    const userId = request.user?.userId;

    if (!userId) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "User not found in request. Missing Middleware?",
      });
    }

    const createRoom = await registerCreateRoom(request.server, request.body);
    return reply.status(201).send(createRoom);
  } catch (err: any) {
    request.log.error(err);
    if (err.statusCode) {
      return reply.status(err.statusCode).send(err);
    }
    return reply.status(500).send({ error: "Internal server Error" });
  }
}