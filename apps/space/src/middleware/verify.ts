import jwt from "jsonwebtoken";

export const authenticate = (token: string) => {
  try {
    const cleanToken = token.startsWith("Bearer ")
      ? token.split(" ")[1]
      : token;

    const decoded = jwt.verify(cleanToken as string, process.env.JWT_SECRET!);

    if (!decoded) return null;

    return decoded;
  } catch {
    return null;
  }
};
