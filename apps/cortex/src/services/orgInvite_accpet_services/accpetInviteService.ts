// apps/cortex/src/services/orgInvite_accpet_services/accpetInviteService.ts

import type { FastifyInstance } from "fastify";

export async function registerAcceptInviteService(
  fastify: FastifyInstance,
  token: string,
  userId: string,
) {
  // 1. Fetch invite AND the user (to check email match)
  const [invite, user] = await Promise.all([
    fastify.db.organizationInvite.findUnique({ where: { token } }),
    fastify.db.user.findUnique({ where: { id: userId } })
  ]);

  if (!invite) throw { statusCode: 404, message: "Invalid invite link" };
  if (!user) throw { statusCode: 404, message: "User not found" };

  if (invite.email !== user.email) {
    throw { statusCode: 403, message: "This invite was sent to a different email address" };
  }

  if (invite.status !== "PENDING") throw { statusCode: 400, message: "Invite already used" };
  if (invite.expiresAt && invite.expiresAt < new Date()) throw { statusCode: 410, message: "Invite expired" };

  const existingMember = await fastify.db.organizationMember.findFirst({
    where: { organizationId: invite.organizationId, userId: userId }
  });

  if (existingMember) {
    await fastify.db.organizationInvite.update({
      where: { token },
      data: { status: "ACCEPTED" }
    });
    return { message: "You are already a member of this organization" };
  }

  await fastify.db.$transaction(async (tx) => {
    await tx.organizationMember.create({
      data: {
        organizationId: invite.organizationId,
        userId: userId,
        role: "MEMBER",
      },
    });

    await tx.organizationInvite.update({
      where: { token },
      data: { status: "ACCEPTED" },
    });
  });

  await fastify.cache.set(`user:${userId}:access`, JSON.stringify(invite.organizationId));

  return { message: "Joined organization successfully" };
}
