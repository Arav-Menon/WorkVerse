import type { FastifyInstance } from "fastify";
import type { RegisterWorkspaceBody } from "@repo/schemas";

export async function registerWorkspace(
  fastify: FastifyInstance,
  input: RegisterWorkspaceBody,
  orgId: string,
  userId: string,
): Promise<{ id: string; name: string; createdById: string }> {
  const { name } = input;

  const existing = await fastify.db.workspace.findUnique({
    where: { name },
  });

  if (existing)
    throw {
      statsCode: 409,
      message:
        "A workspace with this name in this organization is already exists",
    };

  const workspace = await fastify.db.workspace.create({
    data: { name, createdById: userId, organizationId: orgId },
    select: { id: true, name: true, createdById: true, organizationId: true },
  });

  return workspace;
}
