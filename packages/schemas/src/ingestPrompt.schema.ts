import { z } from "zod";

export const ingestPromptSchema = z.object({
  userId: z.string(),
  organizationId: z.string(),
  workspaceId: z.string(),
  systemPrompt: z.string(),
  userPrompt: z.string(),
});

export const UserInboundPromptSchema = z.object({
  promptId: z.string(),
  organizationId: z.string(),
  userId: z.string(),
  workspaceId: z.string(),
  systemPrompt: z.string(),
  userPrompt: z.string(),
});

export const UserWorkflowJobSchema = z.object({
  userId: z.string(),
  parsed: z.any(),
  organizationId: z.string(),
  workspaceId: z.string(),
});

export type ingestPromptBody = z.infer<typeof ingestPromptSchema>;
export type UserInboundPrompt = z.infer<typeof UserInboundPromptSchema>;
export type UserWorkflowJobBody = z.infer<typeof UserWorkflowJobSchema>;
