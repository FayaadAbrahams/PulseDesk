import { data, Link } from "react-router";

export async function loader() {
  return data(null, { status: 404 });
}

export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-2">
      <p className="text-lg">Page not found.</p>
      <Link to="/dashboard" className="underline underline-offset-4">
        Back to the dashboard
      </Link>
    </main>
  );
}
