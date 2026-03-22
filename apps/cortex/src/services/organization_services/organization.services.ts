import type { FastifyInstance } from "fastify";
import type { RegisterOrganizationBody } from "@repo/schemas";

export async function registerOrganisation(
  fastify: FastifyInstance,
  input: RegisterOrganizationBody,
  userId: string,
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

  const organization = await fastify.db.organization.create({
    data: { name, slug, createdById: userId },
    select: { id: true, name: true, slug: true, createdById: true },
  });

  return organization;
}
