import type { FastifyRequest, FastifyReply } from "fastify";
import { getMembership } from "../services/organization_services/organization.membership.service";

export async function getMembershipController(
  request: FastifyRequest<{ Params: { orgId: string } }>,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId } = request.params;
    const data = await getMembership(request.server, userId, orgId);

    return reply.status(200).send({
      success: true,
      message: "Membership fetched successfully",
      data,
    });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(err.statusCode ?? 500).send({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}
