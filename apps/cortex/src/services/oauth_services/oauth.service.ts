import axios from "axios";
import { OAuthProviders } from "../../oauth/index";
import { db } from "@repo/db/db";

class OAuthService {
    getProvider(provider: string) {
        const config = OAuthProviders[provider as keyof typeof OAuthProviders];

        if (!config) {
            throw new Error("Provider not supported");
        }

        return config;
    }

    getLoginUrl(provider: string, state?: string) {
        const config = this.getProvider(provider);

        const params = new URLSearchParams({
            client_id: config.clientId,
            scope: config.scopes,
            redirect_uri: config.redirectUri,
        });

        if (state) {
            params.set("state", state);
        }

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
                redirect_uri: config.redirectUri,
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

    async fetchGitHubUser(accessToken: string) {
        const { data } = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
            },
        });

        return {
            username: data.login,
            avatar: data.avatar_url,
            profileUrl: data.html_url,
        };
    }

    async disconnect(userId: string, provider: string) {
        await db.oAuthConnection.deleteMany({
            where: {
                userId,
                provider: provider.toUpperCase() as any,
            },
        });
    }
}

export const oauthService = new OAuthService();
