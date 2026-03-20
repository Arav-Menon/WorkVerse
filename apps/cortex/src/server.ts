import Fastify from "fastify";
import dbPlugin from "./plugins/db";
import jwtPlugin from "./plugins/auth_plugins/jwt";
import clerkPlugin from "./plugins/auth_plugins/clerk";
import authGuardPlugin from "./plugins/auth_plugins/authGuard";
import corsPlugin from "./plugins/auth_plugins/cors";

import authRoutes from "./routes/auth/auth.routes";
import clerkWebhookRoutes from "./routes/auth/webhooks/clerk.routes";
import organizationRoutes from "./routes/organization/organization.routes";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  },
});

import { authJsonSchemas } from "./validationSchemas";
import workspaceRoutes from "./routes/workspace/workspace.routes";
import organizationInviteLinkRoutes from "./routes/organization_invite/organization.inviteLink.routes";
import organizationAcceptInviteRoutes from "./routes/organization_invite/organization.acceptInvite.routes";
for (const schema of authJsonSchemas) {
  fastify.addSchema(schema);
}

fastify.register(corsPlugin);
fastify.register(dbPlugin);
fastify.register(jwtPlugin);
fastify.register(clerkPlugin);
fastify.register(authGuardPlugin);

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
fastify.get("/health", async () => ({ status: "ok" }));

fastify.listen(
  { port: Number(process.env.PORT ?? 3000), host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`Server listening on ${address}`);
  },
);
