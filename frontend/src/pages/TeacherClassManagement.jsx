import { useState } from "react";
import { Link } from "react-router-dom";
import {
  addTeacherClassRecord,
  getTeacherClassHistory,
  deleteTeacherClassRecord,
} from "../services/adminService";

export default function TeacherClassManagement() {
  const [form, setForm] = useState({
    teacherId: "",
    amount: "",
    date: "",
    comment: "",
  });
  const [searchId, setSearchId] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.teacherId || !form.amount || !form.date) {
      setError("Teacher ID, Amount and Date are required.");
      return;
    }

    try {
      setLoading(true);
      await addTeacherClassRecord({
        teacherId: form.teacherId.trim(),
        amount: Number(form.amount),
        date: form.date,
        comment: form.comment.trim(),
      });
      setSuccess("Record added successfully.");
      // Always refresh history for this teacher after saving
      const normalizedId = form.teacherId.trim();
      setSearchId(normalizedId);
      await handleSearch(undefined, normalizedId);
      setForm({
        teacherId: "",
        amount: "",
        date: "",
        comment: "",
      });
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to add record. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e, overrideId) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");

    const id = (overrideId ?? searchId).trim();
    if (!id) {
      setError("Please enter a Teacher ID to search.");
      return;
    }

    try {
      setLoading(true);
      const data = await getTeacherClassHistory(id);
      setRecords(data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to fetch history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;
    setError("");
    setSuccess("");

    try {
      setLoading(true);
      await deleteTeacherClassRecord(id);
      setRecords((prev) => prev.filter((r) => r._id !== id));
      setSuccess("Record deleted successfully.");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to delete record. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 border-b pb-3">
          <h1 className="text-2xl md:text-3xl font-bold">
            Teacher Class Management
          </h1>
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-md bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Record */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              Add Teacher Class Record
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Teacher ID
                </label>
                <input
                  type="text"
                  name="teacherId"
                  value={form.teacherId}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. T_01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 1500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Comment (optional)
                </label>
                <textarea
                  name="comment"
                  value={form.comment}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add any notes or comments"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Record"}
              </button>
            </form>
          </div>

          {/* Search & History */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              Search Teacher Class History
            </h2>

            <form onSubmit={handleSearch} className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter Teacher ID (e.g. T_01)"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-gray-800 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:opacity-60"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </form>

            <div className="border-t pt-3 mt-3">
              {records.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No records found. Enter a Teacher ID and search to see
                  history.
                </p>
              ) : (
                <div className="max-h-80 overflow-auto text-sm">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b text-xs uppercase text-gray-500">
                        <th className="py-2 pr-2">Date</th>
                        <th className="py-2 pr-2">Amount</th>
                        <th className="py-2 pr-2">Comment</th>
                        <th className="py-2 pr-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.map((rec) => (
                        <tr key={rec._id} className="border-b last:border-0">
                          <td className="py-2 pr-2 align-top">
                            {rec.date
                              ? new Date(rec.date).toLocaleDateString()
                              : "-"}
                          </td>
                          <td className="py-2 pr-2 align-top">
                            {rec.amount ?? "-"}
                          </td>
                          <td className="py-2 pr-2 align-top text-gray-700">
                            {rec.comment || "-"}
                          </td>
                          <td className="py-2 pr-2 align-top text-right">
                            <button
                              onClick={() => handleDelete(rec._id)}
                              className="text-xs text-red-600 hover:text-red-800"
                              disabled={loading}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
