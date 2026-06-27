import axios from "axios";
import { db } from "@repo/db/db";
import crypto from "crypto";

interface N8nWorkflowResponse {
  id: string;
  name: string;
  baseUrl: string;
}

const ALGORITHM = "aes-256-gcm";
const AUTH_TAG_LENGTH = 16;
const SEPARATOR = ":";
const CACHE_TTL = 3600000; // 1 hour in milliseconds

// Simple in-memory cache
const connectionCache = new Map<
  string,
  { data: any; timestamp: number }
>();

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

async function getCachedConnection(organizationId: string) {
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

  if (connection) {
    connectionCache.set(organizationId, {
      data: connection,
      timestamp: Date.now(),
    });
  }

  return connection;
}

export async function createWorkflow(
  workflowJson: object,
  organizationId: string,
): Promise<N8nWorkflowResponse> {
  const connection = await getCachedConnection(organizationId);

  if (!connection) {
    throw new Error(`No n8n connection found for organization ${organizationId}`);
  }

  const apiKey = decrypt(connection.encryptedApiKey);
  const n8nUrl = `${connection.baseUrl}/api/v1/workflows`;

  try {
    const response = await axios.post<N8nWorkflowResponse>(
      n8nUrl,
      workflowJson,
      {
        headers: {
          "accept": "application/json",
          "X-N8N-API-KEY": apiKey,
        },
      },
    );

    return {
      id: response.data.id,
      name: response.data.name,
      baseUrl: connection.baseUrl,
    };
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || error.message;
    throw new Error(
      `Failed to create n8n workflow: ${errorMessage} statuscode : ${errorMessage.statuscode}`,
    );
  }
}
