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
        error: "Unauthorized",
        message: "User not found in request. Missing Middleware?",
      });
    }

    const workspace = await registerWorkspace(
      request.server,
      request.body,
      orgId,
      userId,
    );

    return reply.status(201).send(workspace);
  } catch (err: any) {
    request.log.error(err);
    if (err.statusCode) {
      return reply.status(err.statusCode).send(err);
    }
    return reply.status(500).send({ error: "Internal server Error" });
  }
}
