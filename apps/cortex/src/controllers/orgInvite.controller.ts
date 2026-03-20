import type { RegisterOrganizationInviteBody } from "@repo/schemas";
import type { FastifyReply, FastifyRequest } from "fastify";
import { registerOrganizationInviteLink } from "../services";
import { inviteQueue } from "@repo/queue";

export async function createOrganizationInviteController(
  request: FastifyRequest<{
    Body: RegisterOrganizationInviteBody;
    Params: { orgId: string };
  }>,
  reply: FastifyReply,
) {
  try {
    const userId = request.user?.userId;
    const { orgId } = request.params;

    if (!userId) {
      return reply.status(401).send({
        error: "Unauthorized",
        message: "User not found in request. Missing Middleware?",
      });
    }

    const organizationInviteLink = await registerOrganizationInviteLink(
      request.server,
      request.body,
      orgId,
      userId,
    );

    await inviteQueue.add("invite-email", organizationInviteLink);

    return { message: "Invite sent" };
  } catch (err: any) {
    request.log.error(err);
    if (err.statusCode) {
      return reply.status(err.statusCode).send(err);
    }
    return reply.status(500).send({ error: "Internal server error" });
  }
}
