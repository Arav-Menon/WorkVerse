import jwt from "jsonwebtoken";

export const authenticate = (token: string) => {
  try {
    const cleanToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    const decoded = jwt.verify(cleanToken as string, process.env.JWT_SECRET!);
    console.log("Decoded Token:", decoded);

    if (!decoded) return null;

    return decoded;
  } catch (err) {
    console.error("[Auth Middleware] Verification failed:", err);
    return null;
  }
};
