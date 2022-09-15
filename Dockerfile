# Installer
FROM node:16 as installer
WORKDIR /app
COPY . .
RUN npm ci

# Run
FROM node:16 as runner
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV NEXT_PUBLIC_PIPEBIRD_BASE_URL ${NEXT_PUBLIC_PIPEBIRD_BASE_URL}
ENV NEXT_PUBLIC_TLS ${NEXT_PUBLIC_TLS:-NO_TLS}
ENV PORT ${PORT:-375}
COPY --from=installer /app/ ./
RUN chmod +x ./start.sh
CMD ["./start.sh"]
