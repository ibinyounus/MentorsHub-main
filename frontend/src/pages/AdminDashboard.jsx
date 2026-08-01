import { Link, useNavigate } from "react-router-dom";
import { logout } from "../services/adminService";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b pb-4">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 font-semibold text-sm"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/admin/teachers" className="block">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 text-center cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Teacher Management</h2>
              <p className="text-gray-500">Add, Search, and Edit Teachers</p>
            </div>
          </Link>

          <Link to="/admin/teacher-class" className="block">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 text-center cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">
                Teacher Class Management
              </h2>
              <p className="text-gray-500">
                Add, Search and Delete Teacher Class Records
              </p>
            </div>
          </Link>

          <Link to="/admin/students" className="block">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 text-center cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Student Management</h2>
              <p className="text-gray-500">Add, Search, and Edit Students</p>
            </div>
          </Link>

          <Link to="/admin/attendance" className="block">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 text-center cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Attendance Management</h2>
              <p className="text-gray-500">Mark and Track Student/Teacher Attendance</p>
            </div>
          </Link>

          <Link to="/admin/payments" className="block">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 text-center cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Payment Management</h2>
              <p className="text-gray-500">Track Student Fees and Teacher Salaries</p>
            </div>
          </Link>

          <Link to="/admin/class/batches" className="block md:col-span-2">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 text-center cursor-pointer">
              <h2 className="text-xl font-semibold mb-2">Class Management</h2>
              <p className="text-gray-500">Batches, Courses, Tests, and Marks</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
