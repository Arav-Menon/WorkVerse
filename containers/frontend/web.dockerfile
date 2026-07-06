FROM oven/bun:1.3.1 AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

ARG NEXT_PUBLIC_CORTEX_URL=http://localhost:3000
ARG NEXT_PUBLIC_FLUX_URL=ws://localhost:8080
ARG NEXT_PUBLIC_RELAY_URL=ws://localhost:8089
ARG NEXT_PUBLIC_SPACE_URL=ws://localhost:8002
ARG NEXT_PUBLIC_SYNAPSE_URL=ws://localhost:8001

ENV NEXT_PUBLIC_CORTEX_URL=$NEXT_PUBLIC_CORTEX_URL
ENV NEXT_PUBLIC_FLUX_URL=$NEXT_PUBLIC_FLUX_URL
ENV NEXT_PUBLIC_RELAY_URL=$NEXT_PUBLIC_RELAY_URL
ENV NEXT_PUBLIC_SPACE_URL=$NEXT_PUBLIC_SPACE_URL
ENV NEXT_PUBLIC_SYNAPSE_URL=$NEXT_PUBLIC_SYNAPSE_URL

FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json /temp/prod/
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

RUN bun run --cwd apps/web build

FROM oven/bun:1.3.1-slim AS release
RUN apt-get update -y && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=prerelease /usr/src/app/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/apps/web/.next ./apps/web/.next
COPY --from=prerelease /usr/src/app/apps/web/package.json ./apps/web/
COPY --from=prerelease /usr/src/app/apps/web/next.config.js ./apps/web/
COPY --from=prerelease /usr/src/app/apps/web/tailwind.config.js ./apps/web/
COPY --from=prerelease /usr/src/app/apps/web/postcss.config.js ./apps/web/
COPY --from=prerelease /usr/src/app/packages/ui ./packages/ui
COPY --from=prerelease /usr/src/app/package.json ./

USER bun

EXPOSE 3009/tcp

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3009/ || exit 1

ENTRYPOINT [ "bun", "run", "--cwd", "apps/web", "start", "--port", "3009" ]
