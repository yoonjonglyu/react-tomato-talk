FROM node:22-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml ./
COPY packages/server/package.json ./packages/server/

RUN pnpm install --frozen-lockfile

COPY packages/server ./packages/server
RUN pnpm --filter @tomato-talk/server build

EXPOSE 3001
CMD ["node", "packages/server/dist/index.js"]
