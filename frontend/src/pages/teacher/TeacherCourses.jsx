import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCoursesByTeacher } from "../../services/adminService";

export default function TeacherCourses() {
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            const id = localStorage.getItem("userIdentifier");
            if (id) {
                try {
                    const data = await getCoursesByTeacher(id);
                    setCourses(data);
                } catch (e) {
                    console.error("Error fetching courses", e);
                }
            }
            setLoading(false);
        };
        fetchCourses();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate("/teacher/dashboard")}
                    className="mb-8 text-gray-500 hover:text-black flex items-center gap-2"
                >
                    &larr; Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Assigned Courses</h1>

                {loading && <p>Loading...</p>}

                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courses.map(course => (
                            <div
                                key={course._id}
                                onClick={() => navigate(`/teacher/courses/${course._id}`)}
                                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg cursor-pointer transition group"
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">{course.name}</h2>
                                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Course ID: {course.courseId}</p>
                                <div className="flex items-center gap-2 text-gray-600 text-sm">
                                    <span className="bg-gray-100 px-2 py-1 rounded">Batch: {course.batch?.name} ({course.batch?.batchId})</span>
                                </div>
                                {course.comment && <p className="mt-4 text-gray-500 italic">"{course.comment}"</p>}

                                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-sm font-semibold">Manage Tests & Marks</span>
                                    <span className="text-xl">&rarr;</span>
                                </div>
                            </div>
                        ))}
                        {courses.length === 0 && <p className="text-center text-gray-400 col-span-2">No assigned courses found for your ID.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
