import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ChatLayout from "./pages/ChatLayout.jsx";

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/chat/*"
          element={token ? <ChatLayout /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
