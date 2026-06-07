import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    env: {
      JWT_SECRET: "test-jwt-secret-for-vitest-which-needs-to-be-long-enough",
      CLERK_PUBLISHABLE_KEY: "pk_test_Y2xlcmsuYXBwLmNvbSQ",
      CLERK_SECRET_KEY: "sk_test_fake123",
    },


    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },


    clearMocks: true,
  },
});
