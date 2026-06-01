import { z } from "zod";

export const transportSchema = z.object({
    roomId: z.string().min(1, "roomId cannot be empty").max(100),
    userId: z.string().min(1, "userId cannot be empty").max(100),
})

export type TransportInput = z.infer<typeof transportSchema>
