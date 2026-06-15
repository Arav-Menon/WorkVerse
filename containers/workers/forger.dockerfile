FROM oven/bun:1.3.1 AS base
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/prod
COPY package.json bun.lock /temp/prod/
COPY apps/forger/package.json /temp/prod/apps/cortex
COPY packages/evaluator/package.json /temp/prod/packages/evaluator/
COPY packages/events/package.json /temp/prod/packages/events/
COPY packages/queue/package.json /temp/prod/packages/queue/
COPY packages/redis/package.json /temp/prod/packages/redis/
COPY packages/db/package.json /temp/prod/packages/db/
COPY packages/testing/package.json /temp/prod/packages/testing/
COPY packages/security/rate-limit/package.json /temp/prod/packages/security/rate-limit/
COPY packages/schemas/package.json /temp/prod/packages/schemas/

RUN cd /temp/prod && bun install

FROM base AS prerelease
COPY --from=install /temp/prod/node_modules node_modules
COPY . .

RUN cd packages/db && bunx prisma generate 

FROM oven/bun:1.3.1-slim AS release
RUN apt-get update -y && apt-get install -y openssl
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY --from=prerelease /usr/src/app/node_modules ./node_modules
COPY --from=prerelease /usr/src/app/apps/forger ./apps/forger
COPY --from=prerelease /usr/src/app/packages ./packages
COPY --from=prerelease /usr/src/app/package.json ./

USER bun

EXPOSE 7000/tcp

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD bun --version || exit 1
ENTRYPOINT ["bun", "run", "--cwd", "apps/forger", "start:forger"]