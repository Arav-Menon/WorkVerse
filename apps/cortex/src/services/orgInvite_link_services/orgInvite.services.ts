import type { FastifyInstance } from "fastify";
import type { RegisterOrganizationInviteBody } from "@repo/schemas";

export async function registerOrganizationInviteLink(
  fastify: FastifyInstance,
  input: RegisterOrganizationInviteBody,
  orgId: string,
  userId: string,
): Promise<{
  inviteLink: string;
  email: string;
  name: string;
}> {
  const { name, email } = input;

  const token = crypto.randomUUID();
  const inviteLink = `http://localhost:3000/invite?token=${token}`;

  const existMail = await fastify.db.organizationInvite.findUnique({
    where: { email },
  });

  if (existMail) {
    await fastify.db.organizationInvite.delete({ where: { email } });
  }

  const orgInvite = await fastify.db.organizationInvite.create({
    data: {
      organizationId: orgId,
      email,
      name,
      token,
      inviteLink: inviteLink,
      createdById: userId,
      status: "PENDING",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
    select: {
      inviteLink: true,
      email: true,
      name: true,
    },
  });

  return orgInvite;
}
