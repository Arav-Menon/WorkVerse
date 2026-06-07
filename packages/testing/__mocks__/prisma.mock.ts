import { mockDeep } from "vitest-mock-extended";

import type { db } from "@repo/db/db";

export const dbMock = mockDeep<typeof db>();
