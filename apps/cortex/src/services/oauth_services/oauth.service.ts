import axios from "axios";
import { OAuthProvders } from "../../oauth/index";
import { db } from "@repo/db/db";

class OAuthService {
    getProvider(provider: string) {
        const config = OAuthProvders[provider as keyof typeof OAuthProvders];

        if (!config) {
            throw new Error("Provider not supported");
        }

        return config;
    }

    getLoginUrl(provider: string) {
        const config = this.getProvider(provider);

        const params = new URLSearchParams({
            client_id: config.clientId,
            scope: config.scopes,
        });

        return `${config.authUrl}?${params}`;
    }

    async exchangeCode(provider: string, code: string, userId: string) {
        const config = this.getProvider(provider);

        const { data } = await axios.post(
            config.tokenUrl,
            {
                client_id: config.clientId,
                client_secret: config.clientSecret,
                code,
            },
            {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            }
        );

        const accessToken: string = data.access_token;

        if (!accessToken) {
            throw new Error(
                `Failed to obtain access token from ${provider}. Response: ${JSON.stringify(data)}`
            );
        }

        await db.oAuthConnection.upsert({
            where: {
                userId_provider: {
                    userId,
                    provider: provider.toUpperCase() as any,
                },
            },
            update: {
                accessToken,
            },
            create: {
                userId,
                provider: provider.toUpperCase() as any,
                accessToken,
                scopes: config.scopes,
            },
        });

        return accessToken;
    }
}

export const oauthService = new OAuthService();