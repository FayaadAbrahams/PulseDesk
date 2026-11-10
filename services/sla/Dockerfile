# syntax=docker/dockerfile:1
# PulseDesk SLA service (Fastify).
# Build context: the repo root (npm workspaces), so the root package-lock.json is visible.
#   docker build -f services/sla/Dockerfile .
#
# Linux image for linux/amd64 and linux/arm64: runs on Linux, macOS and Windows (Docker Desktop, WSL 2).
# "slim" is Debian-based (glibc), which avoids the musl issues Alpine can have with native npm packages.
ARG NODE_VERSION=26

# Compile TypeScript on the machine's own platform. The output is plain JavaScript,
# so it runs on any architecture and this stage never needs emulation.
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION}-slim AS build
WORKDIR /app
# Manifests only, so the install layer stays cached until dependencies change.
# npm checks the lockfile against every workspace the root declares, so each
# workspace's package.json must be present, even the ones this image doesn't build.
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY services/sla/package.json services/sla/
RUN npm ci --workspace services/sla
COPY services/sla/tsconfig.json services/sla/
COPY services/sla/src services/sla/src
RUN npm run build --workspace services/sla

# Runtime: production dependencies only, installed for the target platform.
FROM node:${NODE_VERSION}-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY services/sla/package.json services/sla/
RUN npm ci --workspace services/sla --omit=dev && npm cache clean --force
# Keep the monorepo layout: Node finds hoisted packages in /app/node_modules by
# walking up from /app/services/sla.
COPY --from=build /app/services/sla/dist services/sla/dist
WORKDIR /app/services/sla
# The official Node images ship a non-root "node" user.
USER node
EXPOSE 3001
# Run node directly (not "npm start") so SIGTERM reaches the app's shutdown handler.
CMD ["node", "dist/server.js"]
