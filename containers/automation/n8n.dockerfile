FROM oven/bun:1.3.1 AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
COPY apps/n8n/package.json /temp/prod/apps/n8n/
COPY packages/convo-store/package.json /temp/prod/packages/convo-store/
COPY packages/db/package.json /temp/prod/packages/db/
COPY packages/email/package.json /temp/prod/packages/email/
COPY packages/eslint-config/package.json /temp/prod/packages/eslint-config/
COPY packages/evaluator/package.json /temp/prod/packages/evaluator/
COPY packages/events/package.json /temp/prod/packages/events/
COPY packages/mcp/package.json /temp/prod/packages/mcp/
COPY packages/queue/package.json /temp/prod/packages/queue/
COPY packages/rbac/package.json /temp/prod/packages/rbac/
COPY packages/redis/package.json /temp/prod/packages/redis/
COPY packages/schemas/package.json /temp/prod/packages/schemas/
COPY packages/security/rate-limit/package.json /temp/prod/packages/security/rate-limit/
COPY packages/testing/package.json /temp/prod/packages/testing/
COPY packages/typescript-config/package.json /temp/prod/packages/typescript-config/
COPY packages/ui/package.json /temp/prod/packages/ui/

RUN cd /temp/prod && bun install

FROM base AS prerelease
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

RUN bun install --save-dev prisma && cd packages/db && bunx prisma generate

FROM oven/bun:1.3.1-slim AS release
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=prerelease /usr/src/app/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/apps/n8n ./apps/n8n
COPY --from=prerelease /usr/src/app/packages/db ./packages/db
COPY --from=prerelease /usr/src/app/packages/events ./packages/events
COPY --from=prerelease /usr/src/app/packages/redis ./packages/redis
COPY --from=prerelease /usr/src/app/packages/schemas ./packages/schemas
COPY --from=prerelease /usr/src/app/package.json ./

USER bun

EXPOSE 7002/tcp

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD bun --version || exit 1
ENTRYPOINT ["bun", "run", "--cwd", "apps/n8n", "start:n8n"]
