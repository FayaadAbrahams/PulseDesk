import { redirect } from "react-router";

// "/" has no page of its own; the dashboard's guard sends signed-out users to /login.
export async function loader() {
    return redirect("/dashboard");
}
