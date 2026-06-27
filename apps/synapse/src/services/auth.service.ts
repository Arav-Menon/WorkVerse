import jwt from "jsonwebtoken";

export interface AuthUser {
  userId: string;
  email: string;
}

export const verifyToken = (token: string): AuthUser | null => {
  try {
    const parts = token.split(" ");
    const cleanToken = parts[0] === "Bearer" ? parts[1] : token;
    if (!cleanToken) return null;

    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const decoded = jwt.verify(cleanToken, secret) as unknown as {
      userId: string;
      email: string;
    };

    if (!decoded || !decoded.userId) return null;

    return { userId: decoded.userId, email: decoded.email };
  } catch (err) {
    return null;
  }
};
