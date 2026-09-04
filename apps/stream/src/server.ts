import Fastify from "fastify";
import transportRoute from "./routes/transport.route.ts";
import { rateLimitPlugin } from "@repo/rate-limit";

export const fastify = Fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: { colorize: true },
    },
  },
});

fastify.get("/health", async (_, reply) => {
  return reply.status(200).send({ status: "ok", service: "stream" });
});

fastify.register(rateLimitPlugin);

fastify.register(transportRoute, {
  prefix: "/api/v1/",
});
