import { randomUUID } from "crypto";

type User = {
  id: string;
  email: string;
  username: string;
  role: "member" | "admin";
  password: string;
  createdAt: Date;
};

export function createUser(overrides: Partial<User> = {}): User {
  return {
    id: randomUUID(),
    email: "test@test.com",
    username: "test-user",
    role: "member",
    password: "hashed-password",
    createdAt: new Date(),

    // override values
    ...overrides,
  };
}
