import { useState } from "react";
import API from "../api";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit() {
    const res = await API.post("/auth/login", { email, password });
    if (res.data.success) {
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
    } else {
      alert(res.data.message);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={submit}>Login</button>
    </div>
  );
}
