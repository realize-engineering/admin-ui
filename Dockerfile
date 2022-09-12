ARG PIPEBIRD_BASE_URL ${NEXT_PUBLIC_PIPEBIRD_BASE_URL}
ARG PORT ${PORT:-375}

# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci


# Rebuild the source code only when needed
FROM node:16-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1

ARG PORT
ARG PIPEBIRD_BASE_URL

ENV PORT $PORT
ENV NEXT_PUBLIC_PIPEBIRD_BASE_URL $PIPEBIRD_BASE_URL

# If using npm comment out above and use below instead
RUN npm run build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ARG PORT
ARG PIPEBIRD_BASE_URL

ENV PORT $PORT
ENV NEXT_PUBLIC_PIPEBIRD_BASE_URL $PIPEBIRD_BASE_URL

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

CMD ["node", "server.js"]
