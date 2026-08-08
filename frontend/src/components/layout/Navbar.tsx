import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export default function Navbar() {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<User | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  // ======================================
  // LOAD LOGIN USER
  // ======================================

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Invalid user data:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }

    setToken(localStorage.getItem("token"));
  }, []);

  // ======================================
  // CHECK ADMIN
  // ======================================

  const isAdmin =
    token &&
    user &&
    user.role?.toLowerCase() === "admin";

  // ======================================
  // LOGOUT
  // ======================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setMenuOpen(false);

    navigate("/login");
  };

  // ======================================
  // CLOSE MOBILE MENU
  // ======================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 md:px-6">

        <div className="flex justify-between items-center py-4">

          {/* ==============================
              LOGO
          ============================== */}

          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">
              📚
            </span>

            <span className="text-lg md:text-2xl font-bold">
              Student Resources Hub
            </span>
          </Link>


          {/* ==============================
              DESKTOP MENU
          ============================== */}

          <div className="hidden lg:flex items-center gap-5">

            <Link
              to="/"
              className="hover:text-blue-200 transition font-medium"
            >
              🏠 Home
            </Link>

            <Link
              to="/notes"
              className="hover:text-blue-200 transition font-medium"
            >
              📄 Notes
            </Link>

            <Link
              to="/pyq"
              className="hover:text-blue-200 transition font-medium"
            >
              📝 PYQ
            </Link>

            <Link
              to="/syllabus"
              className="hover:text-blue-200 transition font-medium"
            >
              📘 Syllabus
            </Link>

            <Link
              to="/ebooks"
              className="hover:text-blue-200 transition font-medium"
            >
              📖 E-books
            </Link>


            {/* ==============================
                ADMIN ONLY
            ============================== */}

            {isAdmin && (
              <Link
                to="/admin"
                className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold hover:bg-yellow-300 transition"
              >
                ⚙️ Admin
              </Link>
            )}


            {/* ==============================
                AUTH
            ============================== */}

            {!token ? (
              <div className="flex items-center gap-3">

                <Link
                  to="/login"
                  className="hover:text-blue-200 transition font-medium"
                >
                  🔐 Login
                </Link>

                <Link
                  to="/register"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition"
                >
                  Register
                </Link>

              </div>
            ) : (

              <div className="flex items-center gap-3">

                {/* USER NAME */}

                {user?.name && (
                  <span className="text-sm font-semibold">
                    👤 {user.name}
                  </span>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  🚪 Logout
                </button>

              </div>

            )}

          </div>


          {/* ==============================
              MOBILE MENU BUTTON
          ============================== */}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden text-3xl focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>


        {/* ==============================
            MOBILE MENU
        ============================== */}

        {menuOpen && (

          <div className="lg:hidden pb-5 border-t border-blue-400 pt-4">

            <div className="flex flex-col gap-2">

              <Link
                to="/"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                🏠 Home
              </Link>

              <Link
                to="/notes"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                📄 Notes
              </Link>

              <Link
                to="/pyq"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                📝 PYQ
              </Link>

              <Link
                to="/syllabus"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                📘 Syllabus
              </Link>

              <Link
                to="/ebooks"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                📖 E-books
              </Link>


              {/* ==============================
                  ADMIN MOBILE ONLY
              ============================== */}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg bg-yellow-400 text-gray-900 font-bold"
                >
                  ⚙️ Admin Dashboard
                </Link>
              )}


              {/* ==============================
                  MOBILE AUTH
              ============================== */}

              {!token ? (

                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="px-4 py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    🔐 Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="px-4 py-3 rounded-lg bg-white text-blue-600 font-bold"
                  >
                    📝 Register
                  </Link>
                </>

              ) : (

                <>

                  {user?.name && (
                    <div className="px-4 py-3 text-blue-100">
                      👤 Logged in as{" "}
                      <span className="font-bold text-white">
                        {user.name}
                      </span>
                    </div>
                  )}

                  <button
                    onClick={handleLogout}
                    className="text-left px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 transition font-semibold"
                  >
                    🚪 Logout
                  </button>

                </>

              )}

            </div>

          </div>

        )}

      </div>

    </nav>
  );
}