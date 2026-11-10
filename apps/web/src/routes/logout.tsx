import { redirect } from "react-router";
import type { Route } from "./+types/logout";
import { logout } from "@/lib/auth.server";

// POST only, so a link or prefetch can't sign someone out by accident.
export async function action({ request }: Route.ActionArgs) {
    return logout(request);
}

export async function loader() {
    return redirect("/dashboard");
}
