import { defineConfig } from "vitest/config";

// These tests call the real API and MySQL, so the Docker stack must be running:
//   docker compose up -d
// They are kept out of the root `npm test` (unit tests only). Run them with:
//   npm run test:api
export default defineConfig({
  test: {
    name: "api",
    include: ["src/**/*.test.ts"],
    globalSetup: ["src/global-setup.ts"],
    testTimeout: 15_000,
  },
});
