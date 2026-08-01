import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import LoaderImg from "../assets/Loader.png";

export default function LoginSelect() {
  const [role, setRole] = useState("student"); // student | teacher | admin
  const [formData, setFormData] = useState({
    identifier: "", // studentId or teacherId or email
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    setLoading(true);
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 6000); // safety: auto-hide after 6s max

    try {
      let response;
      if (role === "admin") {
        response = await api.post("/admin/login", {
          email: formData.identifier,
          password: formData.password,
        });
      } else if (role === "student") {
        response = await api.post("/students/login", {
          studentId: formData.identifier,
          password: formData.password,
        });
      } else if (role === "teacher") {
        response = await api.post("/teachers/login", {
          teacherId: formData.identifier,
          password: formData.password,
        });
      }

      const { accessToken, refreshToken, role: userRole } = response.data;

      // Store in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      // Ensure backend returns role, otherwise set it manually based on context if trusted, 
      // but backend response is safer. 
      // Admin login controller returns role.
      // Student/Teacher controllers I just edited return role.
      localStorage.setItem("role", userRole || role);

      const id = response.data.teacherId || response.data.studentId;
      if (id) {
        localStorage.setItem("userIdentifier", id);
      }

      if (response.data.name) localStorage.setItem("userName", response.data.name);
      if (response.data.institution) localStorage.setItem("userInstitution", response.data.institution);

      // Redirect
      if (role === "admin") navigate("/admin/dashboard");
      else if (role === "student") navigate("/student/dashboard");
      else if (role === "teacher") navigate("/teacher/dashboard");

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      {/* Full-screen loader overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 backdrop-blur-[2px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
            <p className="text-white font-medium">Logging in...</p>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative z-10">
        <h2 className="text-2xl font-bold text-center mb-6">Mentors Hub Login</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Role</label>
          <div className="flex rounded-md shadow-sm" role="group">
            {["student", "teacher", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 px-4 py-2 text-sm font-medium border capitalize ${role === r
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  } ${r === "student" ? "rounded-l-md" : ""} ${r === "admin" ? "rounded-r-md" : ""}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
              {role === "admin" ? "Email Address" : `${role} ID`}
            </label>
            <input
              type={role === "admin" ? "email" : "text"}
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              placeholder={role === "admin" ? "admin@example.com" : `Enter ${role} ID`}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full border border-gray-300 rounded p-2 pr-10 focus:outline-none focus:border-black"
                required
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
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded font-semibold hover:bg-gray-800 transition disabled:opacity-60"
          >
            {loading ? "Please wait..." : "Login as "}
            {!loading && <span className="capitalize">{role}</span>}
          </button>
        </form>
        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 text-gray-500 hover:text-black hover:underline text-sm text-center"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
