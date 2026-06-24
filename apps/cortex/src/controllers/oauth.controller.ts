import { oauthService } from "../services/oauth_services/oauth.service";

const FRONTEND_URL = process.env.CORS_ORIGIN || "http://localhost:3009";

class OAuthController {
    async connect(req: any, reply: any) {
        const { provider } = req.params;
        const { state } = req.query;

        const url = oauthService.getLoginUrl(provider, state);

        return reply.redirect(url);
    }

    async callback(req: any, reply: any) {
        const { provider } = req.params;
        const { code, state } = req.query;

        // State encodes "userId:orgId"
        const stateStr = String(state || "");
        const [userId, orgId] = stateStr.split(":");

        if (!code) {
            return reply.redirect(
                `${FRONTEND_URL}/organization/${orgId || ""}/connections/callback?provider=${provider}&status=error&message=no_code`
            );
        }

        if (!userId) {
            return reply.redirect(
                `${FRONTEND_URL}/organization/${orgId || ""}/connections/callback?provider=${provider}&status=error&message=unauthorized`
            );
        }

        try {
            await oauthService.exchangeCode(provider, code, userId);

            return reply.redirect(
                `${FRONTEND_URL}/organization/${orgId}/connections/callback?provider=${provider}&status=success`
            );
        } catch (error: any) {
            console.error(`OAuth callback error for ${provider}:`, error.message);

            return reply.redirect(
                `${FRONTEND_URL}/organization/${orgId || ""}/connections/callback?provider=${provider}&status=error&message=exchange_failed`
            );
        }
    }
}

export const oauthController = new OAuthController();
