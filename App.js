import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import "./styles/global.css";

function App() {
  const [user, setUser] = useState(null);

  if (!user)
    return (
      <div className="container">
        <h1>EdTech Task Manager</h1>

        <div className="section">
          <Login setUser={setUser} />
        </div>

        <div className="section">
          <Signup />
        </div>
      </div>
    );

  return (
    <div className="container">
      <Dashboard user={user} />
    </div>
  );
}

export default App;

