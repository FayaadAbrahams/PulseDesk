import { Form, Outlet } from "react-router";
import type { Route } from "./+types/protected";
import { requireUser } from "@/lib/auth.server";
import { Button } from "@/components/ui/button";

// Layout for every signed-in page. The loader runs on the server for each request,
// so signed-out users are redirected before any protected HTML is rendered.
export async function loader({ request }: Route.LoaderArgs) {
    const user = await requireUser(request);
    return { user };
}

export default function Protected({ loaderData }: Route.ComponentProps) {
    const { user } = loaderData;

    return (
        <div className="min-h-svh">
            <header className="flex items-center justify-between border-b px-6 py-3">
                <span className="font-semibold">PulseDesk</span>
                <div className="flex items-center gap-4 text-sm">
                    <span>
                        {user.fullName} ({user.role})
                    </span>
                    <Form method="post" action="/logout">
                        <Button type="submit" variant="outline" size="sm">
                            Log out
                        </Button>
                    </Form>
                </div>
            </header>
            <Outlet />
        </div>
    );
}
