import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchTeachers } from "../services/adminService";

export default function TeacherDashboard() {
    const navigate = useNavigate();
    const [userName, setUserName] = useState(localStorage.getItem("userName") || "Teacher");
    const [userInstitution, setUserInstitution] = useState(localStorage.getItem("userInstitution") || "");
    const userId = localStorage.getItem("userIdentifier") || "N/A";

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    // Self-healing: Fetch name if missing
    useEffect(() => {
        const fetchProfile = async () => {
            if (userId && userId !== "N/A" && (userName === "Teacher" || !userName)) {
                try {
                    const results = await searchTeachers(userId);
                    const me = results.find(t => t.teacherId === userId);
                    if (me) {
                        setUserName(me.name);
                        setUserInstitution(me.institution || "");
                        localStorage.setItem("userName", me.name);
                        if (me.institution) localStorage.setItem("userInstitution", me.institution);
                    }
                } catch (e) {
                    console.error("Failed to fetch profile", e);
                }
            }
        };
        fetchProfile();
    }, [userId, userName]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-12 bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4 md:gap-0">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome, {userName}</h1>
                        <p className="text-gray-500 mt-1 text-sm md:text-base">ID: {userId} {userInstitution && `• ${userInstitution}`}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-red-500 font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition"
                    >
                        Logout
                    </button>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div
                        onClick={() => navigate("/teacher/attendance")}
                        className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border border-gray-200 group"
                    >
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                            <span className="text-2xl group-hover:text-white">📅</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Attendance</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Check your daily attendance records for the last 30 days.
                        </p>
                    </div>

                    <div
                        onClick={() => navigate("/teacher/payments")}
                        className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border border-gray-200 group"
                    >
                        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
                            <span className="text-2xl group-hover:text-white">💰</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Payments</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            View your salary history and payment remarks.
                        </p>
                    </div>

                    <div
                        onClick={() => navigate("/teacher/class-history")}
                        className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border border-gray-200 group"
                    >
                        <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-yellow-500 transition-colors">
                            <span className="text-2xl group-hover:text-white">📘</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Class Records</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            See your teacher class records added by admin.
                        </p>
                    </div>

                    <div
                        onClick={() => navigate("/teacher/courses")}
                        className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border border-gray-200 group"
                    >
                        <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                            <span className="text-2xl group-hover:text-white">📚</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Courses</h2>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Manage assigned courses, create tests, and enter student marks.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
