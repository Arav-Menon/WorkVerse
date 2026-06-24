import { useOrganizationMembership } from "@/hooks/use-organization";

export function usePermission(orgId: string) {
  const { data: membership, isLoading } = useOrganizationMembership(orgId);
  const role = membership?.role;

  return {
    role,
    isLoading,
    isAdmin: role === "ADMIN" || role === "OWNER",
    isOwner: role === "OWNER",
    isMember: role === "MEMBER",
    canInviteMembers: role === "ADMIN" || role === "OWNER",
    canCreateWorkspace: role === "ADMIN" || role === "OWNER",
    canRemoveMember: role === "ADMIN" || role === "OWNER",
    canManageIntegrations: role === "ADMIN" || role === "OWNER",
  };
}
