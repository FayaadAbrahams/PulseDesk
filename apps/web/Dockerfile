# syntax=docker/dockerfile:1
# PulseDesk web tier (React Router framework mode, SSR).
# Build context: the repo root (npm workspaces), so the root package-lock.json is visible.
#   docker build -f apps/web/Dockerfile .
#
# Linux image for linux/amd64 and linux/arm64: runs on Linux, macOS and Windows (Docker Desktop, WSL 2).
# "slim" is Debian-based (glibc), which the build's native tools (Vite, Tailwind) need.
ARG NODE_VERSION=26

# Build on the machine's own platform. The server and client bundles are plain
# JavaScript and CSS, so they run on any architecture.
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION}-slim AS build
WORKDIR /app
# Manifests only, so the install layer stays cached until dependencies change.
# npm checks the lockfile against every workspace the root declares, so each
# workspace's package.json must be present, even the ones this image doesn't build.
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY services/sla/package.json services/sla/
RUN npm ci --workspace apps/web
COPY apps/web apps/web
RUN npm run build --workspace apps/web

# Runtime: production dependencies (react-router-serve and the React runtime) plus the build output.
FROM node:${NODE_VERSION}-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY services/sla/package.json services/sla/
RUN npm ci --workspace apps/web --omit=dev && npm cache clean --force
# Keep the monorepo layout: Node finds hoisted packages in /app/node_modules by
# walking up from /app/apps/web.
COPY --from=build /app/apps/web/build apps/web/build
WORKDIR /app/apps/web
USER node
# react-router-serve reads PORT (default 3000). Its binary is hoisted to the root node_modules.
EXPOSE 3000
CMD ["/app/node_modules/.bin/react-router-serve", "./build/server/index.js"]
