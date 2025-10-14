FROM node:18-alpine AS base

ENV NODE_OPTIONS=--max-old-space-size=512

RUN apk add --no-cache libc6-compat openssl bash curl
RUN apk add --no-cache --virtual .build-deps gcc g++ make python3
RUN npm install -g pnpm@latest


# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json pnpn-lock.yaml* .env ./
RUN pnpm install

FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build with proper permissions
RUN pnpm prisma:generate && \
    pnpm build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000

# Create non-root user with proper permissions
RUN addgroup -g 1001 -S nodejs && \
    adduser -u 1001 -S nextjs -G nodejs && \
    mkdir -p .next && \
    chown -R nextjs:nodejs .next

# Copy files from builder with correct ownership
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]