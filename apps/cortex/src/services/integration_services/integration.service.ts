import { db } from "@repo/db/db";
import { oauthService } from "../oauth_services/oauth.service";
import { decrypt } from "../crypto/encryption.service";

class IntegrationService {
    async getOrgIntegrationStatus(organizationId: string) {
        const connections = await db.organizationConnection.findMany({
            where: { organizationId },
            select: {
                provider: true,
                scopes: true,
                status: true,
                connectedAt: true,
                lastSyncedAt: true,
                metadata: true,
            },
        });

        const result: Record<string, any> = {};

        for (const connection of connections) {
            const provider = connection.provider.toLowerCase();

            if (provider === "github") {
                try {
                    const fullConnection = await db.organizationConnection.findUnique({
                        where: { organizationId_provider: { organizationId, provider: connection.provider } },
                        select: { accessToken: true, encryptedAccessToken: true },
                    });

                    if (fullConnection) {
                        const token = fullConnection.encryptedAccessToken
                            ? decrypt(fullConnection.encryptedAccessToken)
                            : fullConnection.accessToken;
                        const githubUser = await oauthService.fetchGitHubUser(token);
                        result[provider] = {
                            connected: true,
                            username: githubUser.username,
                            avatar: githubUser.avatar,
                            profileUrl: githubUser.profileUrl,
                            connectedAt: connection.connectedAt.toISOString(),
                            scopes: connection.scopes,
                            status: connection.status,
                        };
                    }
                } catch (error) {
                    result[provider] = {
                        connected: true,
                        error: "Failed to fetch user info",
                        connectedAt: connection.connectedAt.toISOString(),
                        status: connection.status,
                    };
                }
            } else if (provider === "google") {
                try {
                    const fullConnection = await db.organizationConnection.findUnique({
                        where: { organizationId_provider: { organizationId, provider: connection.provider } },
                        select: { accessToken: true, encryptedAccessToken: true },
                    });

                    if (fullConnection) {
                        const token = fullConnection.encryptedAccessToken
                            ? decrypt(fullConnection.encryptedAccessToken)
                            : fullConnection.accessToken;
                        const googleUser = await oauthService.fetchGoogleUser(token);
                        result[provider] = {
                            connected: true,
                            username: googleUser.email,
                            avatar: googleUser.avatar,
                            profileUrl: null,
                            connectedAt: connection.connectedAt.toISOString(),
                            scopes: connection.scopes,
                            status: connection.status,
                        };
                    }
                } catch (error) {
                    result[provider] = {
                        connected: true,
                        error: "Failed to fetch user info",
                        connectedAt: connection.connectedAt.toISOString(),
                        status: connection.status,
                    };
                }
            } else {
                result[provider] = {
                    connected: true,
                    connectedAt: connection.connectedAt.toISOString(),
                    scopes: connection.scopes,
                    status: connection.status,
                };
            }
        }

        return result;
    }

    async disconnectIntegration(organizationId: string, provider: string) {
        await oauthService.disconnect(organizationId, provider);
    }
}

export const integrationService = new IntegrationService();
