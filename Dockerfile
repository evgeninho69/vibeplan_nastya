# Корень-уровневый Dockerfile для Dokploy.
# Build context = / (корень монорепо). Копирует весь репо и собирает Next.js app.
FROM node:23-alpine AS base
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

WORKDIR /app

# Зависимости: сначала манифесты для кэша.
COPY pnpm-workspace.yaml package.json ./
COPY tsconfig.base.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ui/package.json ./packages/ui/
COPY packages/shared/package.json ./packages/shared/
COPY packages/db/package.json ./packages/db/
RUN pnpm install --prefer-offline --frozen-lockfile=false

# Исходники.
COPY packages ./packages
COPY apps ./apps

# Prune dev deps для прод-сборки.
RUN pnpm --filter @vibeplan/web --prod deploy /tmp/vibeplan-pruned

# Build.
ENV NEXT_TELEMETRY_DISABLED=1
RUN cd apps/web && pnpm exec next build

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["pnpm", "--filter", "@vibeplan/web", "start"]