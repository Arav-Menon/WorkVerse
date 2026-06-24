import type { FastifyInstance } from "fastify";
import { oauthController } from "../../controllers/oauth.controller";

export default async function oauthRoutes(fastify: FastifyInstance) {
    fastify.get("/:provider/connect", {
        handler: oauthController.connect.bind(oauthController),
    });

    fastify.get("/:provider/callback", {
        handler: oauthController.callback.bind(oauthController),
    });
}
