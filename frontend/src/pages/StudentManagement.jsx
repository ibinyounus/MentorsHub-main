import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createStudent,
  searchStudents,
  updateStudent,
} from "../services/adminService";

export default function StudentManagement() {
  const [activeTab, setActiveTab] = useState("create"); // 'create' | 'search'
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "search") {
      // Optional: Load some initial data or just wait for search
    }
  }, [activeTab]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="mb-4 text-gray-600 hover:text-black flex items-center gap-2"
      >
        &larr; Back to Dashboard
      </button>
      <h1 className="text-2xl font-bold mb-6">Student Management</h1>

      <div className="flex border-b border-gray-300 mb-6">
        <button
          className={`px-4 py-2 mr-4 ${activeTab === "create"
            ? "border-b-2 border-black font-semibold"
            : "text-gray-500"
            }`}
          onClick={() => setActiveTab("create")}
        >
          Create New Student
        </button>
        <button
          className={`px-4 py-2 ${activeTab === "search"
            ? "border-b-2 border-black font-semibold"
            : "text-gray-500"
            }`}
          onClick={() => setActiveTab("search")}
        >
          Search Student
        </button>
      </div>

      {activeTab === "create" ? <CreateStudentView /> : <SearchStudentView />}
    </div>
  );
}

function CreateStudentView() {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    motherName: "",
    institution: "",
    class: "",
    studentId: "",
    password: "",
    mobile: "",
    address: "",
    branches: "", // Comma separated for now or single string
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert branches string to array if needed, but model handles it? 
      // Model expects branches: [{ type: String }]. 
      // Let's send simple array of strings or just let backend handle it if it handles raw strings.
      // Mongoose array of strings usually works with array of strings.
      // Let's assume input is comma separated string.
      const payload = {
        ...formData,
        branches: formData.branches.split(",").map(b => b.trim()).filter(b => b)
      };

      await createStudent(payload);
      setMessage("Student created successfully!");
      setFormData({
        name: "",
        fatherName: "",
        motherName: "",
        institution: "",
        class: "",
        studentId: "",
        password: "",
        mobile: "",
        address: "",
        branches: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("Error creating student. Check ID duplication.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Student ID"
          name="studentId"
          value={formData.studentId}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <Input
          label="Class"
          name="class"
          value={formData.class}
          onChange={handleChange}
          required
        />
        <Input
          label="Mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          required
        />
        <Input
          label="Institution"
          name="institution"
          value={formData.institution}
          onChange={handleChange}
        />
        <Input
          label="Father's Name"
          name="fatherName"
          value={formData.fatherName}
          onChange={handleChange}
          required
        />
        <Input
          label="Mother's Name"
          name="motherName"
          value={formData.motherName}
          onChange={handleChange}
          required
        />
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
        <Input
          label="Branches (comma sep)"
          name="branches"
          value={formData.branches}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded mt-4 hover:bg-gray-800 transition"
      >
        Create Student
      </button>
      {message && <p className="mt-2 text-sm text-center">{message}</p>}
    </form>
  );
}

function SearchStudentView() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    // Debounce search
    const delayDebounceFn = setTimeout(async () => {
      if (term.length > 0) {
        try {
          const data = await searchStudents(term);
          setResults(data);
        } catch (error) {
          console.error(error);
        }
      } else {
        setResults([]);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [term]);

  return (
    <div>
      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search by Name or ID..."
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-black"
        />
      </div>

      {selectedStudent ? (
        <StudentDetails
          student={selectedStudent}
          onBack={() => setSelectedStudent(null)}
        />
      ) : (
        <div className="space-y-2">
          {results.map((student) => (
            <div
              key={student._id}
              className="p-4 border border-gray-200 rounded flex justify-between items-center bg-white shadow-sm"
            >
              <div>
                <p className="font-semibold">{student.name}</p>
                <p className="text-sm text-gray-500">ID: {student.studentId}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(student)}
                className="text-sm border border-black px-3 py-1 rounded hover:bg-black hover:text-white transition"
              >
                Details
              </button>
            </div>
          ))}
          {results.length === 0 && term && <p className="text-gray-500">No students found.</p>}
        </div>
      )}
    </div>
  );
}

function StudentDetails({ student, onBack }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...student, password: "" }); // Don't show hash, allow new password
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const payload = { ...formData };
      if (!payload.password) delete payload.password; // Don't send empty password
      // Handle branches array/string conversion if edited
      if (typeof payload.branches === 'string') {
        payload.branches = payload.branches.split(",").map(b => b.trim()).filter(b => b);
      }

      const updated = await updateStudent(student._id, payload);
      setMessage("Saved successfully!");
      setIsEditing(false);
      // Usually we'd update the parent state or refetch, but for now we updated local formData
      // Ideally we should tell parent to refresh the list or update the selected item.
      // But keeping it simple.
    } catch (error) {
      console.error(error)
      setMessage("Error updating.");
    }
  };

  return (
    <div className="border border-gray-200 rounded p-6 bg-white shadow-sm max-w-2xl">
      <button onClick={onBack} className="text-sm text-gray-500 mb-4 hover:underline">
        &larr; Back to Results
      </button>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Student Details</h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-black text-white px-4 py-1 rounded text-sm hover:bg-gray-800"
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <DetailItem label="Name" name="name" value={formData.name} isEditing={isEditing} onChange={handleChange} />
        <DetailItem label="Student ID" name="studentId" value={formData.studentId} isEditing={isEditing} onChange={handleChange} />
        <DetailItem label="Class" name="class" value={formData.class} isEditing={isEditing} onChange={handleChange} />
        <DetailItem label="Institution" name="institution" value={formData.institution} isEditing={isEditing} onChange={handleChange} />
        <DetailItem label="Father's Name" name="fatherName" value={formData.fatherName} isEditing={isEditing} onChange={handleChange} />
        <DetailItem label="Mother's Name" name="motherName" value={formData.motherName} isEditing={isEditing} onChange={handleChange} />
        <DetailItem label="Mobile" name="mobile" value={formData.mobile} isEditing={isEditing} onChange={handleChange} />
        <DetailItem label="Address" name="address" value={formData.address} isEditing={isEditing} onChange={handleChange} />
        {isEditing && (
          <div className="col-span-2">
            <label className="block text-xs font-semibold text-gray-500 uppercase">New Password (leave blank to keep)</label>
            <input
              type="password"
              name="password"
              value={formData.password || ""}
              onChange={handleChange}
              className="w-full border-b border-gray-300 focus:border-black focus:outline-none py-1"
            />
          </div>
        )}
      </div>

      {isEditing && (
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Save Changes
          </button>
        </div>
      )}
      {message && <p className="mt-4 text-center text-sm">{message}</p>}
    </div>
  );
}

function DetailItem({ label, name, value, isEditing, onChange }) {
  return (
    <div className="mb-2">
      <label className="block text-xs font-semibold text-gray-500 uppercase">{label}</label>
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          className="w-full border-b border-gray-300 focus:border-black focus:outline-none py-1"
        />
      ) : (
        <p className="py-1 text-gray-900 border-b border-transparent">{value}</p>
      )}
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">{label}</label>
      <input
        {...props}
        className="border border-gray-300 rounded p-2 focus:outline-none focus:border-black transition"
      />
    </div>
  );
}
