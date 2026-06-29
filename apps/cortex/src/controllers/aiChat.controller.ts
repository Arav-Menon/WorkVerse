import type { FastifyReply, FastifyRequest } from "fastify";
import { getAiChatHistory, deleteAiChatHistory } from "../services/aiChat_services/aiChat.service";

export async function getAiChatHistoryController(
  request: FastifyRequest<{
    Querystring: { workspaceId: string; limit?: string };
  }>,
  reply: FastifyReply,
) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const { workspaceId, limit } = request.query;

    if (!workspaceId) {
      return reply.status(400).send({ error: "workspaceId is required" });
    }

    const result = await getAiChatHistory(
      request.server,
      {
        workspaceId,
        limit: limit ? parseInt(limit, 10) : 20,
      },
      userId,
    );

    if (!result.success) {
      return reply.status(500).send({ error: result.error });
    }

    return reply.status(200).send({ messages: result.messages });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(500).send({ error: "Internal server error" });
  }
}

export async function deleteAiChatHistoryController(
  request: FastifyRequest<{
    Querystring: { workspaceId: string };
  }>,
  reply: FastifyReply,
) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const { workspaceId } = request.query;

    if (!workspaceId) {
      return reply.status(400).send({ error: "workspaceId is required" });
    }

    const result = await deleteAiChatHistory(
      request.server,
      workspaceId,
      userId,
    );

    if (!result.success) {
      return reply.status(500).send({ error: result.error });
    }

    return reply.status(200).send({ success: true, deleted: result.deleted });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(500).send({ error: "Internal server error" });
  }
}
