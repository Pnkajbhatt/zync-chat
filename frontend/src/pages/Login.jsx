import { useState } from "react";
import { login } from "../api/api.js";
import useStore from "../store/useStore.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { connectSocket } from "../socket.js";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { setAuth, fetchChats } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await login(form);
      setAuth(data, data.token);
      connectSocket(data.token);
      await fetchChats();
      toast.success("Logged in!");
      navigate("/chat");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Login</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                className="input input-bordered w-full mt-2"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered w-full mt-2"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <button type="submit" className="btn btn-primary w-full mt-4">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
