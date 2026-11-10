import { data, redirect } from "react-router";
import type { Route } from "./+types/login";
import { apiUrl } from "@/lib/api.server";
import { getUser } from "@/lib/auth.server";
import { commitSession, getSession } from "@/lib/session.server";
import { isUserRole } from "@/types/types";
import LoginForm from "@/pages/Login";

const API_TIMEOUT_MS = 5000;

export async function loader({ request }: Route.LoaderArgs) {
  if (await getUser(request)) throw redirect("/dashboard");
  return null;
}
const UNAVAILABLE = "Login is unavailable right now. Please try again.";

// Runs on the server only. The browser posts the form here; the JWT from the API is
// stored in the httpOnly session cookie and never reaches browser JavaScript.
export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");

  let response: Response;
  try {
    response = await fetch(apiUrl("/auth/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
  } catch {
    return data({ error: UNAVAILABLE }, { status: 503 });
  }

  if (response.status === 401) {
    return data({ error: "Invalid email or password." }, { status: 401 });
  }
  if (!response.ok) {
    return data({ error: UNAVAILABLE }, { status: 503 });
  }

  const body = await response.json();
  if (typeof body?.token !== "string" || !isUserRole(body.role)) {
    return data({ error: UNAVAILABLE }, { status: 503 });
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("token", body.token);
  session.set("user", {
    fullName: body.fullName ?? "",
    email: body.email ?? email,
    role: body.role,
  });

  return redirect("/dashboard", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}

export default function Login({ actionData }: Route.ComponentProps) {
  return <LoginForm error={actionData?.error} />;
}
