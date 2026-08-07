import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

      const res = await api.post("/api/auth/login", {
        email: email.trim(),
        password,
      });

      if (!res.data?.success || !res.data?.token) {
        throw new Error(
          res.data?.message || "Login failed"
        );
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful 🎉");
      navigate("/");

    } catch (err: any) {
      console.error("LOGIN ERROR:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
        err.message ||
        "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* Logo / Heading */}

        <div className="text-center text-white mb-8">

          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-2xl mb-5">
            <span className="text-4xl">📚</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold">
            Student Resources Hub
          </h1>

          <p className="mt-2 text-blue-100">
            Your learning resources, all in one place
          </p>

        </div>


        {/* Login Card */}

        <div className="bg-white rounded-3xl shadow-2xl p-7 md:p-9">

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back 👋
            </h2>

            <p className="text-gray-500 mt-1">
              Login to continue to your account
            </p>

          </div>


          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* Email */}

            <div>

              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                  📧
                </span>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                  required
                />

              </div>

            </div>


            {/* Password */}

            <div>

              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                  🔒
                </span>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                  required
                />

              </div>

            </div>


            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5"
              }`}
            >

              {loading
                ? "Logging in..."
                : "🔐 Login"}

            </button>

          </form>


          {/* Register */}

          <div className="relative my-7">

            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-sm text-gray-400">
                New to Student Resources Hub?
              </span>
            </div>

          </div>

          <Link
            to="/register"
            className="block w-full text-center border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-bold py-3 rounded-xl transition"
          >
            ✨ Create New Account
          </Link>

        </div>


        <p className="text-center text-blue-100 text-sm mt-6">
          © Student Resources Hub
        </p>

      </div>

    </div>
  );
}