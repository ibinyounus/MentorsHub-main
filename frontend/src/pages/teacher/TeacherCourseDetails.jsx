import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getCourseById,
    createTest,
    getTestsByCourse,
    deleteTest
} from "../../services/adminService";

export default function TeacherCourseDetails() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);

    // Tests
    const [tests, setTests] = useState([]);
    const [testForm, setTestForm] = useState({ name: "", date: "", comment: "" });

    useEffect(() => {
        loadData();
    }, [courseId]);

    const loadData = async () => {
        try {
            const cData = await getCourseById(courseId);
            setCourse(cData);
            const tData = await getTestsByCourse(courseId);
            setTests(tData);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreateTest = async (e) => {
        e.preventDefault();
        await createTest({ ...testForm, courseId });
        const tData = await getTestsByCourse(courseId);
        setTests(tData);
        setTestForm({ name: "", date: "", comment: "" });
    };

    const handleDeleteTest = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Delete this test and all results?")) {
            await deleteTest(id);
            const tData = await getTestsByCourse(courseId);
            setTests(tData);
        }
    }

    if (!course) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-8 font-sans">
            <button
                onClick={() => navigate(`/teacher/courses`)}
                className="mb-8 text-gray-600 hover:text-black flex items-center gap-2"
            >
                &larr; Back to My Courses
            </button>

            {/* Header - Read Only */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-10">
                <div className="mb-2">
                    <h1 className="text-4xl font-bold text-gray-900">{course.name}</h1>
                    <p className="text-gray-500 font-medium">Batch: {course.batch.name} • Course ID: {course.courseId}</p>
                </div>
                <p className="text-gray-600 mt-4 leading-relaxed">{course.comment || "No description provided."}</p>
            </div>

            {/* Tests Section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Class Tests & Exams</h2>
            </div>

            <div className="mb-8 bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold mb-6 text-lg text-gray-800">Create New Test</h3>
                <form onSubmit={handleCreateTest} className="flex gap-4 flex-wrap items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs uppercase text-gray-500 mb-1 font-bold tracking-wider">Test Name</label>
                        <input
                            className="bg-gray-50 border border-gray-200 p-3 rounded-lg w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                            placeholder="e.g. Pop Quiz"
                            required
                            value={testForm.name}
                            onChange={e => setTestForm({ ...testForm, name: e.target.value })}
                        />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs uppercase text-gray-500 mb-1 font-bold tracking-wider">Date</label>
                        <input
                            type="date"
                            className="bg-gray-50 border border-gray-200 p-3 rounded-lg w-full text-gray-800 focus:outline-none focus:border-blue-500 transition"
                            required
                            value={testForm.date}
                            onChange={e => setTestForm({ ...testForm, date: e.target.value })}
                        />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs uppercase text-gray-500 mb-1 font-bold tracking-wider">Comment</label>
                        <input
                            className="bg-gray-50 border border-gray-200 p-3 rounded-lg w-full text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition"
                            placeholder="Chapters 1-3"
                            value={testForm.comment}
                            onChange={e => setTestForm({ ...testForm, comment: e.target.value })}
                        />
                    </div>
                    <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 font-bold w-full md:w-auto transition">Create Test</button>
                </form>
            </div>

            <div className="space-y-4">
                {tests.map(test => (
                    <div
                        key={test._id}
                        onClick={() => navigate(`/teacher/tests/${test._id}`)}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg cursor-pointer flex justify-between items-center group transition"
                    >
                        <div>
                            <h3 className="font-bold text-xl text-gray-800">{test.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{new Date(test.date).toDateString()}</p>
                            {test.comment && <p className="text-gray-500 text-sm mt-1">{test.comment}</p>}
                        </div>
                        <div className="flex items-center gap-6">
                            <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition">Update Marks</span>
                            <button
                                onClick={(e) => handleDeleteTest(e, test._id)}
                                className="text-red-500 bg-red-50 px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-600 hover:text-white transition"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                {tests.length === 0 && <p className="text-gray-400 text-center py-8">No tests created yet. Add one above.</p>}
            </div>

        </div>
    );
}
