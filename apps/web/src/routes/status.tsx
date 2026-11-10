import type { Route } from "./+types/status";

type SlaStatus = "ok" | "down";

const DEFAULT_SLA_URL = "http://localhost:3001";
const SLA_TIMEOUT_MS = 2000;

// Runs on the server only: React Router strips loaders from the client bundle,
// so the browser never talks to the SLA service directly.
export async function loader(
  _args: Route.LoaderArgs,
): Promise<{ status: SlaStatus }> {
  // Read per request (not at module load) so the URL can differ per environment.
  const baseUrl = process.env.SLA_URL ?? DEFAULT_SLA_URL;

  try {
    const response = await fetch(`${baseUrl}/health`, {
      signal: AbortSignal.timeout(SLA_TIMEOUT_MS),
    });
    if (!response.ok) return { status: "down" };

    const body: unknown = await response.json();
    const healthy =
      typeof body === "object" &&
      body !== null &&
      "status" in body &&
      body.status === "ok";
    return { status: healthy ? "ok" : "down" };
  } catch {
    // Unreachable, timed out or invalid JSON: show the outage, don't crash the page.
    return { status: "down" };
  }
}

export default function Status({ loaderData }: Route.ComponentProps) {
  const isOk = loaderData.status === "ok";

  return (
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-lg">
        SLA service:{" "}
        <span
          className={
            isOk ? "font-semibold text-green-600" : "font-semibold text-red-600"
          }
        >
          {loaderData.status}
        </span>
      </p>
    </main>
  );
}
