import { createCookieSessionStorage } from "react-router";
import type { User } from "@/types/types";

type SessionData = {
  token: string;
  user: User;
};

const DEV_SESSION_SECRET = "local-dev-only-session-secret-change-me";

const sessionSecret = process.env.SESSION_SECRET ?? DEV_SESSION_SECRET;

if (
  process.env.NODE_ENV === "production" &&
  sessionSecret === DEV_SESSION_SECRET
) {
  throw new Error("SESSION_SECRET must be set in production.");
}

// The JWT lives only in this httpOnly cookie, so browser JavaScript can never read it.
// The cookie is signed, so a tampered value is rejected rather than trusted.
const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "__session",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    // Matches the API's default JWT lifetime (JwtSettings:ExpiryDays = 7).
    maxAge: 60 * 60 * 24 * 7,
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
