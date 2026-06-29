import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchIntegrationStatus,
  disconnectIntegration,
  type IntegrationStatus,
} from "@/lib/api/integration.api";

export function useIntegrationStatus(orgId: string) {
  return useQuery<Record<string, IntegrationStatus>>({
    queryKey: ["integrations", orgId],
    queryFn: () => fetchIntegrationStatus(orgId),
    enabled: !!orgId,
    staleTime: 30 * 1000,
  });
}

export function useDisconnectIntegration(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (provider: string) => disconnectIntegration(orgId, provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations", orgId] });
    },
  });
}
