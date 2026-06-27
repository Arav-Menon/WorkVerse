import { db } from "@repo/db/db";

interface CreateWorkflowInput {
  organizationId: string;
  workspaceId: string;
  createdById: string;
  name: string;
  prompt: string;
  promptId: string;
  workflowPlan?: unknown;
  executionType?: string;
  description?: string;
}

interface DeployWorkflowInput {
  n8nWorkflowId: string;
  n8nWorkflowUrl: string;
  mappedWorkflow?: unknown;
  integrations?: string[];
  steps?: { id: string; service: string; action: string }[];
}

class WorkflowService {
  async createWorkflow(input: CreateWorkflowInput) {
    const workflow = await db.workflow.create({
      data: {
        organizationId: input.organizationId,
        workspaceId: input.workspaceId,
        createdById: input.createdById,
        name: input.name,
        prompt: input.prompt,
        promptId: input.promptId,
        workflowPlan: input.workflowPlan ?? undefined,
        executionType: input.executionType ?? "N8N",
        description: input.description,
        status: "DRAFT",
        deploymentStatus: "PENDING",
      },
      select: {
        id: true,
        name: true,
        status: true,
        deploymentStatus: true,
        createdAt: true,
      },
    });

    return workflow;
  }

  async updateToGenerating(workflowId: string, mappedWorkflow: unknown) {
    return db.workflow.update({
      where: { id: workflowId },
      data: {
        status: "GENERATED",
        deploymentStatus: "DEPLOYING",
        mappedWorkflow: mappedWorkflow as any,
      },
      select: { id: true, status: true, deploymentStatus: true },
    });
  }

  async updateToDeployed(workflowId: string, input: DeployWorkflowInput) {
    return db.workflow.update({
      where: { id: workflowId },
      data: {
        status: "ACTIVE",
        deploymentStatus: "DEPLOYED",
        n8nWorkflowId: input.n8nWorkflowId,
        n8nWorkflowUrl: input.n8nWorkflowUrl,
        mappedWorkflow: input.mappedWorkflow ?? undefined,
        integrations: input.integrations ?? [],
        steps: input.steps ?? undefined,
      },
      select: {
        id: true,
        name: true,
        status: true,
        deploymentStatus: true,
        n8nWorkflowId: true,
        n8nWorkflowUrl: true,
        integrations: true,
      },
    });
  }

  async updateToFailed(workflowId: string, error: string) {
    return db.workflow.update({
      where: { id: workflowId },
      data: {
        status: "FAILED",
        deploymentStatus: "FAILED",
      },
      select: { id: true, status: true, deploymentStatus: true },
    });
  }

  async getWorkflow(workflowId: string) {
    return db.workflow.findUnique({
      where: { id: workflowId },
      select: {
        id: true,
        name: true,
        description: true,
        prompt: true,
        workflowPlan: true,
        mappedWorkflow: true,
        executionType: true,
        status: true,
        deploymentStatus: true,
        integrations: true,
        steps: true,
        n8nWorkflowId: true,
        n8nWorkflowUrl: true,
        promptId: true,
        version: true,
        lastExecutedAt: true,
        createdAt: true,
        updatedAt: true,
        createdBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }

  async getOrganizationWorkflows(organizationId: string) {
    return db.workflow.findMany({
      where: { organizationId, status: { not: "DELETED" } },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        deploymentStatus: true,
        executionType: true,
        integrations: true,
        n8nWorkflowId: true,
        n8nWorkflowUrl: true,
        lastExecutedAt: true,
        createdAt: true,
        createdBy: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getWorkspaceWorkflows(workspaceId: string) {
    return db.workflow.findMany({
      where: { workspaceId, status: { not: "DELETED" } },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        deploymentStatus: true,
        executionType: true,
        integrations: true,
        n8nWorkflowId: true,
        n8nWorkflowUrl: true,
        lastExecutedAt: true,
        createdAt: true,
        createdBy: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async deleteWorkflow(workflowId: string) {
    return db.workflow.update({
      where: { id: workflowId },
      data: { status: "DELETED" },
      select: { id: true, status: true },
    });
  }

  async getWorkflowByPromptId(promptId: string) {
    return db.workflow.findUnique({
      where: { promptId },
      select: { id: true, name: true, status: true, deploymentStatus: true },
    });
  }
}

export const workflowService = new WorkflowService();
