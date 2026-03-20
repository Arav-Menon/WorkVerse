import type { AcceptOrganizationInviteBody } from "@repo/schemas";
import type { FastifyReply, FastifyRequest } from "fastify";
import { registerAcceptInviteService } from "../services";

export async function acceptOrganizationInviteController(
  request: FastifyRequest<{
    Body: AcceptOrganizationInviteBody;
  }>,
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

    const organizationInviteLink = await registerAcceptInviteService(
      request.server,
      request.body.token,
      userId,
    );

    return { message: organizationInviteLink };
  } catch (err: any) {
    request.log.error(err);
    if (err.statusCode) {
      return reply.status(err.statusCode).send(err);
    }
    return reply.status(500).send({ error: "Internal server error" });
  }
}
