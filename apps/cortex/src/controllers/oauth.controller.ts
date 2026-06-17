import { oauthService } from "../services/oauth_services/oauth.service";

class OAuthController {
    async connect(req: any, reply: any) {
        const { provider } = req.params;

        const url = oauthService.getLoginUrl(provider);

        return reply.redirect(url);
    }

    async callback(req: any, reply: any) {
        const { provider } = req.params;
        const { code } = req.query;

        const userId: string = req.user?.userId;

        if (!userId) {
            return reply.status(401).send({ success: false, message: "Unauthorized" });
        }

        if (!code) {
            return reply.status(400).send({ success: false, message: "Missing code parameter" });
        }

        await oauthService.exchangeCode(provider, code, userId);

        return reply.send({
            success: true,
            provider,
            message: `${provider} connected successfully`,
        });
    }
}

export const oauthController = new OAuthController();