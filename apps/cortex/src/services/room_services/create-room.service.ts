import type { CreateRoomBody } from "@repo/schemas";
import { getRoomId_sort } from "./getRoomId_sort.services";
import type { FastifyInstance } from "fastify";

export async function registerCreateRoom(
  fastify: FastifyInstance,
  input: CreateRoomBody,
): Promise<{
  id: string;
  name: string;
  createdById: string;
}> {
  const { targetUserId, currentUserId } = input;

  const cacheKey = `roomId:${[currentUserId, targetUserId].sort().join(":")}`;
  const cachedRoomId = await fastify.cache.get(cacheKey);
  console.log(cacheKey);

  if (cachedRoomId) {
    return { id: cachedRoomId, name: cachedRoomId, createdById: currentUserId };
  }

  const roomId = getRoomId_sort(currentUserId, targetUserId);

  await fastify.cache.set(cacheKey, roomId, {
    EX: 24 * 60 * 60,
  });

  return { id: roomId, name: roomId, createdById: currentUserId };
}
