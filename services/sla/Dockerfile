# syntax=docker/dockerfile:1
# PulseDesk SLA service (Fastify). Build context: services/sla.
#
# Linux image for linux/amd64 and linux/arm64: runs on Linux, macOS and Windows (Docker Desktop, WSL 2).
# "slim" is Debian-based (glibc), which avoids the musl issues Alpine can have with native npm packages.
ARG NODE_VERSION=26

# Compile TypeScript on the machine's own platform. The output is plain JavaScript,
# so it runs on any architecture and this stage never needs emulation.
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION}-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Runtime: production dependencies only, installed for the target platform.
FROM node:${NODE_VERSION}-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
# The official Node images ship a non-root "node" user.
USER node
EXPOSE 3001
# Run node directly (not "npm start") so SIGTERM reaches the app's shutdown handler.
CMD ["node", "dist/server.js"]
