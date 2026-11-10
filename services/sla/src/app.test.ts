import { describe, it, expect, afterEach, beforeEach } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "./app.js";

describe("GET /health", () => {
  let app: FastifyInstance;

  beforeEach(() => {
    app = buildApp();
  });

  afterEach(async () => {
    await app.close();
  });

  it("returns 200 with status ok", async () => {
    const response = await app.inject({ method: "GET", url: "/health" });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({ status: "ok" });
  });
});
