import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getNoticesByStudentId } from "../../services/adminService";

export default function StudentNotices() {
    const navigate = useNavigate();
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userIdentifier");

    useEffect(() => {
        const fetchNotices = async () => {
            if (userId) {
                try {
                    const data = await getNoticesByStudentId(userId);
                    setNotices(data);
                } catch (e) {
                    console.error("Error fetching notices", e);
                }
            }
            setLoading(false);
        };
        fetchNotices();
    }, [userId]);

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate("/student/dashboard")}
                    className="mb-6 text-gray-500 hover:text-black flex items-center gap-2"
                >
                    &larr; Back to Dashboard
                </button>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">My Notices</h1>

                {!userId && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center border border-red-200">
                        <p className="font-bold text-lg mb-2">Session Expired</p>
                        <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="underline font-bold">Re-Login</button>
                    </div>
                )}

                {loading && userId && <p>Loading...</p>}

                {!loading && userId && (
                    <div className="space-y-6">
                        {notices.map(notice => (
                            <div key={notice._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-400">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">{notice.title}</h2>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{new Date(notice.createdAt).toDateString()}</span>
                                </div>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{notice.content}</p>
                                <p className="mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Batch: {notice.batch?.name}</p>
                            </div>
                        ))}
                        {notices.length === 0 && <p className="text-center text-gray-400 mt-8">No notices found.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
