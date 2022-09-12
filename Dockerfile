# Install dependencies only when needed
FROM node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV PIPEBIRD_BASE_URL ${NEXT_PUBLIC_PIPEBIRD_BASE_URL}
ENV PORT ${PORT:-375}
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

CMD ["node", ".next/standalone/server.js"]
