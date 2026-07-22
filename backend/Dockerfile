# Base image
FROM node:20-alpine AS builder

# Working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code and configurations
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS app
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 3001

# Run migrations and start the NestJS production server
CMD npx prisma migrate deploy && npm run start:prod
