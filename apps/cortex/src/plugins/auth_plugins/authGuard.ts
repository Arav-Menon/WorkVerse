import fp from "fastify-plugin";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getAuth } from "@clerk/fastify";

declare module "fastify" {
    interface FastifyInstance {
        authenticateBoth: (
            request: FastifyRequest,
            reply: FastifyReply
        ) => Promise<void>;
    }
}

export default fp(async (fastify: FastifyInstance) => {
    fastify.decorate(
        "authenticateBoth",
        async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                await request.jwtVerify();
                return;
            } catch (err) {
            }

            try {
                const clerkAuth = getAuth(request);
                if (clerkAuth && clerkAuth.userId) {
                    request.user = {
                        userId: clerkAuth.userId,
                        email: "clerk-user@managed.com",
                    };
                    return;
                }
            } catch (err) {
            }

            reply.status(401).send({ error: "Unauthorized", message: "Invalid or missing token" });
        }
    );
});
