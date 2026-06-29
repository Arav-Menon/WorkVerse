import { db } from "@repo/db/db";
import { ensureCredential } from "./credential.service";
import { getCredentialResolver } from "../credentials/registry";
import type { N8nWorkflow, N8nNode, CredentialRequirement } from "../transformer/types";
import type { OrganizationConnectionInfo } from "../credentials/types";
import crypto from "crypto";

// ─── Encryption (same as workflow-job.ts) ───────────────────────────────────

const ALGORITHM = "aes-256-gcm";
const AUTH_TAG_LENGTH = 16;
const SEPARATOR = ":";

function getEncryptionKey(): Buffer {
  const keyHex = process.env.N8N_ENCRYPTION_KEY;
  if (!keyHex) {
    throw new Error("N8N_ENCRYPTION_KEY environment variable is required");
  }
  return Buffer.from(keyHex, "hex");
}

function decrypt(composite: string): string {
  const key = getEncryptionKey();
  const parts = composite.split(SEPARATOR);
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted format");
  }

  const iv = Buffer.from(parts[0]!, "base64");
  const authTag = Buffer.from(parts[1]!, "base64");
  const encrypted = Buffer.from(parts[2]!, "base64");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}

// ─── Placeholder ID patterns ────────────────────────────────────────────────

const PLACEHOLDER_IDS = new Set([
  "SLACK_CRED",
  "GITHUB_CRED",
  "GMAIL_CRED",
  "NOTION_CRED",
  "LINEAR_CRED",
  "GCAL_CRED",
  "AI_BEARER_CRED",
]);

// ─── Types ──────────────────────────────────────────────────────────────────

interface CredentialMapping {
  placeholderId: string;
  realId: string;
  realName: string;
  service: string;
}

interface InjectionResult {
  /** The workflow with real credential IDs injected */
  workflow: N8nWorkflow;
  /** Map of services that were resolved */
  resolvedServices: string[];
  /** Services that were missing connections */
  missingServices: string[];
}

// ─── Core Logic ─────────────────────────────────────────────────────────────

/**
 * Scan workflow nodes for placeholder credential IDs and collect the
 * services that need credentials.
 */
function collectCredentialRequirements(workflow: N8nWorkflow): CredentialRequirement[] {
  const requirements: CredentialRequirement[] = [];
  const seen = new Set<string>();

  for (const node of workflow.nodes) {
    if (!node.credentials) continue;

    for (const [credType, credRef] of Object.entries(node.credentials)) {
      if (!PLACEHOLDER_IDS.has(credRef.id)) continue;

      // Map n8n credential type back to WorkVerse service
      const service = resolveServiceFromCredentialType(credType);
      if (service && !seen.has(`${service}:${credType}`)) {
        seen.add(`${service}:${credType}`);
        requirements.push({
          service,
          n8nCredentialType: credType,
          stepId: node.id,
        });
      }
    }
  }

  return requirements;
}

/**
 * Map an n8n credential type to a WorkVerse service name.
 */
function resolveServiceFromCredentialType(credType: string): string | null {
  const TYPE_TO_SERVICE: Record<string, string> = {
    githubApi: "github",
    githubOAuth2Api: "github",
    slackApi: "slack",
    slackOAuth2Api: "slack",
    gmailOAuth2: "google",
    googleCalendarOAuth2Api: "google",
    googleDriveOAuth2Api: "google",
    notionApi: "notion",
    notionOAuth2Api: "notion",
    linearApi: "linear",
    linearOAuth2Api: "linear",
  };

  return TYPE_TO_SERVICE[credType] ?? null;
}

/**
 * Fetch the OrganizationConnection for a given service, decrypt the token,
 * and return the connection info needed by the resolver.
 */
async function fetchDecryptedConnection(
  organizationId: string,
  service: string
): Promise<OrganizationConnectionInfo | null> {
  const providerKey = service.toUpperCase() as "GITHUB" | "GOOGLE" | "SLACK";
  
  const connection = await db.organizationConnection.findUnique({
    where: {
      organizationId_provider: {
        organizationId,
        provider: providerKey,
      },
    },
    select: {
      id: true,
      organizationId: true,
      provider: true,
      accessToken: true,
      refreshToken: true,
      encryptedAccessToken: true,
      encryptedRefreshToken: true,
      scopes: true,
      metadata: true,
      status: true,
    },
  });

  if (!connection || connection.status !== "ACTIVE") {
    return null;
  }

  // Use encrypted column if populated, fall back to plaintext for existing records
  const accessToken = connection.encryptedAccessToken
    ? decrypt(connection.encryptedAccessToken)
    : connection.accessToken;

  const refreshToken = connection.encryptedRefreshToken
    ? decrypt(connection.encryptedRefreshToken)
    : connection.refreshToken;

  return {
    id: connection.id,
    organizationId: connection.organizationId,
    provider: connection.provider.toLowerCase(),
    accessToken,
    refreshToken,
    scopes: connection.scopes,
    metadata: connection.metadata as Record<string, any> | null,
    status: connection.status,
  };
}

/**
 * Build a unique credential name for n8n, namespaced by org ID.
 * Format: `{orgId}:{provider}` or `{orgId}:{provider}:{service}` for Google sub-services.
 */
function buildCredentialName(organizationId: string, service: string, n8nType: string): string {
  // For Google services, include the specific service in the name
  if (service === "google") {
    const subService = n8nType.includes("gmail")
      ? "gmail"
      : n8nType.includes("Calendar")
        ? "calendar"
        : n8nType.includes("Drive")
          ? "drive"
          : "google";
    return `${organizationId}:${subService}`;
  }
  return `${organizationId}:${service}`;
}

// ─── Main Export ─────────────────────────────────────────────────────────────

/**
 * Resolve and inject real credential IDs into a workflow before deployment.
 *
 * This function:
 * 1. Scans workflow nodes for placeholder credential IDs
 * 2. Fetches the corresponding OrganizationConnection (decrypted)
 * 3. Creates/updates credentials in n8n via ensureCredential()
 * 4. Replaces placeholder IDs with real IDs
 *
 * @throws If required integrations are missing
 */
export async function injectCredentials(
  workflow: N8nWorkflow,
  organizationId: string
): Promise<InjectionResult> {
  const requirements = collectCredentialRequirements(workflow);

  if (requirements.length === 0) {
    return {
      workflow,
      resolvedServices: [],
      missingServices: [],
    };
  }

  const resolvedServices: string[] = [];
  const missingServices: string[] = [];
  const credentialMappings: CredentialMapping[] = [];

  // Group requirements by service to avoid duplicate lookups
  const serviceGroups = new Map<string, CredentialRequirement[]>();
  for (const req of requirements) {
    const existing = serviceGroups.get(req.service) || [];
    existing.push(req);
    serviceGroups.set(req.service, existing);
  }

  for (const [service, reqs] of serviceGroups) {
    // Fetch decrypted connection
    const connection = await fetchDecryptedConnection(organizationId, service);

    if (!connection) {
      missingServices.push(service);
      console.warn(
        `[CredentialInjection] Missing or inactive connection for "${service}" in org ${organizationId}`
      );
      continue;
    }

    // Get resolver
    const resolver = getCredentialResolver(service);
    if (!resolver) {
      console.warn(`[CredentialInjection] No resolver for service "${service}"`);
      continue;
    }

    // Create/update credentials for each unique n8n type needed
    const seenTypes = new Set<string>();
    for (const req of reqs) {
      if (seenTypes.has(req.n8nCredentialType)) continue;
      seenTypes.add(req.n8nCredentialType);

      const credData = resolver.buildCredentialData(connection, service);
      const credName = buildCredentialName(organizationId, service, req.n8nCredentialType);

      try {
        const result = await ensureCredential(
          organizationId,
          credName,
          credData.type,
          credData.data
        );

        credentialMappings.push({
          placeholderId: findPlaceholderForType(workflow, req.n8nCredentialType),
          realId: result.id,
          realName: result.name,
          service,
        });

        resolvedServices.push(service);
        console.log(
          `[CredentialInjection] Resolved ${service} → n8n credential "${credName}" (${result.id})`
        );
      } catch (error: any) {
        console.error(
          `[CredentialInjection] Failed to ensure credential for ${service}: ${error.message}`
        );
        missingServices.push(service);
      }
    }
  }

  // Apply mappings to workflow nodes
  if (credentialMappings.length > 0) {
    applyCredentialMappings(workflow, credentialMappings);
  }

  return {
    workflow,
    resolvedServices: [...new Set(resolvedServices)],
    missingServices: [...new Set(missingServices)],
  };
}

/**
 * Find the placeholder ID in the workflow for a given credential type.
 */
function findPlaceholderForType(workflow: N8nWorkflow, credType: string): string {
  for (const node of workflow.nodes) {
    if (!node.credentials) continue;
    const credRef = node.credentials[credType];
    if (credRef && PLACEHOLDER_IDS.has(credRef.id)) {
      return credRef.id;
    }
  }
  return "";
}

/**
 * Replace placeholder credential IDs with real IDs in the workflow.
 */
function applyCredentialMappings(
  workflow: N8nWorkflow,
  mappings: CredentialMapping[]
): void {
  // Build lookup: placeholderId → { realId, realName }
  const replacementMap = new Map<string, { id: string; name: string }>();
  for (const m of mappings) {
    if (m.placeholderId) {
      replacementMap.set(m.placeholderId, { id: m.realId, name: m.realName });
    }
  }

  // Replace in all nodes
  for (const node of workflow.nodes) {
    if (!node.credentials) continue;

    for (const [credType, credRef] of Object.entries(node.credentials)) {
      const replacement = replacementMap.get(credRef.id);
      if (replacement) {
        node.credentials[credType] = {
          id: replacement.id,
          name: replacement.name,
        };
      }
    }
  }
}
