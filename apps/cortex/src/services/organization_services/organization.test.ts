import {afterAll, beforeAll, describe, vi} from "vitest";
import {fastify} from "../../server.ts";
import { dbMock } from "@repo/testing";

vi.mock("@repo/db/db", () => ({
    db : dbMock
}));

describe("ORGANIZATION API", () => {
    beforeAll(async () => {
        await fastify.ready();
    })
    afterAll(async  () => {
        await fastify.close();
    })

    describe("POST /organization", () => {
        it("should register a new organization", async () => {
            const fakeOrg = fakeOrg
        })
    })
})