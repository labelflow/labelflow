# Needs to be run from the root of the monorepo, like this:
#   docker build --file=./typescript/web/Dockerfile .
# Inspired from: https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

################################################################################
# Build the whole web application and its dependencies
FROM node:14 AS builder

WORKDIR /app

# Maybe only copy what's needed
COPY . .

RUN yarn install --immutable

# Increase default maximum the default 512MB memory allowed since the build
# proceess needs at-least 4GB.
# Don't forget to increase your Docker host memory to a greater value!
ENV NODE_OPTIONS --max-old-space-size=4096

RUN yarn build:web

################################################################################
# Runner containing only the minimal required dependencies
#
# Ideally, use alpine or slim, but see https://github.com/prisma/prisma/issues/8478
# and https://github.com/prisma/prisma/issues/7755
# FROM node:14-alpine AS builder
# RUN apk add --no-cache libc6-compat
FROM node:14 AS runner

ENV NODE_ENV production

WORKDIR /app

ENV PORT 3000
EXPOSE "${PORT}"

ENV NEXTAUTH_URL "http://localhost:${PORT}"

RUN addgroup --gecos 1001 --system nodejs
RUN adduser --system labelflow --uid 1001

# COPY --from=builder /app/typescript/web/next.config.js ./
COPY --from=builder /app/typescript/web/public ./public
COPY --from=builder --chown=labelflow:nodejs /app/typescript/web/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER labelflow

CMD ["node_modules/.bin/next", "start"]

################################################################################
# Build a local development version (with an embedded reverse-proxy)
#
# Use this target when you want to avoid configuring a single hostname for MinIO
# which is reachable from both the Docker host and its containers.
#
# MinIO upload links are generated from the Docker container (i.e. on NextJS
# server-side) but consumed from the web-browser (i.e. on NextJS client-side).
# In normal situations, this is not a problem since the MinIO would be reachable
# with the same hostname (e.g. a public DNS entry) on both client and server
# sides of the code.
# But, when developing with Docker locally, the client (running in the Docker
# host web-browser) would use the `localhost` hostname and the server (running
# in the container) would use the internal `minio` hostname.
# To avoid tricks such as modifying the `/etc/hosts` file, the solution here is
# to run a reverse-proxy in background of the container so that it is able to
# reach the MinIO URL `http://minio:9000` with `http://localhost:9000`.
# As the reverse-proxy is only needed from inside the container, it is indeed
# not exposed outside of the container.
FROM runner as local-dev

USER root

# Install an nginx reverse-proxy to bind `http://localhost:9000` to
# `http://minio:9000`.
RUN apt-get update && \
    apt-get install nginx -y && \
    apt-get clean
COPY ./docker-compose.dev.nginx /etc/nginx/sites-enabled/

CMD ["bash", "-c", "service nginx start && node_modules/.bin/next start"]

################################################################################
# Re-expose the standard version at the end since Docker takes the latest image
# by default when not specifying the output target
FROM runner as default
