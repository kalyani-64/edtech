import { useState, useEffect } from "react";
import API from "../api";

export default function Signup() {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student",
    teacherId: ""
  });

  // Load teacher list
  useEffect(() => {
    async function loadTeachers() {
      const res = await API.get("/auth/teachers");
      if (res.data.success) setTeachers(res.data.teachers);
    }
    loadTeachers();
  }, []);

  async function submit() {
    // Build correct payload
    const payload = {
      email: form.email,
      password: form.password,
      role: form.role,
    };

    if (form.role === "student") {
      if (!form.teacherId || form.teacherId.trim() === "") {
        alert("Please select a teacher");
        return;
      }
      payload.teacherId = form.teacherId;
    }

    const res = await API.post("/auth/signup", payload);
    alert(res.data.message || "Signup successful!");
  }

  function handleRoleChange(e) {
    const newRole = e.target.value;

    // reset teacherId when switching to teacher role
    setForm({
      ...form,
      role: newRole,
      teacherId: newRole === "student" ? form.teacherId : ""
    });
  }

  return (
    <>
      <h2>Signup</h2>

      <input
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <select onChange={handleRoleChange} value={form.role}>
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>

      {form.role === "student" && (
        <select
          value={form.teacherId}
          onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
        >
          <option value="">-- Select Teacher --</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.email}
            </option>
          ))}
        </select>
      )}

      <button onClick={submit}>Signup</button>
    </>
  );
}
