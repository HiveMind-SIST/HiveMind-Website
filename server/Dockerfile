# ==============================================================================
# Multi-Stage Dockerfile for HiveMind Express/TypeScript Backend
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build & Compile TypeScript
# ------------------------------------------------------------------------------
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Install all dependencies (including devDependencies for TypeScript compilation)
COPY package*.json ./
RUN npm ci

# Copy TypeScript configuration and source code
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript into JavaScript (dist/)
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 2: Production Runtime
# ------------------------------------------------------------------------------
FROM node:20-bookworm-slim AS runner

WORKDIR /app

# Set production environment flags
ENV NODE_ENV=production
ENV PORT=5000

# Install ONLY production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled JavaScript files from the builder stage
COPY --from=builder --chown=node:node /app/dist ./dist

# Ensure app directory permissions belong to non-root node user
RUN chown -R node:node /app

# Switch to non-root user for security
USER node

# Expose API port
EXPOSE 5000

# Built-in lightweight Docker health check verifying /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:5000/health', (r) => {if (r.statusCode === 200) process.exit(0); else process.exit(1);})" || exit 1

# Start the compiled Express production server
CMD ["node", "dist/server.js"]
