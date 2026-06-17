import type { FastifyInstance } from "fastify";

const ORGS_TTL = 3600; // 1 hour

export async function getUserOrganizations(
  fastify: FastifyInstance,
  userId: string
) {
  const cacheKey = `orgs:user:${userId}`;

  const cached = await fastify.cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch all orgs the user is a member of, with workspace count — single query, no N+1
  const memberships = await fastify.db.organizationMember.findMany({
    where: { userId },
    select: {
      organization: {
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
          _count: { select: { workspaces: true } },
        },
      },
    },
  });

  const organizations = memberships.map((m) => ({
    ...m.organization,
    workspaceCount: m.organization._count.workspaces,
    _count: undefined,
  }));

  await fastify.cache.set(cacheKey, JSON.stringify(organizations), "EX", ORGS_TTL);

  return organizations;
}

export async function getOrganizationById(
  fastify: FastifyInstance,
  userId: string,
  orgId: string
) {
  const cacheKey = `org:${orgId}:user:${userId}`;

  const cached = await fastify.cache.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // Validate access: user must be a member of this org
  const membership = await fastify.db.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: orgId, userId } },
  });

  if (!membership) {
    throw { statusCode: 403, message: "You do not have access to this organization" };
  }

  const org = await fastify.db.organization.findUnique({
    where: { id: orgId },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      _count: { select: { workspaces: true } },
    },
  });

  if (!org) {
    throw { statusCode: 404, message: "Organization not found" };
  }

  const result = {
    ...org,
    workspaceCount: org._count.workspaces,
    _count: undefined,
  };

  await fastify.cache.set(cacheKey, JSON.stringify(result), "EX", ORGS_TTL);

  return result;
}
