import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Errors from "./pages/Errors";
import { Layout } from "./components/layout/Layout";

function App() {

  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  // Keep auth state in sync if token is removed (e.g. logout from another tab or Sidebar)
  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Re-check on every navigation (handles in-tab logout via Sidebar)
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [location.pathname]);

  return (

    <Routes>

      {!token ? (
        <>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/errors" element={<Errors />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      )}

    </Routes>

  );

}

export default App;