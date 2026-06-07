import type { client } from "@repo/redis";

export interface AuthRateLimitOptions {
  redis?: typeof client;
  global?: boolean;
  hook?: string;
  max?: number;
  timeWindow?: number;
}

export interface RegisterOrgRateLimitOptions {
  redis?: typeof client;
  max?: number;
  hook?: string;
  global?: boolean;
  timeWindow?: number;
}

export interface WorkspceOrgRateLimitOptions {
  redis?: typeof client;
  max?: number;
  hook?: string;
  global?: boolean;
  timeWindow?: number;
}

export interface InviteOrgRateLimitOptions {
  redis?: typeof client;
  max?: number;
  global?: boolean;
  hook?: string;
  timeWindow?: number;
}
