################################################################################
# Needs to be run from the root of the monorepo, like this:
# docker build --file=./typescript/web/Dockerfile .
#
# inspired from:
# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

################################################################################
# Build the web app

# Ideally, use alpine or slim, but see https://github.com/prisma/prisma/issues/8478
# and https://github.com/prisma/prisma/issues/7755
# FROM node:14-alpine AS builder
# RUN apk add --no-cache libc6-compat

FROM node:14 AS builder


WORKDIR /app

# Maybe only copy what's needed
COPY . .

RUN yarn install --immutable

ENV NODE_OPTIONS --max-old-space-size=4096 

RUN yarn build:web --debug

################################################################################
# Run the web server

# Ideally, use alpine or slim, but see https://github.com/prisma/prisma/issues/8478
# and https://github.com/prisma/prisma/issues/7755
# FROM node:14-alpine AS runner
# RUN apk add --no-cache libc6-compat

FROM node:14 AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup --gecos 1001 --system nodejs
RUN adduser --system nextjs --uid 1001

# COPY --from=builder /app/typescript/web/next.config.js ./
COPY --from=builder /app/typescript/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/typescript/web/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node_modules/.bin/next", "start"]