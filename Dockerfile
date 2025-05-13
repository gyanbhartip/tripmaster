# Base stage for development dependencies
FROM oven/bun:alpine AS deps
WORKDIR /app
# Copy only package files first to leverage Docker cache
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Development stage with all dependencies
FROM oven/bun:alpine AS dev-deps
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Production dependencies stage
FROM oven/bun:alpine AS prod-deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --omit=dev

# Build stage
FROM oven/bun:alpine AS builder
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# Final production image
FROM oven/bun:alpine
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY package.json bun.lock ./

# Set production environment
ENV NODE_ENV=production

CMD ["bun", "run", "start"]