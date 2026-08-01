import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getCourseById,
    updateCourse,
    createTest,
    getTestsByCourse,
    deleteTest
} from "../../services/adminService";

export default function CourseDetails() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);

    // Edit mode
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    // Tests
    const [tests, setTests] = useState([]);
    const [testForm, setTestForm] = useState({ name: "", date: "", comment: "" });

    useEffect(() => {
        loadData();
    }, [courseId]);

    const loadData = async () => {
        const cData = await getCourseById(courseId);
        setCourse(cData);
        setEditForm({
            name: cData.name,
            comment: cData.comment,
            teacherId: cData.teacher ? cData.teacher.teacherId : ""
        });

        const tData = await getTestsByCourse(courseId);
        setTests(tData);
    };

    const handleUpdateCourse = async () => {
        await updateCourse(courseId, editForm);
        setIsEditing(false);
        loadData();
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
        <div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => navigate(`/admin/class/batches/${course.batch._id || course.batch}`)}
                className="mb-6 text-gray-600 hover:text-black flex items-center gap-2"
            >
                &larr; Back to Batch
            </button>

            {/* Header / Edit Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold">Course: {course.name}</h1>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-sm underline text-blue-600"
                    >
                        {isEditing ? "Cancel Edit" : "Edit Course Info"}
                    </button>
                </div>

                {!isEditing ? (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <p><span className="font-semibold">ID:</span> {course.courseId}</p>
                        <p><span className="font-semibold">Teacher:</span> {course.teacher ? `${course.teacher.name} (${course.teacher.teacherId})` : "Unassigned"}</p>
                        <p className="col-span-2 text-gray-600">"{course.comment}"</p>
                        <p className="text-xs text-gray-400 mt-2">Belongs to Batch: {course.batch.name}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <input className="border p-2 rounded w-full" placeholder="Name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
                        <input className="border p-2 rounded w-full" placeholder="Teacher ID (empty to remove)" value={editForm.teacherId} onChange={e => setEditForm({ ...editForm, teacherId: e.target.value })} />
                        <input className="border p-2 rounded w-full" placeholder="Comment" value={editForm.comment} onChange={e => setEditForm({ ...editForm, comment: e.target.value })} />
                        <button onClick={handleUpdateCourse} className="bg-black text-white px-4 py-2 rounded">Save Changes</button>
                    </div>
                )}
            </div>

            {/* Tests Section */}
            <h2 className="text-2xl font-bold mb-4">Tests / Exams</h2>

            <div className="mb-8 bg-gray-50 p-6 rounded border border-gray-200">
                <h3 className="font-bold mb-2">Create New Test</h3>
                <form onSubmit={handleCreateTest} className="flex gap-4 flex-wrap items-end">
                    <input
                        className="border p-2 rounded flex-1"
                        placeholder="Test Name (e.g. Midterm)"
                        required
                        value={testForm.name}
                        onChange={e => setTestForm({ ...testForm, name: e.target.value })}
                    />
                    <input
                        type="date"
                        className="border p-2 rounded"
                        required
                        value={testForm.date}
                        onChange={e => setTestForm({ ...testForm, date: e.target.value })}
                    />
                    <input
                        className="border p-2 rounded flex-1"
                        placeholder="Comment"
                        value={testForm.comment}
                        onChange={e => setTestForm({ ...testForm, comment: e.target.value })}
                    />
                    <button className="bg-black text-white px-6 py-2 rounded">Create</button>
                </form>
            </div>

            <div className="space-y-3">
                {tests.map(test => (
                    <div
                        key={test._id}
                        onClick={() => navigate(`/admin/class/tests/${test._id}`)}
                        className="bg-white p-4 rounded shadow-sm border border-gray-200 hover:shadow-md cursor-pointer flex justify-between items-center group"
                    >
                        <div>
                            <h3 className="font-bold text-lg">{test.name}</h3>
                            <p className="text-sm text-gray-500">{new Date(test.date).toDateString()} • {test.comment}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm bg-black text-white px-3 py-1 rounded">Enter Marks</span>
                            <button
                                onClick={(e) => handleDeleteTest(e, test._id)}
                                className="text-red-500 opacity-0 group-hover:opacity-100 transition text-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
                {tests.length === 0 && <p className="text-gray-500">No tests created yet.</p>}
            </div>

        </div>
    );
}
