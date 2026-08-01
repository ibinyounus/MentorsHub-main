import { Navigate } from "react-router-dom";

export default function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  // Check if token exists AND if the role is explicitly 'admin'
  if (!token || role !== "admin") {
    // If they are a student or teacher trying to access admin, redirect them to their own dashboard
    // Or just send them to login to avoid confusion.
    return <Navigate to="/login" replace />;
  }

  return children;
}
