import type { client } from "@repo/redis";

export interface AuthRateLimitOptions {
  redis?: typeof client;
  max?: number;
  timeWindow?: number;
}

export interface RegisterOrgRateLimitOptions {
  redis?: typeof client;
  max?: number;
  timeWindow?: number;
}
