import { describe, expect, it, beforeAll, afterAll, vi } from "vitest";
import { fastify } from "../../server";
import { createUser } from "@repo/testing";

const { db } = vi.hoisted(() => {
  return {
    db: {
      $disconnect: vi.fn(),
      user: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
    },
  };
});

vi.mock("@repo/db/db", () => ({ db }));

describe("Auth API", () => {
  beforeAll(async () => {
    await fastify.ready();
  });

  afterAll(async () => {
    await fastify.close();
  });

  describe("POST /signup", () => {
    it("should register a new user", async () => {
      const fakeUser = createUser();

      db.user.findUnique.mockResolvedValue(null);

      db.user.create.mockResolvedValue({
        id: fakeUser.id,
        name: fakeUser.name,
        email: fakeUser.email,
      } as any);

      const res = await fastify.inject({
        method: "POST",
        url: "/api/v1/auth/register",
        payload: {
          name: fakeUser.name,
          email: fakeUser.email,
          password: "password123",
        },
      });
      expect(res.statusCode).toBe(201);
      expect(res.json()).toMatchObject({
        success: true,
        data: {
          user: { email: fakeUser.email, name: fakeUser.name },
        },
      });
      expect(db.user.create).toHaveBeenCalledOnce();
    });
  });

  describe("POST /login", () => {
    it("should login an existing user", async () => {
      const loginUser = createUser();

      db.user.findUnique.mockResolvedValue({
        id: loginUser.id,
        name: loginUser.name,
        email: loginUser.email,
      });
      const res = await fastify.inject({
        method: "POST",
        url: "/api/v1/auth/login",
        payload: {
          id: loginUser.id,
          email: loginUser.email,
          password: "password123",
        },
      });

      console.log(res.json());

      expect(res.statusCode).toBe(200);
      expect(res.json()).toMatchObject({
        success: true,
        data: {
          user: { email: loginUser.email },
        },
      });
      expect(db.user.findUnique).toHaveBeenCalledOnce();
    });
  });
});
