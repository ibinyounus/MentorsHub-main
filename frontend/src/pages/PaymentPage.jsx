import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    addPayment,
    getPaymentHistory,
    getPaymentSummary,
} from "../services/adminService";

export default function PaymentPage() {
    const { type } = useParams(); // 'students' or 'teachers'
    const userType = type === "students" ? "student" : "teacher";
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        userId: "",
        date: new Date().toISOString().split("T")[0],
        amount: "",
        comment: "",
    });
    const [message, setMessage] = useState("");

    const [historySearchId, setHistorySearchId] = useState("");
    const [history, setHistory] = useState([]);
    const [summary, setSummary] = useState(null);

    const loadSummary = async () => {
        try {
            const data = await getPaymentSummary(userType);
            setSummary(data);
        } catch (e) {
            console.error("Error loading payment summary", e);
        }
    };

    // Initial summary load
    useEffect(() => {
        loadSummary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userType]);

    const handleAddPayment = async (e) => {
        e.preventDefault();
        try {
            await addPayment({
                ...formData,
                userType,
            });
            setMessage("Payment recorded successfully!");
            setFormData({
                userId: "",
                date: new Date().toISOString().split("T")[0],
                amount: "",
                comment: "",
            });
            // If we added a payment for the user currently being viewed in history, refresh it
            if (historySearchId === formData.userId) {
                handleHistorySearch(null, formData.userId);
            }
            // Refresh summary after adding payment
            loadSummary();
        } catch (error) {
            console.error(error);
            setMessage(error.response?.data?.message || "Error adding payment");
        }
    };

    const handleHistorySearch = async (e, idOverride) => {
        if (e) e.preventDefault();
        const idToSearch = idOverride || historySearchId;
        try {
            if (!idToSearch) return;
            const data = await getPaymentHistory(idToSearch);
            setHistory(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <button
                onClick={() => navigate("/admin/payments")}
                className="mb-6 text-gray-600 hover:text-black flex items-center gap-2"
            >
                &larr; Back to Selection
            </button>

            <h1 className="text-3xl font-bold mb-2 capitalize">{userType} Payment</h1>

            {/* Monthly Summary */}
            <div className="mb-8 bg-white p-4 rounded-lg border border-gray-200 text-sm">
                <h2 className="text-base font-semibold mb-3">
                    {userType === "student"
                        ? "Student Fee Collection Summary"
                        : "Teacher Payment Summary"}
                </h2>
                {summary ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-3 rounded-md bg-green-50 border border-green-100">
                            <p className="text-xs font-semibold text-green-700 uppercase">
                                This Month ({new Date(summary.currentMonth.start).toLocaleDateString()} -{" "}
                                {new Date(summary.currentMonth.end).toLocaleDateString()})
                            </p>
                            <p className="mt-1 text-lg font-bold text-green-900">
                                ৳ {Number(summary.currentMonth.totalAmount || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-green-700 mt-1">
                                {summary.currentMonth.count} record
                                {summary.currentMonth.count === 1 ? "" : "s"}
                            </p>
                        </div>
                        <div className="p-3 rounded-md bg-blue-50 border border-blue-100">
                            <p className="text-xs font-semibold text-blue-700 uppercase">
                                Previous Month ({new Date(summary.previousMonth.start).toLocaleDateString()} -{" "}
                                {new Date(summary.previousMonth.end).toLocaleDateString()})
                            </p>
                            <p className="mt-1 text-lg font-bold text-blue-900">
                                ৳ {Number(summary.previousMonth.totalAmount || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-blue-700 mt-1">
                                {summary.previousMonth.count} record
                                {summary.previousMonth.count === 1 ? "" : "s"}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">Loading summary...</p>
                )}
                <p className="mt-2 text-xs text-gray-400">
                    Calculated from 1st to last date of each month.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Section 1: Add Payment */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Add Payment Info</h2>
                    <form onSubmit={handleAddPayment} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Date Filed</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full border border-gray-300 rounded p-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">User ID</label>
                            <input
                                type="text"
                                placeholder={`Enter ${userType} ID`}
                                value={formData.userId}
                                onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                                className="w-full border border-gray-300 rounded p-2 focus:border-black outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Amount</label>
                            <input
                                type="number"
                                placeholder="Enter Amount"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                className="w-full border border-gray-300 rounded p-2 focus:border-black outline-none"
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Comment</label>
                            <textarea
                                placeholder="e.g. Monthly Fee, Salary for Feb"
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                className="w-full border border-gray-300 rounded p-2 focus:border-black outline-none h-24"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 font-semibold mt-2"
                        >
                            Confirm Payment
                        </button>

                        {message && <p className="text-center text-sm font-medium mt-2">{message}</p>}
                    </form>
                </div>

                {/* Section 2: History Search */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Payment History</h2>
                    <form onSubmit={(e) => handleHistorySearch(e)} className="flex gap-4 mb-6">
                        <input
                            type="text"
                            placeholder={`Enter ${userType} ID to view history`}
                            value={historySearchId}
                            onChange={(e) => setHistorySearchId(e.target.value)}
                            className="flex-1 border border-gray-300 rounded p-2 focus:border-black outline-none"
                        />
                        <button type="submit" className="bg-black text-white px-6 rounded hover:bg-gray-800">
                            Search
                        </button>
                    </form>

                    <div className="h-96 overflow-y-auto">
                        {history.length > 0 ? (
                            <div className="space-y-4">
                                {history.map(record => (
                                    <div key={record._id} className="border-b pb-3 last:border-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-lg">৳ {record.amount}</p>
                                                <p className="text-sm text-gray-500">{new Date(record.date).toDateString()}</p>
                                            </div>
                                            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                                                ID: {record.userId}
                                            </span>
                                        </div>
                                        {record.comment && (
                                            <p className="text-gray-700 text-sm mt-1 italic">"{record.comment}"</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center mt-10">No payment records found.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
