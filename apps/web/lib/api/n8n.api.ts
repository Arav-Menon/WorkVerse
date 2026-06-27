import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface N8nConnectionStatus {
  connected: boolean;
  baseUrl?: string;
  maskedApiKey?: string;
  status?: string;
  lastValidatedAt?: string | null;
  connectedBy?: { id: string; name: string; email: string };
  connectedAt?: string;
}

export interface N8nTestResult {
  success: boolean;
  message: string;
  lastValidatedAt?: string;
}

export async function connectN8n(orgId: string, baseUrl: string, apiKey: string): Promise<N8nConnectionStatus> {
  const res = await apiClient.post(API_ENDPOINTS.N8N.CONNECT(orgId), { baseUrl, apiKey });
  return res.data.data;
}

export async function getN8nStatus(orgId: string): Promise<N8nConnectionStatus> {
  const res = await apiClient.get(API_ENDPOINTS.N8N.STATUS(orgId));
  return res.data.data;
}

export async function testN8nConnection(orgId: string): Promise<N8nTestResult> {
  const res = await apiClient.post(API_ENDPOINTS.N8N.TEST(orgId));
  return res.data.data;
}

export async function disconnectN8n(orgId: string) {
  const res = await apiClient.delete(API_ENDPOINTS.N8N.DISCONNECT(orgId));
  return res.data;
}
