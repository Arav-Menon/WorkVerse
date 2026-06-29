import { db } from "@repo/db/db";
import axios from "axios";
import { encrypt, decrypt, maskApiKey } from "./n8n-encryption.service";

function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

class N8nConnectionService {
  async connect(organizationId: string, userId: string, baseUrl: string, apiKey: string) {
    const normalizedUrl = baseUrl.replace(/\/+$/, "");

    if (!isValidUrl(normalizedUrl)) {
      throw { statusCode: 400, message: "Invalid URL format. Must include protocol (https://)" };
    }

    if (!apiKey || apiKey.trim().length === 0) {
      throw { statusCode: 400, message: "API key is required" };
    }

    const membership = await db.organizationMember.findUnique({
      where: { organizationId_userId: { organizationId, userId } },
    });

    if (!membership) {
      throw { statusCode: 403, message: "You do not have access to this organization" };
    }

    if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
      throw { statusCode: 403, message: "Only owners and admins can manage n8n connections" };
    }

    const encryptedApiKey = encrypt(apiKey);

    const connection = await db.organizationN8nConnection.upsert({
      where: { organizationId },
      create: {
        organizationId,
        baseUrl: normalizedUrl,
        encryptedApiKey,
        connectedById: userId,
        status: "CONNECTED",
      },
      update: {
        baseUrl: normalizedUrl,
        encryptedApiKey,
        connectedById: userId,
        status: "CONNECTED",
      },
      select: {
        id: true,
        baseUrl: true,
        status: true,
        lastValidatedAt: true,
        createdAt: true,
        connectedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return {
      connected: true,
      baseUrl: connection.baseUrl,
      status: connection.status,
      lastValidatedAt: connection.lastValidatedAt?.toISOString() ?? null,
      connectedBy: connection.connectedBy,
      connectedAt: connection.createdAt.toISOString(),
    };
  }

  async getStatus(organizationId: string) {
    const connection = await db.organizationN8nConnection.findUnique({
      where: { organizationId },
      select: {
        id: true,
        baseUrl: true,
        encryptedApiKey: true,
        status: true,
        lastValidatedAt: true,
        createdAt: true,
        connectedBy: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!connection) {
      return { connected: false };
    }

    const maskedKey = maskApiKey(decrypt(connection.encryptedApiKey));

    return {
      connected: true,
      baseUrl: connection.baseUrl,
      maskedApiKey: maskedKey,
      status: connection.status,
      lastValidatedAt: connection.lastValidatedAt?.toISOString() ?? null,
      connectedBy: connection.connectedBy,
      connectedAt: connection.createdAt.toISOString(),
    };
  }

  async testConnection(organizationId: string) {
    const connection = await db.organizationN8nConnection.findUnique({
      where: { organizationId },
      select: {
        baseUrl: true,
        encryptedApiKey: true,
      },
    });

    if (!connection) {
      throw { statusCode: 404, message: "No n8n connection found for this organization" };
    }

    const apiKey = decrypt(connection.encryptedApiKey);
    const testUrl = `${connection.baseUrl}/api/v1/workflows`;

    try {
      const response = await axios.get(testUrl, {
        headers: {
          "accept": "application/json",
          "X-N8N-API-KEY": apiKey,
        },
        timeout: 10000,
      });

      if (response.status >= 200 && response.status < 300) {
        await db.organizationN8nConnection.update({
          where: { organizationId },
          data: {
            lastValidatedAt: new Date(),
            status: "CONNECTED",
          },
        });

        return {
          success: true,
          message: "Connected successfully",
          lastValidatedAt: new Date().toISOString(),
        };
      }

      throw { statusCode: 502, message: `Unexpected response status: ${response.status}` };
    } catch (error: any) {
      await db.organizationN8nConnection.update({
        where: { organizationId },
        data: { status: "ERROR" },
      }).catch(() => {});

      if (error.statusCode) {
        throw error;
      }

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401 || status === 403) {
          throw { statusCode: 401, message: "Invalid API key or insufficient permissions" };
        }
        if (status === 404) {
          throw { statusCode: 404, message: "n8n instance not found. Check the base URL." };
        }
        throw {
          statusCode: 502,
          message: `n8n returned error: ${data?.message || data?.error || status}`,
        };
      }

      if (error.code === "ECONNREFUSED") {
        throw { statusCode: 502, message: "Connection refused. Check the base URL and ensure n8n is running." };
      }
      if (error.code === "ENOTFOUND") {
        throw { statusCode: 502, message: "Host not found. Check the base URL." };
      }
      if (error.code === "ETIMEDOUT") {
        throw { statusCode: 504, message: "Connection timed out. The n8n instance may be unreachable." };
      }

      throw { statusCode: 500, message: `Connection test failed: ${error.message}` };
    }
  }

  async disconnect(organizationId: string) {
    const connection = await db.organizationN8nConnection.findUnique({
      where: { organizationId },
    });

    if (!connection) {
      throw { statusCode: 404, message: "No n8n connection found for this organization" };
    }

    await db.organizationN8nConnection.delete({
      where: { organizationId },
    });

    return { success: true, message: "n8n connection disconnected" };
  }
}

export const n8nConnectionService = new N8nConnectionService();
