import Fastify from "fastify";
import dbPlugin from "./plugins/db";
import jwtPlugin from "./plugins/auth_plugins/jwt";
import clerkPlugin from "./plugins/auth_plugins/clerk";
import authGuardPlugin from "./plugins/auth_plugins/authGuard";
import corsPlugin from "./plugins/auth_plugins/cors";

import authRoutes from "./routes/auth/auth.routes";
import clerkWebhookRoutes from "./routes/auth/webhooks/clerk.routes";

const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  },
});

import { authJsonSchemas } from "./schemas";
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

fastify.get("/health", async () => ({ status: "ok" }));

fastify.listen(
  { port: Number(process.env.PORT ?? 3000), host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`Server listening on ${address}`);
  }
);
