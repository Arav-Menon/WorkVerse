import type { FastifyInstance } from "fastify";

export async function getProfile(fastify: FastifyInstance, userId: string) {

  const user = await fastify.db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw { statusCode: 404, message: "User profile not found" };
  }

  return user;
}
