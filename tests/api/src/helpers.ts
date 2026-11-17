import { randomUUID } from "node:crypto";
import mysql from "mysql2/promise";

export const API_URL = process.env.API_URL ?? "http://localhost:5286/api";

// Same defaults as compose.yaml. Override with the same variables as .env.
const dbConfig = {
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 3307),
  user: process.env.MYSQL_USER ?? "pulsedesk",
  password: process.env.MYSQL_PASSWORD ?? "pulsedesk-dev",
  database: process.env.MYSQL_DATABASE ?? "pulsedesk",
};

// The API sends and accepts enums as numbers (the C# enum order).
export const Status = {
  Open: 0,
  InProgress: 1,
  Resolved: 2,
  Closed: 3,
} as const;
export const Priority = { Low: 0, Medium: 1, High: 2 } as const;

export type Role = "Customer" | "Agent" | "Admin";

export interface TestUser {
  email: string;
  token: string;
}

export interface ApiResult<T> {
  status: number;
  body: T;
}

/** Calls the API and returns the HTTP status with the parsed JSON body (or null). */
export async function api<T = unknown>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  options: { token?: string; body?: unknown } = {},
): Promise<ApiResult<T>> {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  const text = await res.text();
  return { status: res.status, body: (text ? JSON.parse(text) : null) as T };
}

/**
 * Registers a fresh user and logs them in. Every call makes a new user,
 * so tests never share state and can run in any order.
 *
 * Registration always creates a Customer, so other roles are set in the
 * database before logging in (the role is baked into the JWT at login).
 */
export async function createUser(role: Role = "Customer"): Promise<TestUser> {
  const email = `test.${role.toLowerCase()}.${randomUUID()}@example.test`;
  const password = `pw-${randomUUID()}`;

  const register = await api("POST", "/auth/register", {
    body: { fullName: `Test ${role}`, email, password },
  });
  if (register.status !== 200) {
    throw new Error(
      `Register failed (${register.status}): ${JSON.stringify(register.body)}`,
    );
  }

  if (role !== "Customer") {
    await setRole(email, role);
  }

  const login = await api<{ token: string }>("POST", "/auth/login", {
    body: { email, password },
  });
  if (login.status !== 200) {
    throw new Error(
      `Login failed (${login.status}): ${JSON.stringify(login.body)}`,
    );
  }

  return { email, token: login.body.token };
}

/** Creates a ticket as the given customer and returns its id. */
export async function createTicket(
  customer: TestUser,
  fields: { title?: string; description?: string; priority?: number } = {},
): Promise<number> {
  const res = await api<{ ticketId: number }>("POST", "/tickets", {
    token: customer.token,
    body: {
      title: fields.title ?? "Regression test ticket",
      description: fields.description ?? "Created by tests/api",
      priority: fields.priority ?? Priority.Medium,
    },
  });
  if (res.status !== 201) {
    throw new Error(
      `Create ticket failed (${res.status}): ${JSON.stringify(res.body)}`,
    );
  }
  return res.body.ticketId;
}

async function setRole(email: string, role: Role): Promise<void> {
  const conn = await mysql.createConnection(dbConfig);
  try {
    await conn.execute("UPDATE Users SET Role = ? WHERE Email = ?", [
      role,
      email,
    ]);
  } finally {
    await conn.end();
  }
}
