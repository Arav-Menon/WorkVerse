export interface OrganizationConnectionInfo {
  id: string;
  organizationId: string;
  provider: string;
  accessToken: string;
  refreshToken?: string | null;
  scopes?: string | null;
  metadata?: Record<string, any> | null;
  status: string;
}

export interface N8nCredentialData {
  /** n8n credential type (e.g., "githubApi", "slackApi", "gmailOAuth2") */
  type: string;
  /** Human-readable credential name */
  name: string;
  /** The data payload for the n8n credential */
  data: Record<string, any>;
}

export interface CredentialResolver {
  /** WorkVerse provider name (lowercase, e.g., "github", "google", "slack") */
  provider: string;

  /** n8n credential type(s) this provider maps to */
  n8nTypes: string[];

  /**
   * Build the n8n credential data object from an OrganizationConnection.
   * @param connection - The connection info with DECRYPTED tokens
   * @param service - The specific service (e.g., "gmail", "calendar" for Google)
   */
  buildCredentialData(connection: OrganizationConnectionInfo, service?: string): N8nCredentialData;

  /**
   * Returns true if this resolver handles the given service name.
   * Used by the registry to match workflow steps to resolvers.
   */
  matchesService(service: string): boolean;
}
