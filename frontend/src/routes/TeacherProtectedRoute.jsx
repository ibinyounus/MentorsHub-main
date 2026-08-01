import { Navigate } from "react-router-dom";

export default function TeacherProtectedRoute({ children }) {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (!token || role !== "teacher") {
        return <Navigate to="/login" replace />;
    }

    return children;
}
