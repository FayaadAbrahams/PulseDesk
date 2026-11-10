import { data, redirect } from "react-router";
import type { Route } from "./+types/register";
import { apiUrl } from "@/lib/api.server";
import { getUser } from "@/lib/auth.server";
import SignupForm from "@/pages/Register";

const API_TIMEOUT_MS = 5000;
const UNAVAILABLE = "Registration is unavailable right now. Please try again.";

export async function loader({ request }: Route.LoaderArgs) {
    if (await getUser(request)) throw redirect("/dashboard");
    return null;
}

// The form validates in the browser first; the API is still the source of truth.
export async function action({ request }: Route.ActionArgs) {
    const form = await request.formData();
    const fullName = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    let response: Response;
    try {
        response = await fetch(apiUrl("/auth/register"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fullName, email, password }),
            signal: AbortSignal.timeout(API_TIMEOUT_MS),
        });
    } catch {
        return data({ error: UNAVAILABLE }, { status: 503 });
    }

    if (response.ok) return redirect("/login");

    if (response.status === 400) {
        const body = await response.json().catch(() => null);
        const message = typeof body?.message === "string" ? body.message : "Registration failed.";
        return data({ error: message }, { status: 400 });
    }

    return data({ error: UNAVAILABLE }, { status: 503 });
}

export default function Register({ actionData }: Route.ComponentProps) {
    return <SignupForm error={actionData?.error} />;
}
