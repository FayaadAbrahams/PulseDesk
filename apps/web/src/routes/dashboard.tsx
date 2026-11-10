import type { Route } from "./+types/dashboard";
import { requireUser } from "@/lib/auth.server";
import Dashboard from "@/pages/Dashboard";

export async function loader({ request }: Route.LoaderArgs) {
  await requireUser(request, ["Admin", "Agent", "Customer"]);
  return null;
}

export default function DashboardRoute() {
  return <Dashboard />;
}
