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

  const workspace_space = await fastify.db.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: { name, createdById: userId, organizationId: orgId },
      select: { id: true, name: true, createdById: true, organizationId: true },
    });

    await tx.space.create({
      data: {
        orgId,
        workspaceId: workspace.id,
        createdById: userId,
        userId: userId,
      },
    });

    return workspace;
  });

  await fastify.cache.set(`workspace_space${workspace_space.id}:access`, JSON.stringify(workspace_space), "EX", "3,600");

  return workspace_space;
}
