import type { FastifyRequest, FastifyReply } from "fastify";
import { validateInviteService } from "../services";

export async function validateInviteController(
  request: FastifyRequest<{ Params: { token: string } }>,
  reply: FastifyReply,
) {
  try {
    const { token } = request.params;
    const data = await validateInviteService(request.server, token);
    return reply.status(200).send({ success: true, data });
  } catch (err: any) {
    request.log.error(err);
    const status = err.statusCode ?? 500;
    return reply.status(status).send({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}
