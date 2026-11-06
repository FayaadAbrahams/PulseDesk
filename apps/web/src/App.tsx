import {AuthProvider} from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Tickets from "./pages/Tickets";
import TicketDetail from "./pages/TicketDetail";
import "./styles/styles.css";
import {Toaster} from "./components/ui/sonner";
import {Navigate, Route, Routes} from "react-router";

function App() {
    return (
        <AuthProvider>
            <Toaster/>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>

                {/* Protected routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute roles={["Admin, Agent, User"]}>
                            <Dashboard/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tickets"
                    element={
                        <ProtectedRoute roles={["Admin, Agent"]}>
                            <Tickets/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/tickets/:id"
                    element={
                        <ProtectedRoute roles={["Admin, Agent"]}>
                            <TicketDetail/>
                        </ProtectedRoute>
                    }
                />
                {/* Default redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace/>}/>
            </Routes>
        </AuthProvider>
    );
}

export default App;
