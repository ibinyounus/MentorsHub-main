import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createBatch, getAllBatches, deleteBatch } from "../../services/adminService";

export default function BatchManagement() {
    const navigate = useNavigate();
    const [batches, setBatches] = useState([]);
    const [formData, setFormData] = useState({ name: "", batchId: "", comment: "" });

    useEffect(() => {
        fetchBatches();
    }, []);

    const fetchBatches = async () => {
        try {
            const data = await getAllBatches();
            setBatches(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createBatch(formData);
            fetchBatches();
            setFormData({ name: "", batchId: "", comment: "" });
        } catch (e) {
            alert("Error creating batch");
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Delete this batch? Data might be lost (courses, etc).")) {
            await deleteBatch(id);
            fetchBatches();
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <button
                onClick={() => navigate("/admin/dashboard")}
                className="mb-6 text-gray-600 hover:text-black flex items-center gap-2"
            >
                &larr; Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold mb-8">Class Management: Batches</h1>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h2 className="text-xl font-semibold mb-4">Create New Batch</h2>
                <form onSubmit={handleSubmit} className="flex gap-4 flex-wrap items-end">
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm text-gray-600 mb-1">Batch Name</label>
                        <input
                            className="border p-2 rounded w-full"
                            placeholder="e.g. HSC 2025"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-sm text-gray-600 mb-1">Batch ID</label>
                        <input
                            className="border p-2 rounded w-full"
                            placeholder="e.g. B25"
                            value={formData.batchId}
                            onChange={e => setFormData({ ...formData, batchId: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex-1 min-w-[250px]">
                        <label className="block text-sm text-gray-600 mb-1">Comment</label>
                        <input
                            className="border p-2 rounded w-full"
                            placeholder="Optional details"
                            value={formData.comment}
                            onChange={e => setFormData({ ...formData, comment: e.target.value })}
                        />
                    </div>
                    <button className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800">Create</button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {batches.map(batch => (
                    <div
                        key={batch._id}
                        onClick={() => navigate(`/admin/class/batches/${batch._id}`)}
                        className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md cursor-pointer transition relative group"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold">{batch.name}</h3>
                                <p className="text-sm text-gray-500">ID: {batch.batchId}</p>
                            </div>
                            <button
                                onClick={(e) => handleDelete(e, batch._id)}
                                className="text-red-500 opacity-0 group-hover:opacity-100 transition text-sm"
                            >
                                Delete
                            </button>
                        </div>
                        {batch.comment && <p className="mt-2 text-gray-600 italic">"{batch.comment}"</p>}
                        <p className="mt-4 text-sm text-black font-semibold">
                            Open Batch &rarr;
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
