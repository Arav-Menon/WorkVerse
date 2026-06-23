import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface InviteDetails {
  id: string;
  organizationName: string;
  organizationSlug: string;
  description: string | null;
  workspaceCount: number;
  memberCount: number;
  invitedByName: string;
  role: string;
  email: string;
  expiresAt: string;
}

export async function validateInvite(token: string): Promise<InviteDetails> {
  const res = await apiClient.get(
    API_ENDPOINTS.ORGANIZATION.INVITE_VALIDATE(token),
    { timeout: 10000 }
  );
  return res.data.data;
}

export async function acceptInvite(
  token: string
): Promise<{ message: string; organizationId: string }> {
  const res = await apiClient.post(
    API_ENDPOINTS.ORGANIZATION.INVITE_ACCEPT,
    { token }
  );
  return res.data.data ?? res.data;
}
