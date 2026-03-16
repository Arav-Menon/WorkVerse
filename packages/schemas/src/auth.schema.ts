import { z } from "zod";

// ─── Signup ───────────────────────────────────────────────────────────────────

export const RegisterBodySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const SignupResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z
        .object({
            token: z.string(),
            user: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
            }),
        })
        .optional(),
});

// ─── Login ────────────────────────────────────────────────────────────────────

export const LoginBodySchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export const LoginResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    data: z
        .object({
            token: z.string(),
            user: z.object({
                id: z.string(),
                name: z.string(),
                email: z.string(),
            }),
        })
        .optional(),
});

// ─── Me ───────────────────────────────────────────────────────────────────────

export const MeResponseSchema = z.object({
    success: z.boolean(),
    data: z.object({
        userId: z.string(),
        email: z.string(),
    }),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type RegisterBody = z.infer<typeof RegisterBodySchema>;
export type LoginBody = z.infer<typeof LoginBodySchema>;
