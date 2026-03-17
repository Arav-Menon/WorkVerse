import type { FastifyInstance } from "fastify";
import type { RegisterBody, LoginBody } from "@repo/schemas";

export async function signupUser(
    fastify: FastifyInstance,
    input: RegisterBody,
): Promise<{
    token: string;
    user: { id: string; name: string; email: string };
}> {
    const { name, email, password } = input;

    const existing = await fastify.db.user.findUnique({ where: { email } });
    if (existing) {
        throw { statusCode: 409, message: "A user with that email already exists" };
    }
    const passwordHash = await Bun.password.hash(password, {
        algorithm: "bcrypt",
        cost: 12,
    });

    const user = await fastify.db.user.create({
        data: { name, email, passwordHash },
        select: { id: true, name: true, email: true },
    });

    const token = fastify.jwt.sign({ userId: user.id, email: user.email });

    return { token, user };
}

export async function loginUser(
    fastify: FastifyInstance,
    input: LoginBody,
): Promise<{
    token: string;
    user: { id: string; name: string; email: string };
}> {
    const { email, password } = input;

    const user = await fastify.db.user.findUnique({ where: { email } });
    if (!user) {
        throw { statusCode: 401, message: "Invalid email or password" };
    }

    const isValid = await Bun.password.verify(password, user.passwordHash);
    if (!isValid) {
        throw { statusCode: 401, message: "Invalid email or password" };
    }

    const token = fastify.jwt.sign({ userId: user.id, email: user.email });

    return {
        token,
        user: { id: user.id, name: user.name, email: user.email },
    };
}
