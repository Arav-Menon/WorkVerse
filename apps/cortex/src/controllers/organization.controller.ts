import type { FastifyRequest, FastifyReply } from "fastify";
import { registerOrganisation } from "../services/organization_services/organization.service";
import type { RegisterOrganizationBody } from "@repo/schemas";

export async function createOrganizationController(
    request: FastifyRequest<{ Body: RegisterOrganizationBody }>,
    reply: FastifyReply
) {
    try {
        const userId = request.user?.userId;

        if (!userId) {
            return reply.status(401).send({ error: "Unauthorized", message: "User not found in request. Missing Middleware?" });
        }

        const organization = await registerOrganisation(
            request.server,
            request.body,
            userId
        );

        return reply.status(201).send(organization);
    } catch (err: any) {
        request.log.error(err);
        if (err.statusCode) {
            return reply.status(err.statusCode).send(err);
        }
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}
