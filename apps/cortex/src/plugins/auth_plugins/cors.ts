import fp from "fastify-plugin";
import fastifyCors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

export default fp(async (fastify: FastifyInstance) => {
    const rawOrigin = process.env.CORS_ORIGIN;
    
    // Parse origins from process.env.CORS_ORIGIN if provided (supports comma-separated origins)
    const envOrigins = rawOrigin
        ? rawOrigin.split(",").map((o) => o.trim()).filter(Boolean)
        : [];

    const defaultOrigins = [
        "http://localhost:3009",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3009",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ];

    const allowedOrigins = Array.from(new Set([...envOrigins, ...defaultOrigins]));

    fastify.register(fastifyCors, {
        origin: (origin, cb) => {
            // Allow requests with no origin (like mobile apps or server-to-server)
            if (!origin) {
                return cb(null, true);
            }

            if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
                return cb(null, true);
            }

            // Allow any localhost / 127.0.0.1 origin
            if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
                return cb(null, true);
            }

            return cb(new Error("Not allowed by CORS"), false);
        },
        credentials: true,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    });
});

