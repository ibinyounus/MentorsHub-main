import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    getBatchById,
    searchStudents,
    addStudentsToBatch,
    createCourse,
    getCoursesByBatch,
    deleteCourse,
    createNotice,
    getNoticesByBatch,
    deleteNotice
} from "../../services/adminService";

export default function BatchDetails() {
    const { batchId } = useParams();
    const navigate = useNavigate();
    const [batch, setBatch] = useState(null);

    // Student Assign
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);

    // Course Create
    const [courses, setCourses] = useState([]);
    const [courseForm, setCourseForm] = useState({ name: "", courseId: "", comment: "", teacherId: "" });

    // Notices
    const [notices, setNotices] = useState([]);
    const [noticeForm, setNoticeForm] = useState({ title: "", content: "" });

    useEffect(() => {
        loadData();
    }, [batchId]);

    const loadData = async () => {
        const bData = await getBatchById(batchId);
        setBatch(bData);
        const cData = await getCoursesByBatch(batchId);
        setCourses(cData);
        const nData = await getNoticesByBatch(batchId);
        setNotices(nData);
    };

    // Student Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchTerm.length > 0) {
                const data = await searchStudents(searchTerm);
                setSearchResults(data);
            } else {
                setSearchResults([]);
            }
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const toggleSelectStudent = (s) => {
        if (selectedStudents.some(sel => sel._id === s._id)) {
            setSelectedStudents(selectedStudents.filter(sel => sel._id !== s._id));
        } else {
            setSelectedStudents([...selectedStudents, s]);
        }
    };

    const handleAddStudents = async () => {
        const ids = selectedStudents.map(s => s._id);
        await addStudentsToBatch(batchId, ids);
        setSelectedStudents([]);
        setSearchTerm("");
        loadData(); // refresh batch to see added students
    };

    // Course logic
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            await createCourse({ ...courseForm, batchId });
            loadData();
            setCourseForm({ name: "", courseId: "", comment: "", teacherId: "" });
        } catch (e) {
            alert("Error creating course. ID might be duplicate.");
        }
    };

    const handleDeleteCourse = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Delete this course? Tests will be deleted.")) {
            await deleteCourse(id);
            loadData();
        }
    }

    // Notice logic
    const handleCreateNotice = async (e) => {
        e.preventDefault();
        try {
            await createNotice({ ...noticeForm, batchId });
            loadData();
            setNoticeForm({ title: "", content: "" });
        } catch (e) {
            alert("Error creating notice.");
        }
    };

    const handleDeleteNotice = async (id) => {
        if (window.confirm("Delete this notice?")) {
            await deleteNotice(id);
            loadData();
        }
    }


    if (!batch) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <button
                onClick={() => navigate("/admin/class/batches")}
                className="mb-6 text-gray-600 hover:text-black flex items-center gap-2"
            >
                &larr; Back to Batches
            </button>

            <div className="flex justify-between items-end mb-8 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold">{batch.name} <span className="text-lg font-normal text-gray-500">({batch.batchId})</span></h1>
                    <p className="text-gray-600">{batch.comment}</p>
                </div>
                <p className="text-gray-500">{batch.students.length} Students Assigned</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT: Students */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Assign Students</h2>

                    <div className="mb-4">
                        <input
                            placeholder="Search Student by Name or ID..."
                            className="w-full border p-2 rounded"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                        {searchResults.length > 0 && (
                            <div className="border border-gray-200 mt-2 max-h-48 overflow-y-auto rounded bg-gray-50">
                                {searchResults.map(s => (
                                    <div key={s._id}
                                        onClick={() => toggleSelectStudent(s)}
                                        className={`p-2 cursor-pointer flex justify-between items-center ${selectedStudents.some(sel => sel._id === s._id) ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
                                    >
                                        <span>{s.name} ({s.studentId})</span>
                                        {selectedStudents.some(sel => sel._id === s._id) && <span>✓</span>}
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedStudents.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm mb-2">{selectedStudents.length} students selected.</p>
                                <button onClick={handleAddStudents} className="w-full bg-black text-white py-1 rounded">
                                    Confirm Add Selected
                                </button>
                            </div>
                        )}
                    </div>

                    <h3 className="font-semibold mb-2 mt-6">Assigned Students</h3>
                    <div className="max-h-64 overflow-y-auto pl-1">
                        <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                            {batch.students.map(s => (
                                <li key={s._id}>{s.name} ({s.studentId})</li>
                            ))}
                            {batch.students.length === 0 && <p className="text-gray-400 italic">No students in this batch.</p>}
                        </ul>
                    </div>
                </div>

                {/* RIGHT: Courses & Notices */}
                <div className="space-y-6">
                    {/* Courses */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold mb-4">Courses</h2>

                        {/* Create Course */}
                        <form onSubmit={handleCreateCourse} className="mb-6 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                                <input className="border p-2 rounded" placeholder="Course Name" required value={courseForm.name} onChange={e => setCourseForm({ ...courseForm, name: e.target.value })} />
                                <input className="border p-2 rounded" placeholder="Course ID" required value={courseForm.courseId} onChange={e => setCourseForm({ ...courseForm, courseId: e.target.value })} />
                            </div>
                            <input className="border p-2 rounded w-full" placeholder="Assigned Teacher ID" value={courseForm.teacherId} onChange={e => setCourseForm({ ...courseForm, teacherId: e.target.value })} />
                            <input className="border p-2 rounded w-full" placeholder="Comment" value={courseForm.comment} onChange={e => setCourseForm({ ...courseForm, comment: e.target.value })} />
                            <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">Add Course</button>
                        </form>

                        {/* List Courses */}
                        <div className="space-y-3">
                            {courses.map(course => (
                                <div
                                    key={course._id}
                                    onClick={() => navigate(`/admin/class/courses/${course._id}`)}
                                    className="bg-gray-50 p-4 rounded border border-gray-200 cursor-pointer hover:bg-gray-100 flex justify-between items-center group"
                                >
                                    <div>
                                        <h3 className="font-bold">{course.name}</h3>
                                        <p className="text-xs text-gray-500">ID: {course.courseId} • {course.teacher ? `Teacher: ${course.teacher.name}` : "No Teacher"}</p>
                                    </div>
                                    <span className="text-xl group-hover:translate-x-1 transition text-gray-400">&rarr;</span>
                                    <button
                                        onClick={(e) => handleDeleteCourse(e, course._id)}
                                        className="text-red-500 opacity-0 group-hover:opacity-100 transition text-sm ml-2"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            {courses.length === 0 && <p className="text-gray-400 italic text-center">No courses yet.</p>}
                        </div>
                    </div>

                    {/* Notices */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-bold mb-4">Notice Board</h2>

                        <form onSubmit={handleCreateNotice} className="mb-6 space-y-2">
                            <input
                                className="border p-2 rounded w-full"
                                placeholder="Notice Title"
                                required
                                value={noticeForm.title}
                                onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                            />
                            <textarea
                                className="border p-2 rounded w-full h-20"
                                placeholder="Notice Content..."
                                required
                                value={noticeForm.content}
                                onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                            />
                            <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">Post Notice</button>
                        </form>

                        <div className="space-y-4">
                            {notices.map(notice => (
                                <div key={notice._id} className="bg-yellow-50 p-4 rounded border border-yellow-200 relative group">
                                    <button
                                        onClick={() => handleDeleteNotice(notice._id)}
                                        className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        ✕
                                    </button>
                                    <h3 className="font-bold text-gray-800">{notice.title}</h3>
                                    <p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">{notice.content}</p>
                                    <p className="text-xs text-gray-400 mt-2">{new Date(notice.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                            {notices.length === 0 && <p className="text-gray-400 italic text-center">No notices posted.</p>}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
