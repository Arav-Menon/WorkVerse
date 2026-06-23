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
  memberCount: number;
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

export interface Membership {
  organizationId: string;
  role: string;
  joinedAt: string;
}

export async function fetchMyMembership(orgId: string): Promise<Membership> {
  const res = await apiClient.get(API_ENDPOINTS.ORGANIZATION.MEMBERSHIP(orgId));
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

export interface OrgWorkspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  organizationId: string;
  createdAt: string;
  spaceCount: number;
}

export async function fetchOrgWorkspaces(orgId: string): Promise<OrgWorkspace[]> {
  const res = await apiClient.get(API_ENDPOINTS.WORKSPACE.GET_ALL(orgId));
  return res.data.data ?? res.data;
}

export async function fetchWorkspaceById(orgId: string, workspaceId: string): Promise<OrgWorkspace> {
  const res = await apiClient.get(API_ENDPOINTS.WORKSPACE.GET_BY_ID(orgId, workspaceId));
  return res.data.data ?? res.data;
}
