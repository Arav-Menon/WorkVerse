import type { FastifyInstance } from "fastify";

export async function getProfile(fastify: FastifyInstance, userId: string) {
  const user = await fastify.db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      memberships: {
        select: { id: true },
      },
      organization: {
        select: { id: true },
      },
      workspace: {
        select: { id: true },
      },
      oauthConnections: {
        select: {
          provider: true,
          createdAt: true,
        },
      },
    },
  });

  if (!user) {
    throw { statusCode: 404, message: "User profile not found" };
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
    counts: {
      organizations: user.memberships.length + user.organization.length,
      workspaces: user.workspace.length,
      spaces: 0,
    },
    connectedAccounts: user.oauthConnections.map((c) => ({
      provider: c.provider,
      connectedAt: c.createdAt.toISOString(),
    })),
  };
}
