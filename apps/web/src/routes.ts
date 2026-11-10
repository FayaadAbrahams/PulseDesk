import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),

  // Public
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("logout", "routes/logout.tsx"),
  route("status", "routes/status.tsx"),

  // Signed in: the layout's loader checks the session cookie on the server
  layout("routes/protected.tsx", [
    route("dashboard", "routes/dashboard.tsx"),
    route("tickets", "routes/tickets.tsx"),
    route("tickets/:id", "routes/ticket-detail.tsx"),
  ]),

  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
