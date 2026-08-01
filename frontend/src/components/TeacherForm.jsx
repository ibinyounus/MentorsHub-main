import { useState } from "react";
import api from "../services/api";

export default function TeacherForm() {
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/admin/teachers", {
        ...form,
        branches: form.branches?.split(","),
      });
      alert("Teacher created successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating teacher");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="teacherId" placeholder="Teacher ID" onChange={handleChange} />
      <input name="mobile1" placeholder="Mobile 1" onChange={handleChange} />
      <input name="mobile2" placeholder="Mobile 2" onChange={handleChange} />
      <input name="institution" placeholder="Institution" onChange={handleChange} />
      <input name="address" placeholder="Address" onChange={handleChange} />
      <input name="branches" placeholder="Branches (comma)" onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} />

      <button type="submit">Create Teacher</button>
    </form>
  );
}
