import type { FastifyInstance } from "fastify";
import type { RegisterBody, LoginBody } from "@repo/schemas";
import { $ref } from "../../validationSchemas";
import {
    signupController,
    loginController,
    getMeController,
} from "../../index";

export default async function authRoutes(fastify: FastifyInstance) {
    fastify.post<{ Body: RegisterBody }>("/register", {
        schema: {
            body: $ref("RegisterBodySchema"),
            response: { 201: $ref("SignupResponseSchema") },
        },
        handler: signupController,
    });

    fastify.post<{ Body: LoginBody }>("/login", {
        schema: {
            body: $ref("LoginBodySchema"),
            response: { 200: $ref("LoginResponseSchema") },
        },
        handler: loginController,
    });

    fastify.get("/me", {
        schema: {
            response: { 200: $ref("MeResponseSchema") },
        },
        preHandler: [fastify.authenticate],
        handler: getMeController,
    });
}
