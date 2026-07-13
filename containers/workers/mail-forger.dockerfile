FROM oven/bun:1.3.1 AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

FROM base AS prerelease
COPY package.json bun.lock ./
COPY apps/cortex/package.json apps/cortex/
COPY apps/docs/package.json apps/docs/
COPY apps/executor/package.json apps/executor/
COPY apps/flux/package.json apps/flux/
COPY apps/forger/package.json apps/forger/
COPY apps/mail-forger/package.json apps/mail-forger/
COPY apps/n8n/package.json apps/n8n/
COPY apps/orion/package.json apps/orion/
COPY apps/relay/package.json apps/relay/
COPY apps/scribe/package.json apps/scribe/
COPY apps/space/package.json apps/space/
COPY apps/stream/package.json apps/stream/
COPY apps/synapse/package.json apps/synapse/
COPY apps/web/package.json apps/web/
COPY packages/convo-store/package.json packages/convo-store/
COPY packages/db/package.json packages/db/
COPY packages/email/package.json packages/email/
COPY packages/eslint-config/package.json packages/eslint-config/
COPY packages/evaluator/package.json packages/evaluator/
COPY packages/events/package.json packages/events/
COPY packages/mcp/package.json packages/mcp/
COPY packages/queue/package.json packages/queue/
COPY packages/rbac/package.json packages/rbac/
COPY packages/redis/package.json packages/redis/
COPY packages/schemas/package.json packages/schemas/
COPY packages/security/rate-limit/package.json packages/security/rate-limit/
COPY packages/testing/package.json packages/testing/
COPY packages/typescript-config/package.json packages/typescript-config/
COPY packages/ui/package.json packages/ui/

COPY apps/mail-forger ./apps/mail-forger
COPY packages/email ./packages/email
COPY packages/queue ./packages/queue
COPY packages/redis ./packages/redis
COPY packages/schemas ./packages/schemas

RUN bun install

FROM oven/bun:1.3.1-slim AS release
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=prerelease /usr/src/app ./

USER 1001:1001

EXPOSE 7001/tcp

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD bun --version || exit 1
ENTRYPOINT ["bun", "run", "--cwd", "apps/mail-forger", "start:mail-forger"]
