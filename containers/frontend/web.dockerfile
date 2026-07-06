FROM oven/bun:1.3.1 AS base
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

FROM base AS prerelease
COPY . .
RUN bun install

RUN bun run --cwd apps/web build

FROM oven/bun:1.3.1-slim AS release
RUN apt-get update -y && apt-get install -y openssl curl && rm -rf /var/lib/apt/lists/*
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=prerelease /usr/src/app/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/package.json ./
COPY --from=prerelease /usr/src/app/packages/ui ./packages/ui

COPY --from=prerelease /usr/src/app/apps/web/package.json ./apps/web/
COPY --from=prerelease /usr/src/app/apps/web/next.config.js ./apps/web/
COPY --from=prerelease /usr/src/app/apps/web/tailwind.config.js ./apps/web/
COPY --from=prerelease /usr/src/app/apps/web/postcss.config.js ./apps/web/
COPY --from=prerelease /usr/src/app/apps/web/.next ./apps/web/.next
COPY --from=prerelease /usr/src/app/apps/web/public ./apps/web/public
COPY --from=prerelease /usr/src/app/apps/web/app ./apps/web/app
COPY --from=prerelease /usr/src/app/apps/web/components ./apps/web/components
COPY --from=prerelease /usr/src/app/apps/web/lib ./apps/web/lib
COPY --from=prerelease /usr/src/app/apps/web/hooks ./apps/web/hooks
COPY --from=prerelease /usr/src/app/apps/web/utils ./apps/web/utils

USER bun

EXPOSE 3009/tcp

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3009/ || exit 1

CMD ["bun", "run", "--cwd", "apps/web", "start", "--", "-p", "3009"]
