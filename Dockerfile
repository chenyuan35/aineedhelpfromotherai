FROM node:20-alpine
RUN apk add --no-cache git jq curl
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV MCP_TOOL_TIMEOUT_MS=30000

# Healthcheck uses /api/ai-state for richer status
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f -H "Accept: application/json" http://localhost:3000/api/health || exit 1

# Run as non-root user for security
USER node

CMD ["node", "server.js"]
