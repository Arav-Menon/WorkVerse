import { integrationService } from "../services/integration_services/integration.service";

export async function getIntegrationStatusController(request: any, reply: any) {
    try {
        const userId = request.user?.userId;
        if (!userId) {
            return reply.status(401).send({ success: false, message: "Unauthorized" });
        }

        const { orgId } = request.params;
        if (!orgId) {
            return reply.status(400).send({ success: false, message: "Organization ID required" });
        }

        // Verify user is member of this org
        const membership = await request.server.db.organizationMember.findUnique({
            where: { organizationId_userId: { organizationId: orgId, userId } },
        });

        if (!membership) {
            return reply.status(403).send({ success: false, message: "Not a member of this organization" });
        }

        const status = await integrationService.getOrgIntegrationStatus(orgId);

        return reply.status(200).send({
            success: true,
            data: status,
        });
    } catch (err: any) {
        request.log.error(err);
        return reply.status(500).send({
            success: false,
            message: err.message ?? "Internal Server Error",
        });
    }
}

export async function disconnectIntegrationController(request: any, reply: any) {
    try {
        const userId = request.user?.userId;
        if (!userId) {
            return reply.status(401).send({ success: false, message: "Unauthorized" });
        }

        const { orgId, provider } = request.params;
        if (!orgId || !provider) {
            return reply.status(400).send({ success: false, message: "Organization ID and provider required" });
        }

        // Verify user is OWNER or ADMIN of this org
        const membership = await request.server.db.organizationMember.findUnique({
            where: { organizationId_userId: { organizationId: orgId, userId } },
        });

        if (!membership) {
            return reply.status(403).send({ success: false, message: "Not a member of this organization" });
        }

        if (membership.role !== "OWNER" && membership.role !== "ADMIN") {
            return reply.status(403).send({ success: false, message: "Only owners and admins can manage integrations" });
        }

        await integrationService.disconnectIntegration(orgId, provider);

        return reply.status(200).send({
            success: true,
            provider,
            message: `${provider} disconnected successfully`,
        });
    } catch (err: any) {
        request.log.error(err);
        return reply.status(500).send({
            success: false,
            message: err.message ?? "Internal Server Error",
        });
    }
}
