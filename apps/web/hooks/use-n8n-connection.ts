import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getN8nStatus,
  connectN8n,
  testN8nConnection,
  disconnectN8n,
  type N8nConnectionStatus,
} from "@/lib/api/n8n.api";

export function useN8nStatus(orgId: string) {
  return useQuery<N8nConnectionStatus>({
    queryKey: ["n8n-connection", orgId],
    queryFn: () => getN8nStatus(orgId),
    enabled: !!orgId,
    staleTime: 30 * 1000,
  });
}

export function useConnectN8n(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ baseUrl, apiKey }: { baseUrl: string; apiKey: string }) =>
      connectN8n(orgId, baseUrl, apiKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["n8n-connection", orgId] });
      queryClient.invalidateQueries({ queryKey: ["integrations", orgId] });
    },
  });
}

export function useTestN8nConnection(orgId: string) {
  return useMutation({
    mutationFn: () => testN8nConnection(orgId),
  });
}

export function useDisconnectN8n(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => disconnectN8n(orgId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["n8n-connection", orgId] });
      queryClient.invalidateQueries({ queryKey: ["integrations", orgId] });
    },
  });
}
