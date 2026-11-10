import { describe, it, expect, vi, afterEach } from "vitest";
import { loader } from "./status";

type LoaderArgs = Parameters<typeof loader>[0];

const args = {
  request: new Request("http://localhost/status"),
  params: {},
  context: {},
} as unknown as LoaderArgs;

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("status route loader", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("returns ok when the SLA service is healthy", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ status: "ok" })),
    );

    const result = await loader(args);

    expect(result).toEqual({ status: "ok" });
  });

  it("calls /health on localhost:3001 by default", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ status: "ok" }));
    vi.stubGlobal("fetch", fetchMock);

    await loader(args);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3001/health",
      expect.anything(),
    );
  });

  it("uses SLA_URL when it is set", async () => {
    vi.stubEnv("SLA_URL", "http://sla:3001");
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ status: "ok" }));
    vi.stubGlobal("fetch", fetchMock);

    await loader(args);

    expect(fetchMock).toHaveBeenCalledWith(
      "http://sla:3001/health",
      expect.anything(),
    );
  });

  it("passes an abort signal so a slow SLA cannot hang the page", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ status: "ok" }));
    vi.stubGlobal("fetch", fetchMock);

    await loader(args);

    const init = fetchMock.mock.calls[0][1];
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it("returns down when the SLA service is unreachable", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new TypeError("fetch failed")),
    );

    const result = await loader(args);

    expect(result).toEqual({ status: "down" });
  });

  it("returns down when the SLA service responds with an error status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ error: "boom" }, 503)),
    );

    const result = await loader(args);

    expect(result).toEqual({ status: "down" });
  });
});
