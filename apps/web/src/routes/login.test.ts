import { describe, it, expect, vi, afterEach } from "vitest";
import { action } from "./login";

type ActionArgs = Parameters<typeof action>[0];

function loginRequest(email: string, password: string) {
  const body = new URLSearchParams({ email, password });
  return new Request("http://localhost/login", { method: "POST", body });
}

function argsFor(request: Request) {
  return { request, params: {}, context: {} } as unknown as ActionArgs;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

describe("login route action", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("redirects to /dashboard and sets an httpOnly, SameSite=Lax session cookie for valid credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        jsonResponse({ token: "jwt-123", fullName: "Dan Whoa", email: "dan@example.com", role: "Agent" }),
      ),
    );

    const response = await action(argsFor(loginRequest("dan@example.com", "correct-password")));

    expect(response).toBeInstanceOf(Response);
    const res = response as Response;
    expect(res.status).toBe(302);
    expect(res.headers.get("Location")).toBe("/dashboard");

    const cookie = res.headers.get("Set-Cookie") ?? "";
    expect(cookie).toMatch(/HttpOnly/i);
    expect(cookie).toMatch(/SameSite=Lax/i);
  });

  it("returns an error and sets no cookie when the API rejects the credentials", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(jsonResponse({ message: "Invalid Credentials" }, 401)),
    );

    const result = await action(argsFor(loginRequest("dan@example.com", "wrong-password")));

    expect(result).not.toBeInstanceOf(Response);
    expect(result).toMatchObject({
      data: { error: "Invalid email or password." },
      init: { status: 401 },
    });
  });

  it("returns a service error instead of crashing when the API is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    const result = await action(argsFor(loginRequest("dan@example.com", "correct-password")));

    expect(result).toMatchObject({
      data: { error: "Login is unavailable right now. Please try again." },
      init: { status: 503 },
    });
  });

  it("sends the submitted credentials to the API's login endpoint", async () => {
    vi.stubEnv("API_URL", "http://api:8080");
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ message: "Invalid Credentials" }, 401));
    vi.stubGlobal("fetch", fetchMock);

    await action(argsFor(loginRequest("dan@example.com", "secret")));

    expect(fetchMock).toHaveBeenCalledWith(
      "http://api:8080/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "dan@example.com", password: "secret" }),
      }),
    );
  });
});
