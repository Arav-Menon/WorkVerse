import { oauthService } from "../services/oauth_services/oauth.service";

const FRONTEND_URL = process.env.CORS_ORIGIN || "http://localhost:3009";

class OAuthController {
    async connect(req: any, reply: any) {
        const { provider } = req.params;
        const { state } = req.query;

        console.log(`[OAuth] Connect request for provider: ${provider}`);

        const url = oauthService.getLoginUrl(provider, state);

        return reply.redirect(url);
    }

    async callback(req: any, reply: any) {
        const { provider } = req.params;
        const { code, state } = req.query;

        console.log(`[OAuth] Callback received for provider: ${provider}`);
        console.log(`[OAuth]   code present: ${!!code}`);
        console.log(`[OAuth]   state: ${state}`);

        // State encodes "userId:orgId"
        const stateStr = String(state || "");
        const [userId, orgId] = stateStr.split(":");

        if (!code) {
            return reply.redirect(
                `${FRONTEND_URL}/organization/${orgId || ""}/connections/callback?provider=${provider}&status=error&message=no_code`
            );
        }

        if (!userId || !orgId) {
            return reply.redirect(
                `${FRONTEND_URL}/organization/${orgId || ""}/connections/callback?provider=${provider}&status=error&message=unauthorized`
            );
        }

        try {
            // Verify user is OWNER or ADMIN of this organization
            const membership = await reply.server.db.organizationMember.findUnique({
                where: {
                    organizationId_userId: {
                        organizationId: orgId,
                        userId: userId,
                    },
                },
            });

            if (!membership) {
                console.log(`[OAuth] User ${userId} is not a member of org ${orgId}`);
                return reply.redirect(
                    `${FRONTEND_URL}/organization/${orgId}/connections/callback?provider=${provider}&status=error&message=not_member`
                );
            }

            if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
                console.log(`[OAuth] User ${userId} is not OWNER/ADMIN of org ${orgId}`);
                return reply.redirect(
                    `${FRONTEND_URL}/organization/${orgId}/connections/callback?provider=${provider}&status=error&message=insufficient_permissions`
                );
            }

            // Exchange code and store connection against the organization
            await oauthService.exchangeCode(provider, code, orgId);

            console.log(`[OAuth] ${provider} connection successful for org: ${orgId}`);

            return reply.redirect(
                `${FRONTEND_URL}/organization/${orgId}/connections/callback?provider=${provider}&status=success`
            );
        } catch (error: any) {
            console.error(`[OAuth] ${provider} callback error:`, error.message);
            console.error(`[OAuth]   Response data:`, error.response?.data);

            return reply.redirect(
                `${FRONTEND_URL}/organization/${orgId || ""}/connections/callback?provider=${provider}&status=error&message=exchange_failed`
            );
        }
    }
}

export const oauthController = new OAuthController();
