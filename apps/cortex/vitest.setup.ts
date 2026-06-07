import { vi } from "vitest";

/**
 * Vitest runs tests in Node.js, NOT Bun.
 * So any code that calls Bun.password.hash() or Bun.password.verify()
 * will crash with "Bun is not defined".
 *
 * This setup file runs before every test file and injects a fake "Bun"
 * global so those calls work correctly in tests.
 */
globalThis.Bun = {
  password: {
    hash: vi.fn().mockResolvedValue("hashed-password"),
    verify: vi.fn().mockResolvedValue(true),
  },
} as any;
