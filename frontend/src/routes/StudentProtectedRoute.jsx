import { Navigate } from "react-router-dom";

export default function StudentProtectedRoute({ children }) {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (!token || role !== "student") {
        return <Navigate to="/login" replace />;
    }

    return children;
}
