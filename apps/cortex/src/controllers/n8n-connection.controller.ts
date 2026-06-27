import { n8nConnectionService } from "../services/n8n_services/n8n-connection.service";

export async function connectN8nController(request: any, reply: any) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId } = request.params;
    if (!orgId) {
      return reply.status(400).send({ success: false, message: "Organization ID required" });
    }

    const { baseUrl, apiKey } = request.body;
    if (!baseUrl || !apiKey) {
      return reply.status(400).send({ success: false, message: "Base URL and API key are required" });
    }

    const result = await n8nConnectionService.connect(orgId, userId, baseUrl, apiKey);

    return reply.status(200).send({
      success: true,
      message: "n8n instance connected successfully",
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return reply.status(statusCode).send({ success: false, message });
  }
}

export async function getN8nStatusController(request: any, reply: any) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId } = request.params;
    if (!orgId) {
      return reply.status(400).send({ success: false, message: "Organization ID required" });
    }

    const membership = await request.server.db.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId } },
    });

    if (!membership) {
      return reply.status(403).send({ success: false, message: "Not a member of this organization" });
    }

    const status = await n8nConnectionService.getStatus(orgId);

    return reply.status(200).send({
      success: true,
      data: status,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return reply.status(statusCode).send({ success: false, message });
  }
}

export async function testN8nConnectionController(request: any, reply: any) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId } = request.params;
    if (!orgId) {
      return reply.status(400).send({ success: false, message: "Organization ID required" });
    }

    const membership = await request.server.db.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId } },
    });

    if (!membership) {
      return reply.status(403).send({ success: false, message: "Not a member of this organization" });
    }

    if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
      return reply.status(403).send({ success: false, message: "Only owners and admins can test n8n connections" });
    }

    const result = await n8nConnectionService.testConnection(orgId);

    return reply.status(200).send({
      success: true,
      data: result,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return reply.status(statusCode).send({ success: false, message });
  }
}

export async function disconnectN8nController(request: any, reply: any) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId } = request.params;
    if (!orgId) {
      return reply.status(400).send({ success: false, message: "Organization ID required" });
    }

    const membership = await request.server.db.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId } },
    });

    if (!membership) {
      return reply.status(403).send({ success: false, message: "Not a member of this organization" });
    }

    if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
      return reply.status(403).send({ success: false, message: "Only owners and admins can disconnect n8n" });
    }

    const result = await n8nConnectionService.disconnect(orgId);

    return reply.status(200).send({
      success: true,
      message: result.message,
    });
  } catch (err: any) {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return reply.status(statusCode).send({ success: false, message });
  }
}
