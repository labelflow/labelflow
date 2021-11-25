################################################################################
# Needs to be run from the root of the monorepo, like this:
# docker build --file=./typescript/web/Dockerfile .
#
# inspired from:
# https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

################################################################################
# Build the web app
FROM node:14-alpine AS builder

WORKDIR /app

# Maybe only copy what's needed
COPY . .

RUN yarn install --immutable

RUN yarn build:web

################################################################################
# Run the web server
FROM node:14-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# COPY --from=builder /app/typescript/web/next.config.js ./
COPY --from=builder /app/typescript/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/typescript/web/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node_modules/.bin/next", "start"]