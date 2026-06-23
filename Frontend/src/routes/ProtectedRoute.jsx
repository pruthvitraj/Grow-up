import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const ProtectedRoute = () => {
    const token = useAuthStore((s) => s.token);
    const status = useAuthStore((s) => s.status);

    // Not logged in
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Logged in but profile under review
    if (status === "pending") {
        return <Navigate to="/" replace />;
    }

    // Access granted
    return <Outlet />;
};

export default ProtectedRoute;
