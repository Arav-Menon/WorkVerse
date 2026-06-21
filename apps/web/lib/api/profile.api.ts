import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface ConnectedAccount {
  provider: string;
  connectedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  counts: {
    organizations: number;
    workspaces: number;
    spaces: number;
  };
  connectedAccounts: ConnectedAccount[];
}

export async function fetchProfile(): Promise<UserProfile> {
  const res = await apiClient.get(API_ENDPOINTS.PROFILE.ME);
  return res.data.data;
}
