export interface User {
    fullName: string;
    email: string;
    role: UserRole;
}

export const USER_ROLES = ["Customer", "Agent", "Admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function isUserRole(value: unknown): value is UserRole {
    return typeof value === "string" && (USER_ROLES as readonly string[]).includes(value);
}