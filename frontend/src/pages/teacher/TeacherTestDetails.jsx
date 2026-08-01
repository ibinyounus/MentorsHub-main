import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTestById, updateMarks, updateTest } from "../../services/adminService";

export default function TeacherTestDetails() {
    const { testId } = useParams();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [students, setStudents] = useState([]);
    const [marksMap, setMarksMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadData();
    }, [testId]);

    const loadData = async () => {
        try {
            const data = await getTestById(testId);
            setTest(data.test);
            setStudents(data.students);

            const initialMarks = {};
            data.results.forEach(r => {
                initialMarks[r.student] = r.marks;
            });
            setMarksMap(initialMarks);
            setLoading(false);
        } catch (e) {
            console.error(e);
        }
    };

    const handleMarkChange = (studentId, value) => {
        setMarksMap({ ...marksMap, [studentId]: value });
    };

    const handleSave = async () => {
        try {
            // 1. Update Test Total Marks
            await updateTest(testId, { totalMarks: test.totalMarks });

            // 2. Update Student Results
            const marksData = Object.keys(marksMap).map(sid => ({
                studentId: sid,
                marks: marksMap[sid]
            }));

            await updateMarks(testId, marksData);
            setMessage("Marks & Test Info saved successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (e) {
            alert("Error saving marks");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8 font-sans">
            <button
                onClick={() => navigate(`/teacher/courses/${test.course._id || test.course}`)}
                className="mb-8 text-gray-600 hover:text-black flex items-center gap-2"
            >
                &larr; Back to Course
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 bg-white p-6 rounded-xl shadow-sm border border-gray-100 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">{test.name}</h1>
                    <p className="text-gray-500">Date: {new Date(test.date).toDateString()}</p>
                    <div className="mt-4 flex items-center gap-2">
                        <span className="font-bold text-gray-700">Total Marks:</span>
                        <input
                            type="number"
                            className="border border-gray-300 rounded p-1 w-24 font-bold text-center"
                            value={test.totalMarks}
                            onChange={(e) => setTest({ ...test, totalMarks: e.target.value })}
                        />
                    </div>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-700 transition shadow-sm hover:shadow-md w-full md:w-auto"
                >
                    Save All Marks
                </button>
            </div>

            {message && <div className="mb-4 bg-green-100 text-green-800 p-3 rounded-lg text-center font-medium shadow-sm">{message}</div>}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[500px]">
                        <thead className="bg-white border-b border-gray-200">
                            <tr>
                                <th className="p-5 text-gray-900 font-bold uppercase text-xs tracking-wider">Student Name</th>
                                <th className="p-5 text-gray-500 font-semibold uppercase text-xs tracking-wider">Student ID</th>
                                <th className="p-5 w-48 text-gray-500 font-semibold uppercase text-xs tracking-wider">Marks Obtained</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {students.map(student => (
                                <tr key={student._id} className="hover:bg-gray-50 transition">
                                    <td className="p-5 font-bold text-gray-900">{student.name}</td>
                                    <td className="p-5 text-gray-500 font-mono text-sm">{student.studentId}</td>
                                    <td className="p-5">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                className="border border-gray-300 bg-white rounded-lg p-3 w-full focus:border-black focus:ring-1 focus:ring-black outline-none transition font-bold"
                                                value={marksMap[student._id] || ""}
                                                onChange={(e) => handleMarkChange(student._id, e.target.value)}
                                                placeholder="--"
                                            />
                                            <span className="text-gray-400 font-bold text-xs">/ {test.totalMarks}</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {students.length === 0 && (
                                <tr><td colSpan="3" className="p-10 text-center text-gray-400">No students are assigned to this batch.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
