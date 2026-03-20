import type { FastifyInstance } from "fastify";

export async function registerAcceptInviteService(
  fastify: FastifyInstance,
  token: string,
  userId: string,
) {
  const invite = await fastify.db.organizationInvite.findUnique({
    where: { token },
  });

  const validations = [
    { condition: !invite, message: "Invalid invite link", statusCode: 404 },
    {
      condition: invite?.status !== "PENDING",
      message: "Invite link has already been used",
      statusCode: 400,
    },
    {
      condition: invite?.expiresAt && invite.expiresAt < new Date(),
      message: "Invite link has expired",
      statusCode: 410,
    },
  ];

  for (const validation of validations) {
    if (validation.condition)
      throw { statusCode: validation.statusCode, message: validation.message };
  }

  await fastify.db.$transaction(async (tx) => {
    await tx.organizationMember.create({
      data: {
        organizationId: invite?.organizationId!,
        userId: userId,
        role: "MEMBER",
      },
    });

    await tx.organizationInvite.update({
      where: { token },
      data: { status: "ACCEPTED" },
    });
  });

  return { message: "Joined organization" };
}
