import { STATUS_CODES } from "http";
import jwt from "jsonwebtoken";

export const authenticate = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        if (!decoded) return Error("Unauthorized", STATUS_CODES)

        return decoded;
    } catch (err) {
        console.error("[Auth Middleware] Verification failed:", err);
        return null;
    }
};

export const userId = (token: string) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        if (!decoded) return Error("Unauthorized", STATUS_CODES)

        return decoded;
    } catch (err) {
        console.error("[Auth Middleware] Verification failed:", err);
        return null;
    }
};