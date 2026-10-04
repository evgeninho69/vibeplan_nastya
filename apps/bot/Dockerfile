FROM node:23-alpine
ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
RUN corepack enable && corepack prepare pnpm@10.15.0 --activate

WORKDIR /app
COPY apps/bot ./apps/bot
RUN cd apps/bot && pnpm install --prefer-offline --frozen-lockfile=false

CMD ["node", "apps/bot/src/main.ts"]