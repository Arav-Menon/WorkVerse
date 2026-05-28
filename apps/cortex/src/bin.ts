import { fastify } from "./server";

export const app = fastify.listen(
  { port: Number(process.env.PORT ?? 3000), host: "0.0.0.0" },
  (err, address) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`Server listening on ${address}`);
  },
);
