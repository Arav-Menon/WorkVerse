import type { FastifyReply, FastifyRequest } from "fastify";
import { registerWorkspace } from "../services";
import type { RegisterWorkspaceBody } from "@repo/schemas";

export async function createWorkspaceController(
  request: FastifyRequest<{
    Body: RegisterWorkspaceBody;
    Params: { orgId: string };
  }>,
  reply: FastifyReply,
) {
  try {
    const userId = request.user?.userId;
    const { orgId } = request.params;

    if (!userId) {
      return reply.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

    const workspace = await registerWorkspace(
      request.server,
      request.body,
      orgId,
      userId,
    );

    return reply.status(201).send({
      success: true,
      message: "Workspace created successfully",
      data: workspace,
    });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(err.statusCode ?? 500).send({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}
