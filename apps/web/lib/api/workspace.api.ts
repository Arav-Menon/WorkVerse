import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface CreateWorkspaceRequest {
  name: string;
  slug: string;
  description?: string;
}

export interface CreateWorkspaceResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdById: string;
  organizationId: string;
}

export async function createWorkspace(orgId: string, data: CreateWorkspaceRequest): Promise<CreateWorkspaceResponse> {
  const res = await apiClient.post(API_ENDPOINTS.WORKSPACE.CREATE(orgId), data);
  return res.data.data ?? res.data;
}

export interface WorkspaceResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  organizationId: string;
  createdAt: string;
  spaceCount: number;
}

export async function fetchWorkspace(workspaceId: string): Promise<WorkspaceResponse> {
  const res = await apiClient.get(API_ENDPOINTS.WORKSPACE.GET(workspaceId));
  return res.data.data ?? res.data;
}
