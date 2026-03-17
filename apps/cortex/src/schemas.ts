import { buildJsonSchemas } from "fastify-zod";
import * as authSchemas from "@repo/schemas";

export const { schemas: authJsonSchemas, $ref } = buildJsonSchemas(authSchemas, {
    $id: "auth",
});
