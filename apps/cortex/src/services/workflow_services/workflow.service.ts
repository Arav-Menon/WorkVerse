import { db } from "@repo/db/db";
import { client } from "@repo/redis/redis-client";

const WORKFLOW_HISTORY_TTL = 300; // 5 minutes

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

async function invalidateWorkspaceCache(workspaceId: string) {
  try {
    await client.del(`workflow:history:${workspaceId}`);
  } catch {
    // Cache invalidation failure is non-critical
  }
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

    await invalidateWorkspaceCache(input.workspaceId);
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
    const result = await db.workflow.update({
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
        workspaceId: true,
      },
    });

    await invalidateWorkspaceCache(result.workspaceId);
    return result;
  }

  async updateToFailed(workflowId: string, error: string) {
    const result = await db.workflow.update({
      where: { id: workflowId },
      data: {
        status: "FAILED",
        deploymentStatus: "FAILED",
      },
      select: { id: true, status: true, deploymentStatus: true, workspaceId: true },
    });

    await invalidateWorkspaceCache(result.workspaceId);
    return result;
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

  async getWorkspaceWorkflowHistory(workspaceId: string) {
    const cacheKey = `workflow:history:${workspaceId}`;

    try {
      const cached = await client.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
      // Cache read failure is non-critical, fall through to DB
    }

    const workflows = await db.workflow.findMany({
      where: { workspaceId, status: { not: "DELETED" } },
      select: {
        id: true,
        name: true,
        status: true,
        deploymentStatus: true,
        integrations: true,
        steps: true,
        n8nWorkflowId: true,
        n8nWorkflowUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const history = workflows.map((w) => ({
      workflowDbId: w.id,
      workflowId: w.n8nWorkflowId ?? "",
      workflowName: w.name,
      workflowUrl: w.n8nWorkflowUrl ?? "",
      integrations: w.integrations,
      steps: (w.steps as { id: string; service: string; action: string }[]) ?? [],
      status: w.deploymentStatus === "DEPLOYED" ? "completed" : "failed",
      message:
        w.deploymentStatus === "DEPLOYED"
          ? "Workflow deployed successfully"
          : w.deploymentStatus === "FAILED"
            ? "Workflow deployment failed"
            : `Workflow status: ${w.deploymentStatus}`,
      timestamp: w.createdAt.toISOString(),
    }));

    try {
      await client.set(cacheKey, JSON.stringify(history), "EX", WORKFLOW_HISTORY_TTL);
    } catch {
      // Cache write failure is non-critical
    }

    return history;
  }

  async deleteWorkflow(workflowId: string) {
    const result = await db.workflow.update({
      where: { id: workflowId },
      data: { status: "DELETED" },
      select: { id: true, status: true, workspaceId: true },
    });

    await invalidateWorkspaceCache(result.workspaceId);
    return result;
  }

  async getWorkflowByPromptId(promptId: string) {
    return db.workflow.findUnique({
      where: { promptId },
      select: { id: true, name: true, status: true, deploymentStatus: true },
    });
  }
}

export const workflowService = new WorkflowService();
