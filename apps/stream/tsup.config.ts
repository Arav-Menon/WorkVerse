import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/bin.ts"],
  format: ["esm"],
  target: "node22",
  outDir: "dist",
  splitting: false,
  sourcemap: false,
  clean: true,
  minify: false,
  dts: false,
  platform: "node",
  external: [
    "mediasoup",
    "mediasoup/*",
    "fastify",
    "fastify/*",
    "fastify-plugin",
    "@fastify/rate-limit",
    "ioredis",
    "redis",
    "pino-pretty",
  ],
  noExternal: [
    "@repo/redis",
    "@repo/schemas",
    "@repo/rate-limit",
  ],
  banner: {
    js: `import { createRequire } from "node:module"; const require = createRequire(import.meta.url);`,
  },
});
