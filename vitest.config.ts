import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: ["services/sla/", "apps/web/"],
  },
});
