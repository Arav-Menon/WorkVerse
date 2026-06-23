import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchOrgWorkspaces,
  fetchWorkspaceById,
  type OrgWorkspace,
} from "@/lib/api/org.api";
import { createWorkspace, type CreateWorkspaceRequest } from "@/lib/api/workspace.api";

export function useOrganizationWorkspaces(orgId: string) {
  return useQuery<OrgWorkspace[]>({
    queryKey: ["workspaces", "org", orgId],
    queryFn: () => fetchOrgWorkspaces(orgId),
    enabled: !!orgId,
    staleTime: 60 * 1000,
  });
}

export function useWorkspace(orgId: string, workspaceId: string) {
  return useQuery<OrgWorkspace>({
    queryKey: ["workspace", orgId, workspaceId],
    queryFn: () => fetchWorkspaceById(orgId, workspaceId),
    enabled: !!orgId && !!workspaceId,
    staleTime: 60 * 1000,
  });
}

export function useCreateWorkspace(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkspaceRequest) => createWorkspace(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces", "org", orgId] });
    },
  });
}
