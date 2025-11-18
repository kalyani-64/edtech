import { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  async function load() {
    const res = await API.get("/tasks");
    setTasks(res.data.tasks);
  }

  async function createTask() {
    await API.post("/tasks", newTask);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Logged in as: <b>{user.email}</b></p>
      <p>Role: <b>{user.role}</b></p>

      <h3>Create Task</h3>
      <input placeholder="title" onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
      <input placeholder="description" onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
      <button onClick={createTask}>Add Task</button>

      <h3>Your Tasks</h3>
      {tasks.map((t) => (
        <div key={t._id}>
          <b>{t.title}</b> — {t.progress}
        </div>
      ))}
    </div>
  );
}
