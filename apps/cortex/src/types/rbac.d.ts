import type { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authorize: (
      permission: "INVITE_MEMBER" | "CREATE_WORKSPACE" | "REMOVE_MEMBER"
    ) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
