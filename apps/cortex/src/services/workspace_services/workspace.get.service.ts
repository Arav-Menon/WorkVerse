import type { FastifyInstance } from "fastify";

const WS_TTL = 3600;

async function assertOrgMembership(
  fastify: FastifyInstance,
  userId: string,
  orgId: string
) {
  const membership = await fastify.db.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: orgId, userId } },
  });

  if (!membership) {
    throw { statusCode: 403, message: "You do not have access to this organization" };
  }
}

export async function getOrgWorkspaces(
  fastify: FastifyInstance,
  userId: string,
  orgId: string
) {
  const cacheKey = `workspaces:org:${orgId}:user:${userId}`;

  const cached = await fastify.cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  await assertOrgMembership(fastify, userId, orgId);

  const workspaces = await fastify.db.workspace.findMany({
    where: { organizationId: orgId },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      organizationId: true,
      createdAt: true,
      _count: { select: { spaces: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const result = workspaces.map((ws) => ({
    ...ws,
    spaceCount: ws._count.spaces,
    _count: undefined,
  }));

  await fastify.cache.set(cacheKey, JSON.stringify(result), "EX", WS_TTL);

  return result;
}

export async function getWorkspaceById(
  fastify: FastifyInstance,
  userId: string,
  orgId: string,
  workspaceId: string
) {
  const cacheKey = `workspace:${workspaceId}:user:${userId}`;

  const cached = await fastify.cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  await assertOrgMembership(fastify, userId, orgId);

  const workspace = await fastify.db.workspace.findFirst({
    where: { id: workspaceId, organizationId: orgId },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      organizationId: true,
      createdAt: true,
      _count: { select: { spaces: true } },
    },
  });

  if (!workspace) {
    throw { statusCode: 404, message: "Workspace not found" };
  }

  const result = {
    ...workspace,
    spaceCount: workspace._count.spaces,
    _count: undefined,
  };

  await fastify.cache.set(cacheKey, JSON.stringify(result), "EX", WS_TTL);

  return result;
}

export async function getWorkspace(
  fastify: FastifyInstance,
  workspaceId: string
) {
  const cacheKey = `workspace:${workspaceId}`;

  const cached = await fastify.cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  const workspace = await fastify.db.workspace.findUnique({
    where: { id: workspaceId },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      organizationId: true,
      createdAt: true,
      _count: { select: { spaces: true } },
    },
  });

  if (!workspace) {
    throw { statusCode: 404, message: "Workspace not found" };
  }

  const result = {
    ...workspace,
    spaceCount: workspace._count.spaces,
    _count: undefined,
  };

  await fastify.cache.set(cacheKey, JSON.stringify(result), "EX", WS_TTL);

  return result;
}
