# ---- base ----
FROM node:20-bullseye-slim AS base
WORKDIR /app
ENV CI=true
# OpenSSL + certs (para Prisma engine)
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# ---- deps (prod) ----
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ---- dev ----
FROM base AS dev
COPY package.json package-lock.json* ./
RUN npm ci
COPY prisma ./prisma
EXPOSE 3000
ENV PORT=3000
CMD ["npm", "run", "dev"]

# ---- builder (prod) ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- prod runtime ----
FROM base AS prod
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY package.json ./
COPY prisma ./prisma
EXPOSE 3000
CMD ["npm", "run", "start"]
