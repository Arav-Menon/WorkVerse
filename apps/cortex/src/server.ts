import Fastify from "fastify";
import dbPlugin from "./plugins/db";
import cachePlugin from "./plugins/cache";
import jwtPlugin from "./plugins/auth_plugins/jwt";
import clerkPlugin from "./plugins/auth_plugins/clerk";
import authGuardPlugin from "./plugins/auth_plugins/authGuard";
import corsPlugin from "./plugins/auth_plugins/cors";
import { rateLimitPlugin } from "@repo/rate-limit";
import authorizePlugin from "./plugins/authorize";

import authRoutes from "./routes/auth/auth.routes";
import clerkWebhookRoutes from "./routes/auth/webhooks/clerk.routes";
import organizationRoutes from "./routes/organization/organization.routes";

export const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  },
});

import { authJsonSchemas } from "../src/validationSchemas";
import workspaceRoutes from "./routes/workspace/workspace.routes";
import organizationInviteLinkRoutes from "./routes/organization_invite/organization.inviteLink.routes";
import organizationAcceptInviteRoutes from "./routes/organization_invite/organization.acceptInvite.routes";
import organizationValidateInviteRoutes from "./routes/organization_invite/organization.validateInvite.routes";
import createRoomRoutes from "./routes/create_room/create_room.route";
import redisPlugin from "./plugins/redis";
import { ingestPromptRoutes } from "./routes";
import oauthRoutes from "./routes/oauth/oauth.route";
import profileRoutes from "./routes/profile/profile.route";
import organizationGetRoutes from "./routes/organization/organization.get.routes";
import workspaceGetRoutes from "./routes/organization/workspace.get.routes";
import workspaceStandaloneRoutes from "./routes/workspace/workspace.get.routes";
import integrationRoutes from "./routes/integration/integration.routes";
import { aiChatRoutes } from "./routes/aiChat/aiChat.routes";
import n8nConnectionRoutes from "./routes/n8n-connection/n8n-connection.routes";
for (const schema of authJsonSchemas) {
  fastify.addSchema(schema);
}

fastify.register(corsPlugin);
fastify.register(dbPlugin);
fastify.register(cachePlugin);
fastify.register(jwtPlugin);
fastify.register(clerkPlugin);
fastify.register(authGuardPlugin);
fastify.register(authorizePlugin);
fastify.register(redisPlugin);
fastify.register(rateLimitPlugin);

fastify.register(authRoutes, { prefix: "/api/v1/auth" });
fastify.register(clerkWebhookRoutes, { prefix: "/api/v1/webhooks" });
fastify.register(organizationRoutes, {
  prefix: "/api/v1/register-organization",
});
fastify.register(workspaceRoutes, {
  prefix: "/api/v1/register-workspace",
});
fastify.register(organizationInviteLinkRoutes, {
  prefix: "/api/v1/generate-invite-link/",
});
fastify.register(organizationAcceptInviteRoutes, {
  prefix: "/api/v1/accept-invite",
});
fastify.register(organizationValidateInviteRoutes, {
  prefix: "/api/v1/invite",
});
fastify.register(createRoomRoutes, { prefix: "/api/v1/open-room" });
fastify.register(ingestPromptRoutes, { prefix: "/api/v1/ingest-prompt" });
fastify.register(oauthRoutes, { prefix: "/api/v1/oauth" });
fastify.register(profileRoutes, { prefix: "/api/v1/profile" });
fastify.register(integrationRoutes, { prefix: "/api/v1/organizations" });
fastify.register(organizationGetRoutes, { prefix: "/api/v1/organizations" });
fastify.register(workspaceGetRoutes, { prefix: "/api/v1/organizations" });
fastify.register(workspaceStandaloneRoutes, { prefix: "/api/v1/workspaces" });
fastify.register(aiChatRoutes, { prefix: "/api/v1/ai-chats" });
fastify.register(n8nConnectionRoutes, { prefix: "/api/v1/organizations" });
fastify.get("/health", async () => ({ status: "ok" }));
