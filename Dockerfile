# Stage 1: Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package manifests and workspace files
COPY package.json pnpm-lock.yaml tsconfig.base.json tsconfig.json ./
COPY api/tsconfig.json api/tsconfig.build.json ./api/
COPY Client/tsconfig.json ./Client/

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY api ./api
COPY Client ./Client

# Build API & Client
RUN pnpm run build

# Stage 2: Production runner stage
FROM node:24-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

ENV NODE_ENV=production
ENV PORT=3000

COPY package.json pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/api/dist ./api/dist
COPY --from=builder /app/Client/dist ./Client/dist

EXPOSE 3000

CMD ["node", "api/dist/main.js"]
