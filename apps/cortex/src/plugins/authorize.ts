import fp from "fastify-plugin";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { hasPermission, type Permission } from "@repo/rbac";

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate("authorize", (permission: Permission) => {
    return async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request.user as any)?.userId;
      const orgId = (request.params as any)?.orgId;

      if (!userId) {
        return reply.status(401).send({ success: false, message: "Unauthorized" });
      }

      if (!orgId) {
        return reply.status(400).send({ success: false, message: "Organization ID required" });
      }

      const membership = await fastify.db.organizationMember.findUnique({
        where: { organizationId_userId: { organizationId: orgId, userId } },
      });

      if (!membership) {
        return reply.status(403).send({ success: false, message: "You are not a member of this organization" });
      }

      if (!hasPermission(membership.role, permission)) {
        return reply.status(403).send({ success: false, message: "Insufficient permissions" });
      }
    };
  });
});
