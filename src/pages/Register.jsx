import { useState } from "react";
import { registerUser } from "../authapi";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
const navigate=useNavigate();
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert("Registered successfully");
           navigate('/login')
    } catch {
      alert("Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(40,20,60,.85),rgba(40,20,60,.85)),url(https://images.unsplash.com/photo-1519681393784-d120267933ba)"
      }}
    >
      <div className="bg-lavenderDark w-[350px] p-8 rounded-xl shadow-2xl">
        <h2 className="text-2xl font-semibold text-lavenderLight text-center mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full p-2 rounded bg-white outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-2 rounded bg-white outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-2 rounded bg-white outline-none"
            required
          />

          <button
            type="submit"
            className="w-full bg-lavender hover:bg-purple-700 text-white py-2 rounded transition"
          >
            Register
          </button>
          <Link   className=" p-2 rounded text-white "to="/login">LOGIN</Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
