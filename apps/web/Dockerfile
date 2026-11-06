# syntax=docker/dockerfile:1
# PulseDesk web tier (React Router framework mode, SSR). Build context: apps/web.
#
# Linux image for linux/amd64 and linux/arm64: runs on Linux, macOS and Windows (Docker Desktop, WSL 2).
# "slim" is Debian-based (glibc), which the build's native tools (Vite, Tailwind) need.
ARG NODE_VERSION=26

# Build on the machine's own platform. The server and client bundles are plain
# JavaScript and CSS, so they run on any architecture.
FROM --platform=$BUILDPLATFORM node:${NODE_VERSION}-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime: production dependencies (react-router-serve and the React runtime) plus the build output.
FROM node:${NODE_VERSION}-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/build ./build
USER node
# react-router-serve reads PORT (default 3000).
EXPOSE 3000
CMD ["node_modules/.bin/react-router-serve", "./build/server/index.js"]
