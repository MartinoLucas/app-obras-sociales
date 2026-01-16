# Dockerfile
# ---- base ----
FROM node:20-bullseye-slim AS base
# Habilitar pnpm via corepack
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app
# Instalar dependencias del sistema necesarias para Prisma
RUN apt-get update -y && apt-get install -y openssl ca-certificates procps && rm -rf /var/lib/apt/lists/*

# ---- deps (prod) ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# ---- dev ----
FROM base AS dev
COPY package.json pnpm-lock.yaml ./
# En dev instalamos todo (incluyendo devDependencies)
RUN pnpm install --frozen-lockfile
COPY prisma ./prisma
EXPOSE 3000
ENV PORT=3000
# El comando se sobreescribe en docker-compose, pero dejamos un default
CMD ["pnpm", "run", "dev"]

# ---- builder (prod) ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm dlx prisma generate
RUN pnpm run build

# ---- prod runtime ----
FROM base AS prod
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json ./
COPY prisma ./prisma
EXPOSE 3000
CMD ["pnpm", "start"]