import { apiClient } from "./client";
import { API_ENDPOINTS } from "./endpoints";

export interface Workflow {
  id: string;
  name: string;
  description: string | null;
  status: string;
  deploymentStatus: string;
  executionType: string;
  integrations: string[];
  n8nWorkflowId: string | null;
  n8nWorkflowUrl: string | null;
  lastExecutedAt: string | null;
  createdAt: string;
  createdBy: {
    id: string;
    name: string;
  };
}

export interface WorkflowDetail extends Workflow {
  prompt: string;
  workflowPlan: unknown;
  mappedWorkflow: unknown;
  steps: { id: string; service: string; action: string }[];
  promptId: string;
  version: number;
  updatedAt: string;
}

export const workflowApi = {
  listByOrg: async (orgId: string): Promise<Workflow[]> => {
    const response = await apiClient.get(API_ENDPOINTS.WORKFLOW.LIST_ORG(orgId));
    return response.data.data;
  },

  get: async (orgId: string, workflowId: string): Promise<WorkflowDetail> => {
    const response = await apiClient.get(API_ENDPOINTS.WORKFLOW.GET(orgId, workflowId));
    return response.data.data;
  },

  delete: async (orgId: string, workflowId: string): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.WORKFLOW.DELETE(orgId, workflowId));
  },

  listByWorkspace: async (workspaceId: string): Promise<Workflow[]> => {
    const response = await apiClient.get(API_ENDPOINTS.WORKFLOW.LIST_WORKSPACE(workspaceId));
    return response.data.data;
  },
};
