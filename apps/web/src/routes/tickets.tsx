import type { Route } from "./+types/tickets";
import { requireUser } from "@/lib/auth.server";
import Tickets from "@/pages/Tickets";

export async function loader({ request }: Route.LoaderArgs) {
    await requireUser(request, ["Admin", "Agent"]);
    return null;
}

export default function TicketsRoute() {
    return <Tickets />;
}
