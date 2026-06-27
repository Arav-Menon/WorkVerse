import axios from "axios";
import { db } from "@repo/db/db";
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const AUTH_TAG_LENGTH = 16;
const SEPARATOR = ":";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface N8nCredentialResponse {
  id: string;
  name: string;
  type: string;
  isManaged: boolean;
  isGlobal: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCredentialInput {
  name: string;
  type: string;
  data: Record<string, any>;
}

export interface UpdateCredentialInput {
  name?: string;
  type?: string;
  data?: Record<string, any>;
}

// ─── n8n API Key Decryption ─────────────────────────────────────────────────

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

// ─── Connection Cache ───────────────────────────────────────────────────────

const CACHE_TTL = 3600000; // 1 hour

const connectionCache = new Map<
  string,
  { data: { baseUrl: string; apiKey: string }; timestamp: number }
>();

async function getN8nConnection(organizationId: string) {
  const cached = connectionCache.get(organizationId);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const connection = await db.organizationN8nConnection.findUnique({
    where: { organizationId },
    select: {
      baseUrl: true,
      encryptedApiKey: true,
    },
  });

  if (!connection) {
    return null;
  }

  const apiKey = decrypt(connection.encryptedApiKey);
  const data = { baseUrl: connection.baseUrl, apiKey };

  connectionCache.set(organizationId, {
    data,
    timestamp: Date.now(),
  });

  return data;
}

// ─── API Helpers ────────────────────────────────────────────────────────────

function n8nHeaders(apiKey: string) {
  return {
    accept: "application/json",
    "content-type": "application/json",
    "X-N8N-API-KEY": apiKey,
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Create a new credential in n8n.
 */
export async function createCredential(
  organizationId: string,
  input: CreateCredentialInput
): Promise<N8nCredentialResponse> {
  const conn = await getN8nConnection(organizationId);
  if (!conn) {
    throw new Error(`No n8n connection for org ${organizationId}`);
  }

  try {
    const response = await axios.post<N8nCredentialResponse>(
      `${conn.baseUrl}/api/v1/credentials`,
      {
        name: input.name,
        type: input.type,
        data: input.data,
      },
      { headers: n8nHeaders(conn.apiKey) }
    );

    console.log(`[N8nCredential] Created credential "${input.name}" (${input.type}) in n8n`);
    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message;
    throw new Error(`Failed to create n8n credential: ${msg}`);
  }
}

/**
 * List all credentials in n8n (metadata only, no secrets).
 */
export async function listCredentials(
  organizationId: string
): Promise<N8nCredentialResponse[]> {
  const conn = await getN8nConnection(organizationId);
  if (!conn) {
    throw new Error(`No n8n connection for org ${organizationId}`);
  }

  try {
    const response = await axios.get<{ data: N8nCredentialResponse[] }>(
      `${conn.baseUrl}/api/v1/credentials`,
      { headers: n8nHeaders(conn.apiKey) }
    );

    return response.data.data || [];
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message;
    throw new Error(`Failed to list n8n credentials: ${msg}`);
  }
}

/**
 * Find a credential by name in n8n.
 * Returns null if not found.
 */
export async function findCredentialByName(
  organizationId: string,
  name: string
): Promise<N8nCredentialResponse | null> {
  const credentials = await listCredentials(organizationId);
  return credentials.find(c => c.name === name) || null;
}

/**
 * Update an existing credential in n8n.
 */
export async function updateCredential(
  organizationId: string,
  credentialId: string,
  input: UpdateCredentialInput
): Promise<N8nCredentialResponse> {
  const conn = await getN8nConnection(organizationId);
  if (!conn) {
    throw new Error(`No n8n connection for org ${organizationId}`);
  }

  try {
    const response = await axios.patch<N8nCredentialResponse>(
      `${conn.baseUrl}/api/v1/credentials/${credentialId}`,
      input,
      { headers: n8nHeaders(conn.apiKey) }
    );

    console.log(`[N8nCredential] Updated credential ${credentialId}`);
    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message;
    throw new Error(`Failed to update n8n credential ${credentialId}: ${msg}`);
  }
}

/**
 * Delete a credential in n8n.
 */
export async function deleteCredential(
  organizationId: string,
  credentialId: string
): Promise<void> {
  const conn = await getN8nConnection(organizationId);
  if (!conn) {
    throw new Error(`No n8n connection for org ${organizationId}`);
  }

  try {
    await axios.delete(
      `${conn.baseUrl}/api/v1/credentials/${credentialId}`,
      { headers: n8nHeaders(conn.apiKey) }
    );

    console.log(`[N8nCredential] Deleted credential ${credentialId}`);
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message;
    throw new Error(`Failed to delete n8n credential ${credentialId}: ${msg}`);
  }
}

/**
 * Test a credential in n8n.
 */
export async function testCredential(
  organizationId: string,
  credentialId: string
): Promise<{ status: string; message: string }> {
  const conn = await getN8nConnection(organizationId);
  if (!conn) {
    throw new Error(`No n8n connection for org ${organizationId}`);
  }

  try {
    const response = await axios.post<{ status: string; message: string }>(
      `${conn.baseUrl}/api/v1/credentials/${credentialId}/test`,
      {},
      { headers: n8nHeaders(conn.apiKey) }
    );

    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message;
    throw new Error(`Failed to test n8n credential ${credentialId}: ${msg}`);
  }
}

/**
 * Idempotent credential creation.
 *
 * If a credential with the given name already exists, updates it with the
 * latest data. Otherwise, creates a new one.
 *
 * Returns the credential ID and name for use in workflow node references.
 */
export async function ensureCredential(
  organizationId: string,
  name: string,
  type: string,
  data: Record<string, any>
): Promise<{ id: string; name: string; type: string }> {
  const existing = await findCredentialByName(organizationId, name);

  if (existing) {
    await updateCredential(organizationId, existing.id, { type, data });
    console.log(`[N8nCredential] Updated existing credential "${name}" (${existing.id})`);
    return { id: existing.id, name: existing.name, type };
  }

  const created = await createCredential(organizationId, { name, type, data });
  console.log(`[N8nCredential] Created new credential "${name}" (${created.id})`);
  return { id: created.id, name: created.name, type };
}
