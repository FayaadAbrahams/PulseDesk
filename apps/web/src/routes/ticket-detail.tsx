import type { Route } from "./+types/ticket-detail";
import { requireUser } from "@/lib/auth.server";
import TicketDetail from "@/pages/TicketDetail";

export async function loader({ request }: Route.LoaderArgs) {
    await requireUser(request, ["Admin", "Agent"]);
    return null;
}

export default function TicketDetailRoute() {
    return <TicketDetail />;
}
