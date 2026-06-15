import type { FastifyRequest, FastifyReply } from "fastify";
import {
  getUserOrganizations,
  getOrganizationById,
} from "../services/organization_services/organization.get.service";

export async function getOrganizationsController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const data = await getUserOrganizations(request.server, userId);

    return reply.status(200).send({
      success: true,
      message: "Organizations fetched successfully",
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

export async function getOrganizationController(
  request: FastifyRequest<{ Params: { orgId: string } }>,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId } = request.params;
    const data = await getOrganizationById(request.server, userId, orgId);

    return reply.status(200).send({
      success: true,
      message: "Organization fetched successfully",
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
