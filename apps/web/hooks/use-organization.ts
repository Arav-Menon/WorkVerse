import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchOrganizationById,
  fetchAllOrganizations,
  inviteOrganization,
  type FetchOrganization,
  type InviteOrganizationRequest,
} from "@/lib/api/org.api";

export function useOrganizations() {
  return useQuery<FetchOrganization[]>({
    queryKey: ["organizations"],
    queryFn: fetchAllOrganizations,
    staleTime: 60 * 1000,
  });
}

export function useOrganization(orgId: string) {
  return useQuery<FetchOrganization>({
    queryKey: ["organization", orgId],
    queryFn: () => fetchOrganizationById(orgId),
    enabled: !!orgId,
    staleTime: 60 * 1000,
  });
}

export function useInviteMember(orgId: string) {
  return useMutation({
    mutationFn: (data: InviteOrganizationRequest) => inviteOrganization(orgId, data),
  });
}
