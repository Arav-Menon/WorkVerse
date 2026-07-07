FROM oven/bun:1.3.1 AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/

COPY apps/cortex/package.json /temp/prod/apps/cortex/
COPY apps/docs/package.json /temp/prod/apps/docs/
COPY apps/executor/package.json /temp/prod/apps/executor/
COPY apps/flux/package.json /temp/prod/apps/flux/
COPY apps/forger/package.json /temp/prod/apps/forger/
COPY apps/mail-forger/package.json /temp/prod/apps/mail-forger/
COPY apps/n8n/package.json /temp/prod/apps/n8n/
COPY apps/orion/package.json /temp/prod/apps/orion/
COPY apps/relay/package.json /temp/prod/apps/relay/
COPY apps/scribe/package.json /temp/prod/apps/scribe/
COPY apps/space/package.json /temp/prod/apps/space/
COPY apps/stream/package.json /temp/prod/apps/stream/
COPY apps/synapse/package.json /temp/prod/apps/synapse/
COPY apps/web/package.json /temp/prod/apps/web/

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

FROM oven/bun:1.3.1-slim AS release
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=prerelease /usr/src/app/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/apps/mail-forger ./apps/mail-forger
COPY --from=prerelease /usr/src/app/packages/email ./packages/email
COPY --from=prerelease /usr/src/app/packages/queue ./packages/queue
COPY --from=prerelease /usr/src/app/packages/redis ./packages/redis
COPY --from=prerelease /usr/src/app/packages/schemas ./packages/schemas
COPY --from=prerelease /usr/src/app/package.json ./

RUN rm -rf node_modules/@repo/email node_modules/@repo/queue node_modules/@repo/redis node_modules/@repo/schemas && \
    mkdir -p node_modules/@repo && \
    ln -s ../../packages/email node_modules/@repo/email && \
    ln -s ../../packages/queue node_modules/@repo/queue && \
    ln -s ../../packages/redis node_modules/@repo/redis && \
    ln -s ../../packages/schemas node_modules/@repo/schemas

USER 1001:1001

EXPOSE 7001/tcp

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD bun --version || exit 1
ENTRYPOINT ["bun", "run", "--cwd", "apps/mail-forger", "start:mail-forger"]
