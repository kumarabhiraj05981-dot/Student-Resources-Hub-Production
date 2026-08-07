import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      console.log("LOGIN API:", api.defaults.baseURL);

      const res = await api.post("/api/auth/login", {
        email: email.trim(),
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      if (!res.data?.success || !res.data?.token) {
        throw new Error(
          res.data?.message || "Login failed"
        );
      }

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      navigate("/");

    } catch (err: any) {

      console.error(
        "LOGIN ERROR:",
        err.response?.data || err
      );

      if (err.response) {

        alert(
          err.response.data?.message ||
          `Login failed (${err.response.status})`
        );

      } else if (err.request) {

        alert(
          "Backend se connection nahi ho raha. VITE_API_URL check karo."
        );

      } else {

        alert(
          err.message || "Login Failed"
        );

      }

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-blue-700 mb-2">
          🔐 Login
        </h1>

        <p className="text-gray-600 mb-6">
          Login to Student Resources Hub
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* Email */}

          <div>

            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>


          {/* Password */}

          <div>

            <label className="block font-semibold mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>


          {/* Button */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white font-bold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

      </div>

    </div>
  );
}