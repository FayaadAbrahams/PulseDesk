import {createContext, useContext} from "react";
import {AuthContextType} from "@/types/types";

const outsideProvider = () => {
    throw new Error("useAuth must be used within the AuthProvider");
};
const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => outsideProvider(),
    registerUser: async () => outsideProvider(),
    logout: () => outsideProvider()
});
const useAuth = () => useContext(AuthContext);

export {AuthContext, useAuth};