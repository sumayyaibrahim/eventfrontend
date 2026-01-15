import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../authapi";

function Login({ setToken, setRole }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(form);

      // Save token & role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      // Update App state via props
      setToken(data.token);
      setRole(data.user.role);

      alert("Login successful");

      // Navigate based on role
      navigate(data.user.role === "admin" ? "/admin" : "/user", {
        replace: true,
      });
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(40,20,60,.85),rgba(40,20,60,.85)),url(https://images.unsplash.com/photo-1519681393784-d120267933ba)",
      }}
      
    >
        
      <div className="bg-lavenderDark w-[350px] p-8 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-semibold text-lavenderLight text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white outline-none"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-white outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-lavender hover:bg-purple-700 text-white py-2 rounded transition"
          >
            Login
          </button>
        </form>

        {/* SIGN UP LINK */}
        <p className="text-center text-white mt-4 text-sm">
          Not registered?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-red-700 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
