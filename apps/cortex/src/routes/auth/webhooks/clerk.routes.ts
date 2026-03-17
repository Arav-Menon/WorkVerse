import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/fastify";

export default async function clerkWebhookRoutes(fastify: FastifyInstance) {
    fastify.post(
        "/clerk",
        {
            config: {
                // @ts-expect-error - overriding fastify built-in types to pass raw body config for Svix verification
                rawBody: true,
            },
        },
        async (request: FastifyRequest, reply: FastifyReply) => {
            const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

            if (!WEBHOOK_SECRET) {
                fastify.log.error("Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env");
                return reply.code(500).send("Server configuration error");
            }

            // Get the headers from the request
            const svix_id = request.headers["svix-id"] as string;
            const svix_timestamp = request.headers["svix-timestamp"] as string;
            const svix_signature = request.headers["svix-signature"] as string;

            // If there are no Svix headers, error out
            if (!svix_id || !svix_timestamp || !svix_signature) {
                return reply.code(400).send("Error occured -- no svix headers");
            }

            // Get the raw body
            const payload = request.body;
            // Depending on fastify config, body might need to be stringified
            const body = typeof payload === "string" ? payload : JSON.stringify(payload);

            // Create a new Svix instance with your secret.
            const wh = new Webhook(WEBHOOK_SECRET);

            let evt: WebhookEvent;

            // Verify the payload with the headers
            try {
                evt = wh.verify(body, {
                    "svix-id": svix_id,
                    "svix-timestamp": svix_timestamp,
                    "svix-signature": svix_signature,
                }) as WebhookEvent;
            } catch (err: any) {
                fastify.log.error("Error verifying webhook:", err.message);
                return reply.code(400).send("Error verifying webhook");
            }

            // Handle the webhook event here
            const eventType = evt.type;

            if (eventType === "user.created") {
                const { id, email_addresses, first_name, last_name } = evt.data;
                const email = email_addresses[0]?.email_address;
                const name = `${first_name || ""} ${last_name || ""}`.trim() || "User";

                if (!email) {
                    fastify.log.error("No email address provided by Clerk");
                    return reply.code(400).send("Email address missing");
                }

                // Sync to Prisma DB
                try {
                    await fastify.db.user.create({
                        data: {
                            id,
                            email,
                            name,
                            passwordHash: "clerk-oauth-managed-user",
                        },
                    });
                    fastify.log.info(`Synced new Clerk user to DB: ${email}`);
                } catch (error: any) {
                    fastify.log.error(`Error saving Clerk user to database: ${error.message}`);
                    return reply.code(500).send("Error syncing user");
                }
            }

            return reply.code(200).send({ success: true });
        }
    );
}
