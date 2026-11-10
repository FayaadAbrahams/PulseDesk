export interface User {
    fullName: string;
    email: string;
    role: UserRole;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<UserRole>;
    registerUser: (
        fullName: string,
        email: string,
        password: string,
    ) => Promise<void>;
    logout: () => void;
}

export const USER_ROLES = ["Customer", "Agent", "Admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export function isUserRole(value: unknown): value is UserRole {
    return typeof value === "string" && (USER_ROLES as readonly string[]).includes(value);
}