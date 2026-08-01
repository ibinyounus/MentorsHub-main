import { useNavigate } from "react-router-dom";

export default function PaymentSelect() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
            <button
                onClick={() => navigate("/admin/dashboard")}
                className="self-start mb-10 text-gray-600 hover:text-black flex items-center gap-2"
            >
                &larr; Back to Dashboard
            </button>

            <h1 className="text-3xl font-bold mb-10">Payment Management</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-2xl">
                <div
                    onClick={() => navigate("/admin/payments/teachers")}
                    className="bg-white p-10 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border border-gray-200 flex flex-col items-center justify-center h-48"
                >
                    <span className="text-4xl mb-4">💰</span>
                    <h2 className="text-xl font-bold">Teacher Salaries</h2>
                </div>

                <div
                    onClick={() => navigate("/admin/payments/students")}
                    className="bg-white p-10 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer border border-gray-200 flex flex-col items-center justify-center h-48"
                >
                    <span className="text-4xl mb-4">💳</span>
                    <h2 className="text-xl font-bold">Student Fees</h2>
                </div>
            </div>
        </div>
    );
}
