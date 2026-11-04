import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as React from "react";


const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
export default ProtectedRoute;
