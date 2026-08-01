import { useState } from "react";
import api from "../services/api";

export default function StudentForm() {
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/students", {
        ...form,
        branches: form.branches?.split(","),
      });
      alert("Student created successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating student");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="fatherName" placeholder="Father Name" onChange={handleChange} />
      <input name="motherName" placeholder="Mother Name" onChange={handleChange} />
      <input name="studentId" placeholder="Student ID" onChange={handleChange} />
      <input name="class" placeholder="Class" onChange={handleChange} />
      <input name="institution" placeholder="Institution" onChange={handleChange} />
      <input name="mobile" placeholder="Mobile" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="branches" placeholder="Branches (comma)" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <button type="submit">Create Student</button>
    </form>
  );
}
