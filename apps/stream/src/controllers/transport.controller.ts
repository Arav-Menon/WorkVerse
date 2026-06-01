import type {FastifyReply, FastifyRequest} from "fastify";
import type {TransportInput} from "@repo/schemas";
import {createTransport} from "../services/transport.service.ts";

export async function transportController( request : FastifyRequest<{Body : TransportInput }>, reply : FastifyReply ) {
    try {
        const response = await createTransport(request.server, request.body)
        return  {
            success : true,
            message : "Account created successfully",
            data : response
        }
    }catch (err: any) {
        const statusCode = err.statusCode ?? 500;
        const message = err.message ?? "Internal server error";
        return reply.status(statusCode).send({ success: false, message });
    }
}