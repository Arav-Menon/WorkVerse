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

        if (config.responseType) {
            params.set("response_type", config.responseType);
        }

        if (config.accessType) {
            params.set("access_type", config.accessType);
        }

        if (config.prompt) {
            params.set("prompt", config.prompt);
        }

        if (state) {
            params.set("state", state);
        }

        const url = `${config.authUrl}?${params}`;

        console.log(`[OAuth] ${provider} authorization URL generated`);
        console.log(`[OAuth]   client_id:     ${config.clientId}`);
        console.log(`[OAuth]   redirect_uri:  ${config.redirectUri}`);
        console.log(`[OAuth]   scope:         ${config.scopes}`);
        console.log(`[OAuth]   full_url:      ${url}`);

        return url;
    }

    async exchangeCode(provider: string, code: string, organizationId: string) {
        const config = this.getProvider(provider);

        console.log(`[OAuth] ${provider} token exchange initiated`);
        console.log(`[OAuth]   client_id:     ${config.clientId}`);
        console.log(`[OAuth]   redirect_uri:  ${config.redirectUri}`);
        console.log(`[OAuth]   code:          ${code.substring(0, 8)}...`);
        console.log(`[OAuth]   organizationId: ${organizationId}`);

        const { data } = await axios.post(
            config.tokenUrl,
            {
                client_id: config.clientId,
                client_secret: config.clientSecret,
                code,
                redirect_uri: config.redirectUri,
            },
            {
                headers : {
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

        const refreshToken: string | undefined = data.refresh_token;
        const expiresIn: number | undefined = data.expires_in;

        await db.organizationConnection.upsert({
            where: {
                organizationId_provider: {
                    organizationId,
                    provider: provider.toUpperCase() as any,
                },
            },
            update: {
                accessToken,
                refreshToken: refreshToken || undefined,
                status: "ACTIVE",
                connectedAt: new Date(),
                metadata: expiresIn ? { expiresIn } : undefined,
            },
            create: {
                organizationId,
                provider: provider.toUpperCase() as any,
                accessToken,
                refreshToken: refreshToken || undefined,
                scopes: config.scopes,
                status: "ACTIVE",
                metadata: expiresIn ? { expiresIn } : undefined,
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

    async fetchGoogleUser(accessToken: string) {
        const { data } = await axios.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json",
            },
        });

        return {
            email: data.email,
            name: data.name,
            avatar: data.picture,
        };
    }

    async disconnect(organizationId: string, provider: string) {
        await db.organizationConnection.deleteMany({
            where: {
                organizationId,
                provider: provider.toUpperCase() as any,
            },
        });
    }
}

export const oauthService = new OAuthService();
