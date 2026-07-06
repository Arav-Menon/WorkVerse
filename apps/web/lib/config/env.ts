/**
 * WorkVerse Service Registry
 *
 * Centralized configuration for all backend service endpoints.
 * Uses NEXT_PUBLIC_* variables so values are embedded at Next.js build time.
 *
 * Local development: defaults to localhost (see apps/web/.env)
 * Production: inject NEXT_PUBLIC_* env vars via Docker / Kubernetes
 *
 * To add a new service:
 *   1. Add entry here with NEXT_PUBLIC_* variable and localhost fallback
 *   2. Add the variable to apps/web/.env and .env.production
 *   3. Add the variable to docker-compose.yml / docker-compose.prod.yml web service
 */
export const services = {
  cortex:  process.env.NEXT_PUBLIC_CORTEX_URL  || "http://localhost:3000",
  flux:    process.env.NEXT_PUBLIC_FLUX_URL    || "ws://localhost:8080",
  relay:   process.env.NEXT_PUBLIC_RELAY_URL   || "ws://localhost:8089",
  space:   process.env.NEXT_PUBLIC_SPACE_URL   || "ws://localhost:8002",
  synapse: process.env.NEXT_PUBLIC_SYNAPSE_URL || "ws://localhost:8001",
} as const;

/** @deprecated Use `services.cortex` instead */
export const env = {
  API_URL:       services.cortex,
  WS_URL:        services.flux,
  RELAY_URL:     services.relay,
  SPACE_WS_URL:  services.space,
  SYNAPSE_WS_URL: services.synapse,
};
