import { z } from "zod";

const RegisterOrganizationSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().max(500, "Description must be at most 500 characters").optional(),
});

const RegisterOrganizationInviteSchema = z.object({
  name: z.string().min(3, "Name must be at least 2 characters"),
  email: z.string().email("invalid email address"),
});

const AcceptOrganizationInviteSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type RegisterOrganizationBody = z.infer<
  typeof RegisterOrganizationSchema
>;
export type RegisterOrganizationInviteBody = z.infer<
  typeof RegisterOrganizationInviteSchema
>;
export type AcceptOrganizationInviteBody = z.infer<
  typeof AcceptOrganizationInviteSchema
>;

const ValidateInviteParamsSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export type ValidateInviteParams = z.infer<typeof ValidateInviteParamsSchema>;
