import {useEffect, useState} from "react";
import api from "../api/axios";
import * as React from 'react';
import {isUserRole, User, UserRole} from "@/types/types";
import {AuthContext} from "./auth";


export const AuthProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const token: string | null = localStorage.getItem("token");
        const savedUser: string | null = localStorage.getItem("user");

        if (token && savedUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- restores the session from localStorage on mount; TODO replaced by cookie auth in KAN-27
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = async (email: string, password: string): Promise<UserRole> => {
        const response = await api.post("/auth/login", {email, password});
        const {token, fullName, role} = response.data;

        if (!isUserRole(role)) {
            throw new Error("Unexpected role from API");
        }

        localStorage.setItem("token", token);
        localStorage.setItem(
            "user",
            JSON.stringify({
                fullName,
                role,
                email,
            }),
        );
        setUser({fullName: fullName ?? "", role: role, email: email ?? ""});
        return role;
    };

    const registerUser = async (fullName: string, email: string, password: string) => {
        await api.post("auth/register", {fullName, email, password})
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{user, login, registerUser, logout}}>
            {children}
        </AuthContext.Provider>
    );
};
