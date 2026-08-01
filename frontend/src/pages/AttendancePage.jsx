import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    markAttendance,
    getAttendanceHistory,
    getTodayAttendance,
} from "../services/adminService";

export default function AttendancePage() {
    const { type } = useParams(); // 'students' or 'teachers'
    const userType = type === "students" ? "student" : "teacher";
    const navigate = useNavigate();

    const [idInput, setIdInput] = useState("");
    const [dateInput, setDateInput] = useState(new Date().toISOString().split("T")[0]);
    const [message, setMessage] = useState("");

    const [historySearchId, setHistorySearchId] = useState("");
    const [history, setHistory] = useState([]);

    const [todayList, setTodayList] = useState([]);

    useEffect(() => {
        fetchTodayAttendance();
    }, [type]);

    const fetchTodayAttendance = async () => {
        try {
            const data = await getTodayAttendance(userType);
            setTodayList(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMark = async (status) => {
        try {
            if (!idInput) {
                setMessage("Please enter an ID");
                return;
            }
            await markAttendance({
                userId: idInput,
                userType,
                date: dateInput,
                status,
            });
            setMessage(`Successfully marked ${status}!`);
            fetchTodayAttendance(); // Refresh today's list
            if (historySearchId === idInput) handleHistorySearch(); // Refresh history if viewing same user
        } catch (error) {
            console.error(error)
            setMessage(error.response?.data?.message || "Error marking attendance");
        }
    };

    const handleHistorySearch = async (e) => {
        if (e) e.preventDefault();
        try {
            if (!historySearchId) return;
            const data = await getAttendanceHistory(historySearchId);
            setHistory(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6">
            <button
                onClick={() => navigate("/admin/attendance")}
                className="mb-6 text-gray-600 hover:text-black flex items-center gap-2"
            >
                &larr; Back to Selection
            </button>

            <h1 className="text-3xl font-bold mb-8 capitalize">{userType} Attendance</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Section 1: Mark Attendance */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Mark Attendance</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Date</label>
                            <input
                                type="date"
                                value={dateInput}
                                onChange={(e) => setDateInput(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">User ID</label>
                            <input
                                type="text"
                                placeholder={`Enter ${userType} ID`}
                                value={idInput}
                                onChange={(e) => setIdInput(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 focus:border-black outline-none"
                                autoFocus
                            />
                        </div>

                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={() => handleMark('present')}
                                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold"
                            >
                                Present
                            </button>
                            <button
                                onClick={() => handleMark('absent')}
                                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold"
                            >
                                Absent
                            </button>
                        </div>
                        {message && <p className="text-center text-sm font-medium mt-2">{message}</p>}
                    </div>
                </div>

                {/* Section 3: Today's Attendance */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Today's Presence</h2>
                    <div className="h-64 overflow-y-auto">
                        {todayList.length === 0 ? (
                            <p className="text-gray-500 text-sm">No records for today.</p>
                        ) : (
                            <ul className="space-y-2">
                                {todayList.map(record => (
                                    <li key={record._id} className="flex justify-between border-b pb-2">
                                        <span className="font-semibold">{record.userId}</span>
                                        <span className={`text-sm px-2 rounded ${record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {record.status}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Section 2: History Search */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold mb-4">Check Attendance History</h2>
                    <form onSubmit={handleHistorySearch} className="flex gap-4 mb-6">
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

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b">
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Marked At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map(record => (
                                    <tr key={record._id} className="border-b hover:bg-gray-50">
                                        <td className="p-3">{new Date(record.date).toDateString()}</td>
                                        <td className="p-3">
                                            <span className={`capitalize font-medium ${record.status === 'present' ? 'text-green-600' : 'text-red-600'}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="p-3 text-sm text-gray-400">{new Date(record.createdAt).toLocaleTimeString()}</td>
                                    </tr>
                                ))}
                                {history.length === 0 && historySearchId && (
                                    <tr><td colSpan="3" className="p-4 text-center text-gray-500">No history found (Last 35 days).</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}
