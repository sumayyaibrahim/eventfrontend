


import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import User from "./pages/User";

import "./index.css";

function App() {
  // ✅ App state is reactive to token/role changes
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  // Optional: sync with localStorage in case user reloads page
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
     

      <Routes>
        {/* DEFAULT ROUTE */}
        <Route
          path="/"
          element={
            token
              ? role === "admin"
                ? <Navigate to="/admin" />
                : <Navigate to="/user" />
              : <Navigate to="/login" />
          }
        />

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            !token ? <Login setToken={setToken} setRole={setRole} /> : <Navigate to="/" />
          }
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/" />}
        />

        {/* ADMIN ROUTE */}
        <Route
          path="/admin"
          element={
            token && role === "admin" ? <Admin /> : <Navigate to="/login" />
          }
        />

        {/* USER ROUTE */}
        <Route
          path="/user"
          element={
            token && role === "user" ? <User setToken={setToken} setRole={setRole} /> : <Navigate to="/login" />
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
