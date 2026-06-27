import { workflowService } from "../services/workflow_services/workflow.service";

export async function listOrganizationWorkflowsController(request: any, reply: any) {
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

    const workflows = await workflowService.getOrganizationWorkflows(orgId);

    return reply.status(200).send({ success: true, data: workflows });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(500).send({ success: false, message: err.message ?? "Internal Server Error" });
  }
}

export async function getWorkflowController(request: any, reply: any) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId, workflowId } = request.params;
    if (!orgId || !workflowId) {
      return reply.status(400).send({ success: false, message: "Organization ID and Workflow ID required" });
    }

    const membership = await request.server.db.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId } },
    });

    if (!membership) {
      return reply.status(403).send({ success: false, message: "Not a member of this organization" });
    }

    const workflow = await workflowService.getWorkflow(workflowId);

    if (!workflow || workflow.id !== workflowId) {
      return reply.status(404).send({ success: false, message: "Workflow not found" });
    }

    return reply.status(200).send({ success: true, data: workflow });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(500).send({ success: false, message: err.message ?? "Internal Server Error" });
  }
}

export async function deleteWorkflowController(request: any, reply: any) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { orgId, workflowId } = request.params;
    if (!orgId || !workflowId) {
      return reply.status(400).send({ success: false, message: "Organization ID and Workflow ID required" });
    }

    const membership = await request.server.db.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId: orgId, userId } },
    });

    if (!membership) {
      return reply.status(403).send({ success: false, message: "Not a member of this organization" });
    }

    if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
      return reply.status(403).send({ success: false, message: "Only owners and admins can delete workflows" });
    }

    const workflow = await workflowService.getWorkflow(workflowId);
    if (!workflow) {
      return reply.status(404).send({ success: false, message: "Workflow not found" });
    }

    await workflowService.deleteWorkflow(workflowId);

    return reply.status(200).send({ success: true, message: "Workflow deleted" });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(500).send({ success: false, message: err.message ?? "Internal Server Error" });
  }
}

export async function listWorkspaceWorkflowsController(request: any, reply: any) {
  try {
    const userId = request.user?.userId;
    if (!userId) {
      return reply.status(401).send({ success: false, message: "Unauthorized" });
    }

    const { workspaceId } = request.params;
    if (!workspaceId) {
      return reply.status(400).send({ success: false, message: "Workspace ID required" });
    }

    const workflows = await workflowService.getWorkspaceWorkflows(workspaceId);

    return reply.status(200).send({ success: true, data: workflows });
  } catch (err: any) {
    request.log.error(err);
    return reply.status(500).send({ success: false, message: err.message ?? "Internal Server Error" });
  }
}
