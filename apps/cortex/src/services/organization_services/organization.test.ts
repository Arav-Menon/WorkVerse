import { afterAll, beforeAll, describe, expect, vi, it } from "vitest";
import { fastify } from "../../server.ts";
import { fakeOrgRegister } from "@repo/testing";

const { db, mockRedisClient } = vi.hoisted(() => {
    const dbMock: any = {
        $disconnect: vi.fn(),
        $transaction: vi.fn(async (cb) => cb(dbMock)),
        organization: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
        organizationMember: {
            create: vi.fn(),
        }
    };

    return {
        db: dbMock,
        mockRedisClient: {
            on: vi.fn(),
            connect: vi.fn(),
            disconnect: vi.fn(),
            quit: vi.fn(),
            set: vi.fn(),
        }
    };
});

vi.mock("@repo/db/db", () => ({ db }));

vi.mock("@repo/redis/redis-client", async (importOriginal) => {
    const actual = await importOriginal();

    return {
        ...actual,

        client: mockRedisClient,
    };
});

describe("ORGANIZATION API", () => {
    beforeAll(async () => {
        await fastify.ready();
    })
    afterAll(async () => {
        await fastify.close();
    })

    describe("POST /organization", () => {
        it("should register a new organization", async () => {
            const fakeOrg = fakeOrgRegister();

            db.organization.findUnique.mockResolvedValue(null);
            db.organization.create.mockResolvedValue({
                id: fakeOrg.id,
                name: fakeOrg.name,
                slug: fakeOrg.slug,
                createdBy: fakeOrg.createdBy,
                createdAt: fakeOrg.createAt,
            })

            mockRedisClient.set.mockResolvedValue("ok")
        console.log("SENDING REQUEST");
        const res = await fastify.inject({
            method: "POST",
            url: "/api/v1/register-organization/",
            headers: {
                "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZTllODNhMC01YmJlLTQ2MTItYjc2ZS0yMDM1OTlkMjgxZTUiLCJlbWFpbCI6InRlc3RAdGVzdC5jb20iLCJpYXQiOjE3Nzk5Nzg3MDgsImV4cCI6MTc4MDU4MzUwOH0.2Vj5LySMSvVxdUb6u5tn8dSYSbfShtQ4O8sMeZqS2Hg"
            },
            payload: {
                name: fakeOrg.name,
                slug: fakeOrg.slug
            }
        })
        console.log("RESPONSE RECEIVED", res.statusCode);

        console.log(res.json())

        expect(res.statusCode).toBe(201);
        expect(res.json()).toMatchObject({
            success: true,
            data: {
                org: { name: fakeOrg.name, createBy: fakeOrg.createdBy }
            }
        })
        expect(db.organization.create).toHaveBeenCalledOnce();


    })
})
})