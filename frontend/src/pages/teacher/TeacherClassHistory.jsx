import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTeacherClassHistory } from "../../services/adminService";

export default function TeacherClassHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const id = localStorage.getItem("userIdentifier");
      if (id) {
        try {
          const data = await getTeacherClassHistory(id);
          setHistory(data || []);
        } catch (e) {
          console.error("Error fetching teacher class history", e);
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

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          My Class Records
        </h1>

        {loading && <p>Loading...</p>}

        {!loading && (
          <div className="space-y-4">
            {history.map((record) => (
              <div
                key={record._id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-start"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    ৳ {Number(record.amount).toLocaleString()}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {record.date
                      ? new Date(record.date).toDateString()
                      : "No date"}
                  </p>
                  {record.comment && (
                    <p className="text-gray-600 mt-2 italic text-sm">
                      "{record.comment}"
                    </p>
                  )}
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-center text-gray-400 mt-8">
                No class records found for your ID.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

