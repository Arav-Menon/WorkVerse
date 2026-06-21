import type { FastifyInstance } from "fastify";

export async function validateInviteService(
  fastify: FastifyInstance,
  token: string,
) {
  const invite = await fastify.db.organizationInvite.findUnique({
    where: { token },
    include: {
      organization: {
        select: {
          name: true,
          slug: true,
          description: true,
          _count: { select: { members: true, workspaces: true } },
        },
      },
      user: {
        select: { name: true },
      },
    },
  });

  if (!invite) {
    throw { statusCode: 404, message: "Invalid invitation" };
  }

  if (invite.status !== "PENDING") {
    throw { statusCode: 410, message: "Invitation already used" };
  }

  if (invite.expiresAt < new Date()) {
    throw { statusCode: 410, message: "Invitation expired" };
  }

  return {
    id: invite.id,
    organizationName: invite.organization.name,
    organizationSlug: invite.organization.slug,
    description: invite.organization.description,
    workspaceCount: invite.organization._count.workspaces,
    memberCount: invite.organization._count.members,
    invitedByName: invite.user.name,
    role: invite.role,
    email: invite.email,
    expiresAt: invite.expiresAt.toISOString(),
  };
}
