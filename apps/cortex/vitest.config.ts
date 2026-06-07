import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "@repo/testing/vitest.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      include: ["src/**/*.test.ts"],
      setupFiles: ["./vitest.setup.ts"],
    },
  }),
);
