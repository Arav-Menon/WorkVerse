import type { FastifyRequest, FastifyReply } from "fastify";
import {
  getOrgWorkspaces,
  getWorkspaceById,
} from "../services/workspace_services/workspace.get.service";

export async function getWorkspacesController(
  request: FastifyRequest<{ Params: { orgId: string } }>,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId } = request.params;
    const data = await getOrgWorkspaces(request.server, userId, orgId);

    return reply.status(200).send({
      success: true,
      message: "Workspaces fetched successfully",
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

export async function getWorkspaceController(
  request: FastifyRequest<{ Params: { orgId: string; workspaceId: string } }>,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId, workspaceId } = request.params;
    const data = await getWorkspaceById(request.server, userId, orgId, workspaceId);

    return reply.status(200).send({
      success: true,
      message: "Workspace fetched successfully",
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
