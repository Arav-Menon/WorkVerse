import { z } from "zod";

const RegisterOrganizationSchema = z.object({
  name: z.string().min(3, "Name must be at least 2 characters"),
  slug: z.string().min(3, "slug must be at least 2 characters"),
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
