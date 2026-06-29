import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workflowApi, type Workflow, type WorkflowDetail } from "@/lib/api/workflow.api";

export function useOrganizationWorkflows(orgId: string) {
  return useQuery<Workflow[]>({
    queryKey: ["workflows", "org", orgId],
    queryFn: () => workflowApi.listByOrg(orgId),
    enabled: !!orgId,
    staleTime: 30 * 1000,
  });
}

export function useWorkflow(orgId: string, workflowId: string) {
  return useQuery<WorkflowDetail>({
    queryKey: ["workflows", "org", orgId, workflowId],
    queryFn: () => workflowApi.get(orgId, workflowId),
    enabled: !!orgId && !!workflowId,
  });
}

export function useWorkspaceWorkflows(workspaceId: string) {
  return useQuery<Workflow[]>({
    queryKey: ["workflows", "workspace", workspaceId],
    queryFn: () => workflowApi.listByWorkspace(workspaceId),
    enabled: !!workspaceId,
    staleTime: 30 * 1000,
  });
}

export function useDeleteWorkflow(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workflowId: string) => workflowApi.delete(orgId, workflowId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workflows", "org", orgId] });
    },
  });
}
