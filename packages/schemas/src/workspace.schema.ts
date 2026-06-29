import { z } from "zod";

const RegisterWorkspaceSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().optional(),
});

export type RegisterWorkspaceBody = z.infer<typeof RegisterWorkspaceSchema>;
