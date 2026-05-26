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
    config: {
      rateLimit: {
        max: 5,
        timeWindow: 60000,
        keyGenerator: (request) => {
          const ip = request.ip;
          const email = (request.body as any)?.email || "anonymous";
          return `ratelimit:auth:register:${ip}:${email}`;
        },
      },
    },
    schema: {
      body: $ref("RegisterBodySchema"),
      response: { 201: $ref("SignupResponseSchema") },
    },
    handler: signupController,
  });

  fastify.post<{ Body: LoginBody }>("/login", {
    config: {
      rateLimit: {
        max: 10,
        timeWindow: 60000,
        keyGenerator: (request) => {
          const ip = request.ip;
          const email = (request.body as any)?.email || "anonymous";
          return `ratelimit:auth:login:${ip}:${email}`;
        },
      },
    },
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
