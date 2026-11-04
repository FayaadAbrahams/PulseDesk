import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import * as React from 'react';
import { AuthContextType, User } from "@/types/types";

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => { },
  registerUser: async () => { },
  logout: () => { },
  loading: false
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token: string | null = localStorage.getItem("token");
    const savedUser: string | null = localStorage.getItem("user");

    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<string> => {
    const response = await api.post("/auth/login", { email, password });
    const { token, fullName, role } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        fullName,
        role,
        email,
      }),
    );

    setUser({ fullName: fullName ?? "", role: role ?? "", email: email ?? "" });
    return role;
  };

  const registerUser = async (fullName: string, email: string, password: string) => {
    await api.post("auth/register", { fullName, email, password })
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, registerUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
