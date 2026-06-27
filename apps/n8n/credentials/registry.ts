import type { CredentialResolver } from './types';
import { githubResolver } from './github.resolver';
import { googleResolver } from './google.resolver';
import { slackResolver } from './slack.resolver';
import { notionResolver } from './notion.resolver';
import { linearResolver } from './linear.resolver';

const RESOLVERS: CredentialResolver[] = [
  githubResolver,
  googleResolver,
  slackResolver,
  notionResolver,
  linearResolver,
];

/**
 * Map of service name → resolver for quick lookup.
 * Built once at startup.
 */
const SERVICE_MAP = new Map<string, CredentialResolver>();

for (const resolver of RESOLVERS) {
  SERVICE_MAP.set(resolver.provider, resolver);
}

/**
 * Get the credential resolver for a given service name.
 *
 * @param service - The service name from an Orion step (e.g., "github", "slack", "gmail")
 * @returns The matching resolver, or undefined if no resolver handles this service
 */
export function getCredentialResolver(service: string): CredentialResolver | undefined {
  return SERVICE_MAP.get(service);
}

/**
 * Extract all unique services from workflow steps that require credentials.
 *
 * @param services - Array of service names from workflow steps
 * @returns Array of unique services that have credential resolvers
 */
export function getRequiredIntegrations(services: string[]): string[] {
  const unique = [...new Set(services)];
  return unique.filter(s => SERVICE_MAP.has(s));
}

/**
 * Check if a service requires external credentials.
 */
export function serviceRequiresCredentials(service: string): boolean {
  return SERVICE_MAP.has(service);
}

/**
 * Get all registered resolvers (for debugging/introspection).
 */
export function getAllResolvers(): CredentialResolver[] {
  return [...RESOLVERS];
}
