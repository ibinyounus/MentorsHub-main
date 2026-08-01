import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTestById, updateMarks } from "../../services/adminService";

export default function TestDetails() {
    const { testId } = useParams();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [students, setStudents] = useState([]);
    const [marksMap, setMarksMap] = useState({}); // { studentId: marks }
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

            // Populate existing marks
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
            const marksData = Object.keys(marksMap).map(sid => ({
                studentId: sid,
                marks: marksMap[sid]
            }));

            await updateMarks(testId, marksData);
            setMessage("Marks saved successfully!");
            setTimeout(() => setMessage(""), 3000);
        } catch (e) {
            alert("Error saving marks");
        }
    };

    if (loading) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button
                onClick={() => navigate(`/admin/class/courses/${test.course._id || test.course}`)}
                className="mb-6 text-gray-600 hover:text-black flex items-center gap-2"
            >
                &larr; Back to Course
            </button>

            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold">{test.name}</h1>
                    <p className="text-gray-600">Date: {new Date(test.date).toDateString()}</p>
                </div>
                <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow hover:bg-green-700 transition"
                >
                    Save All Marks
                </button>
            </div>

            {message && <div className="mb-4 bg-green-100 text-green-800 p-2 rounded text-center">{message}</div>}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4">Student Name</th>
                            <th className="p-4">Student ID</th>
                            <th className="p-4 w-48">Marks Obtained</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(student => (
                            <tr key={student._id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-medium">{student.name}</td>
                                <td className="p-4 text-gray-500">{student.studentId}</td>
                                <td className="p-4">
                                    <input
                                        type="number"
                                        className="border border-gray-300 rounded p-2 w-full focus:border-black outline-none"
                                        value={marksMap[student._id] || ""}
                                        onChange={(e) => handleMarkChange(student._id, e.target.value)}
                                        placeholder="--"
                                    />
                                </td>
                            </tr>
                        ))}
                        {students.length === 0 && (
                            <tr><td colSpan="3" className="p-8 text-center text-gray-500">No students found in this batch. Add students to the Batch first.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
