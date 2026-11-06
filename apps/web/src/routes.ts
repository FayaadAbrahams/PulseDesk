import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
    route("status", "routes/status.tsx"),
    route("*?", "catchall.tsx"),
] satisfies RouteConfig;