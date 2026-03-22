import { z } from "zod";

export const createRoomSchema = z.object({
  currentUserId: z.string().min(1, "Current user ID cannot be empty"),
  targetUserId: z.string().min(1, "Other user ID cannot be empty"),
});

export type CreateRoomBody = z.infer<typeof createRoomSchema>;
