import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // ==============================
    // VALIDATION
    // ==============================

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      alert("Please enter your email");
      return;
    }

    if (!password) {
      alert("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      // ==============================
      // LOGIN API
      // ==============================

      const res = await api.post("/api/auth/login", {
        email: cleanEmail,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      // ==============================
      // CHECK RESPONSE
      // ==============================

      if (!res.data?.success) {
        throw new Error(
          res.data?.message || "Login failed"
        );
      }

      if (!res.data?.token) {
        throw new Error(
          "Login successful but authentication token was not received"
        );
      }

      // ==============================
      // USER DATA
      // ==============================

      const user: User = res.data.user || {};

      console.log("LOGGED IN USER:", user);
      console.log("USER ROLE:", user.role);

      // ==============================
      // SAVE TOKEN
      // ==============================

      localStorage.setItem(
        "token",
        res.data.token
      );

      // ==============================
      // SAVE USER
      // ==============================

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // ==============================
      // SUCCESS
      // ==============================

      alert(
        user.role?.toLowerCase() === "admin"
          ? "Admin Login Successful 🎉"
          : "Login Successful 🎉"
      );

      // ==============================
      // REDIRECT
      // ==============================

      navigate("/", {
        replace: true,
      });

    } catch (err: any) {

      console.error(
        "LOGIN ERROR:",
        err.response?.data || err
      );

      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";

      alert(`❌ ${message}`);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        {/* ==============================
            LOGO
        ============================== */}

        <div className="text-center text-white mb-8">

          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-2xl mb-5">
            <span className="text-4xl">
              📚
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold">
            Student Resources Hub
          </h1>

          <p className="mt-2 text-blue-100">
            Your learning resources, all in one place
          </p>

        </div>


        {/* ==============================
            LOGIN CARD
        ============================== */}

        <div className="bg-white rounded-3xl shadow-2xl p-7 md:p-9">

          <div className="mb-7">

            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back 👋
            </h2>

            <p className="text-gray-500 mt-1">
              Login to continue to your account
            </p>

          </div>


          {/* ==============================
              LOGIN FORM
          ============================== */}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* EMAIL */}

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
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                  required
                />

              </div>

            </div>


            {/* PASSWORD */}

            <div>

              <label className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                  🔒
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  autoComplete="current-password"
                  className="w-full pl-12 pr-14 py-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition"
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "🙈"
                    : "👁️"}
                </button>

              </div>

            </div>


            {/* LOGIN BUTTON */}

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
                ? "⏳ Logging in..."
                : "🔐 Login"}

            </button>

          </form>


          {/* ==============================
              REGISTER
          ============================== */}

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


        {/* FOOTER */}

        <p className="text-center text-blue-100 text-sm mt-6">
          © {new Date().getFullYear()} Student Resources Hub
        </p>

      </div>

    </div>
  );
}