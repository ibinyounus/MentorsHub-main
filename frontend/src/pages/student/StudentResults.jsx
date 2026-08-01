import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getResultsByStudentId } from "../../services/adminService";

export default function StudentResults() {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userIdentifier");

    useEffect(() => {
        const fetchResults = async () => {
            if (userId) {
                try {
                    const data = await getResultsByStudentId(userId);
                    setResults(data);
                } catch (e) {
                    console.error("Error fetching results", e);
                }
            }
            setLoading(false);
        };
        fetchResults();
    }, [userId]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate("/student/dashboard")}
                    className="mb-8 text-gray-500 hover:text-black flex items-center gap-2"
                >
                    &larr; Back to Dashboard
                </button>

                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Class Results</h1>

                {!userId && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center border border-red-200">
                        <p className="font-bold text-lg mb-2">Session Expired</p>
                        <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="underline font-bold">Re-Login</button>
                    </div>
                )}

                {loading && userId && <p>Loading...</p>}

                {!loading && userId && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[600px]">
                                <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="p-4">Date</th>
                                        <th className="p-4">Subject / Course</th>
                                        <th className="p-4">Test Name</th>
                                        <th className="p-4 text-right">Marks Scored</th>
                                        <th className="p-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {results.map(res => (
                                        <tr key={res._id} className="hover:bg-gray-50">
                                            <td className="p-4 text-gray-500 text-sm">{new Date(res.test?.date).toDateString()}</td>
                                            <td className="p-4 font-semibold text-gray-800">{res.test?.course?.name}</td>
                                            <td className="p-4 text-gray-700">{res.test?.name}</td>
                                            <td className="p-4 text-right font-bold text-blue-600">{res.marks}</td>
                                            <td className="p-4 text-right text-gray-500">{res.test?.totalMarks}</td>
                                        </tr>
                                    ))}
                                    {results.length === 0 && <tr><td colSpan="5" className="p-8 text-center text-gray-400">No results published yet.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
