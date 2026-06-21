import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";

export interface CreateOrganizationRequest {
  name: string;
  slug: string;
  description?: string;
}

export interface OrganizationResponse {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdById: string;
}

export interface FetchOrganization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  workspaceCount: number;
}

export async function registerOrganization(data: CreateOrganizationRequest): Promise<OrganizationResponse> {
  const res = await apiClient.post(API_ENDPOINTS.ORGANIZATION.REGISTER, data);
  return res.data.data ?? res.data;
}

export async function fetchAllOrganizations(): Promise<FetchOrganization[]> {
  const res = await apiClient.get(API_ENDPOINTS.ORGANIZATION.GET_ALL);
  return res.data.data;
}

export async function fetchOrganizationById(orgId: string): Promise<FetchOrganization> {
  const res = await apiClient.get(API_ENDPOINTS.ORGANIZATION.GET_BY_ID(orgId));
  return res.data.data ?? res.data;
}

export async function fetchOrganizationBySlug(slug: string): Promise<FetchOrganization> {
  const res = await apiClient.get(API_ENDPOINTS.ORGANIZATION.GET_BY_SLUG(slug));
  return res.data.data ?? res.data;
}

export interface InviteOrganizationRequest {
  name: string;
  email: string;
}

export interface InviteOrganizationResponse {
  message: string;
}

export async function inviteOrganization(orgId: string, data: InviteOrganizationRequest): Promise<InviteOrganizationResponse> {
  const res = await apiClient.post(API_ENDPOINTS.ORGANIZATION.INVITE(orgId), data);
  return res.data;
}
