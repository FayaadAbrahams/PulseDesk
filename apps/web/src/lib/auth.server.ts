import { redirect } from "react-router";
import type { User, UserRole } from "@/types/types";
import { apiUrl } from "./api.server";
import { destroySession, getSession } from "./session.server";

const API_TIMEOUT_MS = 5000;

export async function getUser(request: Request): Promise<User | null> {
    const session = await getSession(request.headers.get("Cookie"));
    return session.get("user") ?? null;
}

// Use in a loader or action. Throws a redirect, so the route never renders for the wrong user.
export async function requireUser(request: Request, roles?: UserRole[]): Promise<User> {
    const session = await getSession(request.headers.get("Cookie"));
    const user = session.get("user");
    const token = session.get("token");

    if (!user || !token) throw redirect("/login");
    if (roles && !roles.includes(user.role)) throw redirect("/dashboard");

    return user;
}

export async function logout(request: Request): Promise<Response> {
    const session = await getSession(request.headers.get("Cookie"));
    return redirect("/login", {
        headers: { "Set-Cookie": await destroySession(session) },
    });
}

// Server-side call to the .NET API on behalf of the signed-in user. The API stays
// bearer-only; the web tier adds the token from the session cookie.
// An expired or revoked token signs the user out instead of failing the page.
export async function apiFetch(request: Request, path: string, init: RequestInit = {}): Promise<Response> {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("token");
    if (!token) throw redirect("/login");

    const headers = new Headers(init.headers);
    headers.set("Authorization", `Bearer ${token}`);
    if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

    const response = await fetch(apiUrl(path), {
        ...init,
        headers,
        signal: init.signal ?? AbortSignal.timeout(API_TIMEOUT_MS),
    });

    if (response.status === 401) throw await logout(request);

    return response;
}
