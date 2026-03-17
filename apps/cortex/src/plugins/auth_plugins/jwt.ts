import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: { userId: string; email: string };
        user: { userId: string; email: string };
    }
}

declare module "fastify" {
    interface FastifyInstance {
        authenticate: (
            request: FastifyRequest,
            reply: FastifyReply
        ) => Promise<void>;
    }
}

export default fp(async (fastify: FastifyInstance) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET environment variable is required");
    }

    fastify.register(fastifyJwt, {
        secret,
        sign: {
            expiresIn: "7d",
        },
    });

    fastify.decorate(
        "authenticate",
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                await request.jwtVerify();
            } catch (err) {
                reply.status(401).send({ error: "Unauthorized", message: "Invalid or expired token" });
            }
        }
    );
});
