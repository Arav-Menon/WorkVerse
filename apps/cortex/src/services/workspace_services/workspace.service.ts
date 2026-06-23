import type { FastifyInstance } from "fastify";
import type { RegisterWorkspaceBody } from "@repo/schemas";

export async function registerWorkspace(
  fastify: FastifyInstance,
  input: RegisterWorkspaceBody,
  orgId: string,
  userId: string,
): Promise<{ id: string; name: string; slug: string; description: string | null; createdById: string; organizationId: string }> {
  const { name, slug, description } = input;

  const existingName = await fastify.db.workspace.findUnique({
    where: { name },
  });

  if (existingName) {
    throw {
      statusCode: 409,
      message: "A workspace with this name already exists",
    };
  }

  const existingSlug = await fastify.db.workspace.findUnique({
    where: { slug },
  });

  if (existingSlug) {
    throw {
      statusCode: 409,
      message: "A workspace with this slug already exists",
    };
  }

  const workspace_space = await fastify.db.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name,
        slug,
        description: description ?? null,
        createdById: userId,
        organizationId: orgId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        createdById: true,
        organizationId: true,
      },
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

  await fastify.cache.set(
    `workspace_space${workspace_space.id}:access`,
    JSON.stringify(workspace_space),
    "EX",
    3600
  );

  // Invalidate workspace list cache for this org
  const cachePattern = `workspaces:org:${orgId}:*`;
  const keys = await fastify.cache.keys(cachePattern);
  if (keys.length > 0) {
    await fastify.cache.del(...keys);
  }

  return workspace_space;
}
