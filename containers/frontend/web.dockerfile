FROM oven/bun:1.3.1 AS base
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
COPY apps/web/package.json /temp/prod/apps/web/
COPY packages/ui/package.json /temp/prod/packages/ui/
COPY packages/eslint-config/package.json /temp/prod/packages/eslint-config/
COPY packages/typescript-config/package.json /temp/prod/packages/typescript-config/

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
