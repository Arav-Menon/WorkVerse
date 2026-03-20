import { z } from "zod";

const RegisterWorkspaceSchema = z.object({
  name: z.string().min(3, "Name must be at least 2 characters"),
});

export type RegisterWorkspaceBody = z.infer<typeof RegisterWorkspaceSchema>;
