import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface IntegrationStatus {
  connected: boolean;
  username?: string;
  avatar?: string;
  profileUrl?: string;
  connectedAt?: string;
  scopes?: string;
  error?: string;
}

export async function fetchIntegrationStatus(orgId: string): Promise<Record<string, IntegrationStatus>> {
  const res = await apiClient.get(API_ENDPOINTS.INTEGRATION.STATUS(orgId));
  return res.data.data;
}

export async function disconnectIntegration(orgId: string, provider: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.INTEGRATION.DISCONNECT(orgId, provider));
}

export function getConnectUrl(orgId: string, provider: string, userId: string): string {
  const state = `${userId}:${orgId}`;
  return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}${API_ENDPOINTS.INTEGRATION.CONNECT(provider)}?state=${encodeURIComponent(state)}`;
}
