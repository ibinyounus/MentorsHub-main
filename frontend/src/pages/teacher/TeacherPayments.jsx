import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPaymentHistory } from "../../services/adminService";

export default function TeacherPayments() {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const id = localStorage.getItem("userIdentifier");
            if (id) {
                try {
                    const data = await getPaymentHistory(id);
                    setHistory(data);
                } catch (e) {
                    console.error("Error fetching payments", e);
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

                <h1 className="text-3xl font-bold text-gray-800 mb-8">My Payment History</h1>

                {loading && <p>Loading...</p>}

                {!loading && (
                    <div className="space-y-4">
                        {history.map(record => (
                            <div key={record._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                    <p className="text-2xl font-bold text-gray-800">৳ {record.amount.toLocaleString()}</p>
                                    <p className="text-gray-500 text-sm mt-1">{new Date(record.date).toDateString()}</p>
                                    {record.comment && <p className="text-gray-600 mt-2 italic text-sm">"{record.comment}"</p>}
                                </div>
                                <div className="h-10 w-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
                                    ✓
                                </div>
                            </div>
                        ))}
                        {history.length === 0 && (
                            <p className="text-center text-gray-400 mt-8">No payments found for your ID.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
