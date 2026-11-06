# syntax=docker/dockerfile:1
# PulseDesk API image. Build context: services/api (see compose.yaml at the repo root).
#
# Linux image published for linux/amd64 and linux/arm64, so it runs on Linux, macOS
# (Intel and Apple Silicon) and Windows (Docker Desktop with WSL 2, its default engine).
# Stage names (base, build, publish, final) match what Visual Studio and Rider container tooling expect.

# Runtime base. Visual Studio "fast mode" debugging also starts from this stage.
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
# .NET 8+ images listen on 8080 by default (ASPNETCORE_HTTP_PORTS).
EXPOSE 8080
# Run as the non-root user that ships with the .NET images (uid 1654).
USER $APP_UID

# Build on the machine's own platform and cross-compile with -a $TARGETARCH,
# so an arm64 image builds on an x64 machine (and vice versa) without emulation.
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:10.0 AS build
ARG TARGETARCH
WORKDIR /src
# Restore first, from the project file alone, so the restore layer is cached until dependencies change.
COPY ["PulseDesk/PulseDesk.csproj", "PulseDesk/"]
RUN dotnet restore "PulseDesk/PulseDesk.csproj" -a $TARGETARCH
COPY . .
WORKDIR /src/PulseDesk

FROM build AS publish
# ARGs are scoped to a stage, so declare them again here.
ARG TARGETARCH
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "PulseDesk.csproj" -c $BUILD_CONFIGURATION -a $TARGETARCH --no-restore -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "PulseDesk.dll"]
