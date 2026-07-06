/**
 * WorkVerse Service Registry
 *
 * Centralized configuration for all backend service endpoints.
 * Uses NEXT_PUBLIC_* variables so values are embedded at Next.js build time.
 *
 * Local development: see apps/web/.env (loaded automatically by Next.js)
 * Production: see apps/web/.env.production (loaded automatically by Next.js)
 *
 * Vercel: set these in Project Settings > Environment Variables.
 *         .env.production provides correct defaults for Vercel builds.
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

if (process.env.NODE_ENV === "production") {
  const mismatches: string[] = [];
  if (services.cortex.includes("localhost"))  mismatches.push("NEXT_PUBLIC_CORTEX_URL");
  if (services.flux.includes("localhost"))    mismatches.push("NEXT_PUBLIC_FLUX_URL");
  if (services.relay.includes("localhost"))   mismatches.push("NEXT_PUBLIC_RELAY_URL");
  if (services.space.includes("localhost"))   mismatches.push("NEXT_PUBLIC_SPACE_URL");
  if (services.synapse.includes("localhost")) mismatches.push("NEXT_PUBLIC_SYNAPSE_URL");

  if (mismatches.length > 0) {
    throw new Error(
      `[WorkVerse] Production env vars missing or falling back to localhost.\n` +
      `Expected NEXT_PUBLIC_* variables: ${mismatches.join(", ")}\n` +
      `Set them in Vercel Dashboard > Project Settings > Environment Variables.`
    );
  }
}
