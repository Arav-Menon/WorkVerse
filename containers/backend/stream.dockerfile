# Stage 1: Install dependencies (Bun handles workspace:* protocol)
FROM oven/bun:1.3.1-slim AS deps
RUN apt-get update -y && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
COPY apps/stream/package.json /usr/src/app/apps/stream/
COPY packages/convo-store/package.json /usr/src/app/packages/convo-store/
COPY packages/db/package.json /usr/src/app/packages/db/
COPY packages/email/package.json /usr/src/app/packages/email/
COPY packages/eslint-config/package.json /usr/src/app/packages/eslint-config/
COPY packages/evaluator/package.json /usr/src/app/packages/evaluator/
COPY packages/events/package.json /usr/src/app/packages/events/
COPY packages/mcp/package.json /usr/src/app/packages/mcp/
COPY packages/queue/package.json /usr/src/app/packages/queue/
COPY packages/rbac/package.json /usr/src/app/packages/rbac/
COPY packages/redis/package.json /usr/src/app/packages/redis/
COPY packages/schemas/package.json /usr/src/app/packages/schemas/
COPY packages/security/rate-limit/package.json /usr/src/app/packages/security/rate-limit/
COPY packages/testing/package.json /usr/src/app/packages/testing/
COPY packages/typescript-config/package.json /usr/src/app/packages/typescript-config/
COPY packages/ui/package.json /usr/src/app/packages/ui/

RUN bun install

# Stage 2: Build with tsup
FROM deps AS build
COPY . .
RUN cd apps/stream && bun run build

# Stage 3: Production Node.js image
FROM node:22-slim AS release
RUN apt-get update -y && apt-get install -y python3 make g++ openssl curl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

ENV NODE_ENV=production

# Copy compiled bundle
COPY --from=build /usr/src/app/apps/stream/dist ./dist

# Create a minimal package.json with only external runtime deps
# (tsup bundles workspace packages, only these remain as imports)
RUN echo '{ \
  "name": "stream-runtime", \
  "private": true, \
  "type": "module", \
  "dependencies": { \
    "mediasoup": "^3.20.0", \
    "fastify": "^5.8.5", \
    "fastify-plugin": "^5.1.0", \
    "@fastify/rate-limit": "^10.3.0", \
    "pino-pretty": "^11.0.0", \
    "ioredis": "^5.10.1", \
    "redis": "^5.11.0" \
  } \
}' > package.json

RUN npm install

USER 1001:1001

EXPOSE 3010/tcp
EXPOSE 40000-49999/udp

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3010/health || exit 1

ENTRYPOINT ["node", "dist/bin.js"]
