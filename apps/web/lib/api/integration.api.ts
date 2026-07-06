import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { services } from "@/lib/config/env";

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

export async function disconnectIntegration(orgId: string, provider: string) {
  const res = await apiClient.delete(API_ENDPOINTS.INTEGRATION.DISCONNECT(orgId, provider));
  return res.data;
}

export function getConnectUrl(orgId: string, provider: string, userId: string): string {
  const state = `${userId}:${orgId}`;
  return `${services.cortex}${API_ENDPOINTS.INTEGRATION.CONNECT(provider)}?state=${encodeURIComponent(state)}`;
}
