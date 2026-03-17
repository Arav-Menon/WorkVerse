import type { FastifyRequest, FastifyReply } from "fastify";
import type { RegisterBody, LoginBody } from "@repo/schemas";
import { signupUser, loginUser } from "../services/auth_services/auth.service";

export async function signupController(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply,
) {
  try {
    const result = await signupUser(request.server, request.body);
    return reply.status(201).send({
      success: true,
      message: "Account created successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? "Internal server error";
    return reply.status(statusCode).send({ success: false, message });
  }
}

export async function loginController(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply,
) {
  try {
    const result = await loginUser(request.server, request.body);
    return reply.status(200).send({
      success: true,
      message: "Logged in successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode ?? 500;
    const message = err.message ?? "Internal server error";
    return reply.status(statusCode).send({ success: false, message });
  }
}

export async function getMeController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  return reply.status(200).send({
    success: true,
    data: request.user,
  });
}
