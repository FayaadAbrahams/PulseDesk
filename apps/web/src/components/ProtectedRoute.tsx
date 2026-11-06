import {useAuth} from "../context/AuthContext";
import * as React from "react";
import {Navigate} from "react-router";
import {UserRole} from "@/types/types";


const ProtectedRoute = ({children, roles}: { children: React.ReactNode, roles?: UserRole[] }) => {
    const {user} = useAuth()

    if (!user) return <Navigate to="/login" replace/>

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/dashboard" replace/>
    }

    return children
}
export default ProtectedRoute;
