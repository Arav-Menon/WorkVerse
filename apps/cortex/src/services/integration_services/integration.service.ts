import { db } from "@repo/db/db";
import { oauthService } from "../oauth_services/oauth.service";

class IntegrationService {
    async getOrgIntegrationStatus(userId: string) {
        // Get user's OAuth connections
        const connections = await db.oAuthConnection.findMany({
            where: { userId },
            select: {
                provider: true,
                scopes: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        const result: Record<string, any> = {};

        for (const connection of connections) {
            const provider = connection.provider.toLowerCase();

            // For GitHub, fetch user info
            if (provider === "github") {
                try {
                    // We need the access token to fetch GitHub user info
                    const fullConnection = await db.oAuthConnection.findUnique({
                        where: { userId_provider: { userId, provider: connection.provider } },
                        select: { accessToken: true },
                    });

                    if (fullConnection) {
                        const githubUser = await oauthService.fetchGitHubUser(fullConnection.accessToken);
                        result[provider] = {
                            connected: true,
                            username: githubUser.username,
                            avatar: githubUser.avatar,
                            profileUrl: githubUser.profileUrl,
                            connectedAt: connection.createdAt.toISOString(),
                            scopes: connection.scopes,
                        };
                    }
                } catch (error) {
                    // Token might be expired or invalid
                    result[provider] = {
                        connected: true,
                        error: "Failed to fetch user info",
                        connectedAt: connection.createdAt.toISOString(),
                    };
                }
            } else {
                result[provider] = {
                    connected: true,
                    connectedAt: connection.createdAt.toISOString(),
                    scopes: connection.scopes,
                };
            }
        }

        return result;
    }

    async disconnectIntegration(userId: string, provider: string) {
        await oauthService.disconnect(userId, provider);
    }
}

export const integrationService = new IntegrationService();
