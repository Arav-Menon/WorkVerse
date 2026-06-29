import type { FastifyInstance } from "fastify";

export async function getMembership(
  fastify: FastifyInstance,
  userId: string,
  orgId: string
) {
  const membership = await fastify.db.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: orgId, userId } },
    select: {
      organizationId: true,
      role: true,
      joinedAt: true,
    },
  });

  if (!membership) {
    throw { statusCode: 404, message: "You are not a member of this organization" };
  }

  return membership;
}
