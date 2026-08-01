import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import LoaderImg from "../assets/Loader.png";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // ⭐ VERY IMPORTANT

    setLoading(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 6000);

    try {
      const res = await api.post("/admin/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token || res.data.accessToken);
      navigate("/admin/dashboard");
    } catch (error) {
      alert("Login failed");
      console.error(error.response?.data || error.message);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <div className="p-6 relative min-h-screen flex items-center justify-center bg-gray-100">
      {loading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
            <p className="text-white font-medium">Signing in...</p>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm relative z-10">
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>

        <form onSubmit={handleLogin} className="space-y-3">
          <input
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /><line x1="2" y1="2" x2="22" y2="22" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 transition disabled:opacity-60 mt-2"
          >
            {loading ? "Please wait..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
