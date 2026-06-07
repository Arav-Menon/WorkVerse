import type { FastifyInstance } from "fastify";
import type { RegisterOrganizationBody } from "@repo/schemas";

export async function registerOrganisation(
  fastify: FastifyInstance,
  input: RegisterOrganizationBody,
  userId: string
): Promise<{ id: string; name: string; slug: string; createdById: string }> {
  const { name, slug } = input;

  const existing = await fastify.db.organization.findUnique({
    where: {
      slug,
    },
  });

  if (existing)
    throw {
      statusCode: 409,
      message: "An Organization with this slug already exists",
    };

  const organization = await fastify.db.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: { name, slug, createdById: userId },
      select: { id: true, name: true, slug: true, createdById: true },
    });

    await tx.organizationMember.create({
      data: {
        organizationId: organization.id,
        userId: userId,
        role: "ADMIN",
      },
    })

    return organization;
  })

  await fastify.cache.set(`user:${userId}:access`, JSON.stringify(organization.id), "EX", 24 * 60 * 60);

  return organization;
}
