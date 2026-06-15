import type { FastifyRequest, FastifyReply } from "fastify";
import { getProfile } from "../services/profile_services/profile.service";

export async function getProfileController(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = request.user?.userId;

    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const data = await getProfile(request.server, userId);

    return reply.status(200).send({
      success: true,
      message: "Profile fetched successfully",
      data,
    });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(err.statusCode ?? 500).send({
      success: false,
      message: err.message ?? "Internal Server Error",
    });
  }
}
