import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAttendanceHistory } from "../../services/adminService";

export default function TeacherAttendance() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const id = localStorage.getItem("userIdentifier");
            if (id) {
                try {
                    const data = await getAttendanceHistory(id);
                    setHistory(data);
                } catch (e) {
                    console.error("Error fetching attendance", e);
                }
            }
            setLoading(false);
        };
        fetchHistory();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate("/teacher/dashboard")}
                    className="mb-8 text-gray-500 hover:text-black flex items-center gap-2"
                >
                    &larr; Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Attendance History</h1>

                {loading && <p>Loading...</p>}

                {!loading && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.map(record => (
                                    <tr key={record._id} className="hover:bg-gray-50">
                                        <td className="p-4 font-medium text-gray-800">{new Date(record.date).toDateString()}</td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {history.length === 0 && (
                                    <tr><td colSpan="2" className="p-8 text-center text-gray-400">No records found for your ID.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
