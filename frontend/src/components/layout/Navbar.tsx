import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
}

const branches = [
  {
    id: "cse",
    name: "Computer Science Engineering",
    shortName: "CSE",
    icon: "💻",
  },
  {
    id: "electrical",
    name: "Electrical Engineering",
    shortName: "Electrical",
    icon: "⚡",
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    shortName: "Mechanical",
    icon: "🔧",
  },
  {
    id: "civil-ctm",
    name: "Civil Engineering / CTM",
    shortName: "Civil / CTM",
    icon: "🏗️",
  },
  {
    id: "leather",
    name: "Leather Technology",
    shortName: "Leather",
    icon: "👞",
  },
];

export default function Navbar() {
  const navigate = useNavigate();

  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState<User | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  const [branchOpen, setBranchOpen] = useState(false);

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
    setBranchOpen(false);

    navigate("/login");
  };

  // ======================================
  // CLOSE MOBILE MENU
  // ======================================

  const closeMenu = () => {
    setMenuOpen(false);
    setBranchOpen(false);
  };

  // ======================================
  // OPEN BRANCH
  // ======================================

  const openBranch = (branchId: string) => {
    setBranchOpen(false);
    setMenuOpen(false);

    navigate(`/branch/${branchId}`);
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


            {/* ==============================
                BRANCH DROPDOWN
            ============================== */}

            <div className="relative">

              <button
                type="button"
                onClick={() => setBranchOpen(!branchOpen)}
                className="hover:text-blue-200 transition font-medium flex items-center gap-1"
              >
                🎓 Branch
                <span
                  className={`transition-transform duration-200 ${
                    branchOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>


              {branchOpen && (

                <div className="absolute top-full left-0 mt-3 w-72 bg-white text-gray-800 rounded-xl shadow-2xl overflow-hidden border border-blue-100">

                  <div className="px-4 py-3 bg-blue-50 border-b">
                    <p className="font-bold text-blue-700">
                      🎓 Select Your Branch
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      Choose your engineering branch
                    </p>
                  </div>


                  <div className="py-2">

                    {branches.map((branch) => (

                      <button
                        key={branch.id}
                        type="button"
                        onClick={() => openBranch(branch.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-50 transition"
                      >

                        <span className="text-2xl">
                          {branch.icon}
                        </span>

                        <span className="flex-1">

                          <span className="block font-bold text-gray-800">
                            {branch.shortName}
                          </span>

                          <span className="block text-xs text-gray-500">
                            {branch.name}
                          </span>

                        </span>

                        <span className="text-blue-500">
                          →
                        </span>

                      </button>

                    ))}

                  </div>

                </div>

              )}

            </div>


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
                AI QUESTION PAPER
            ============================== */}

            <Link
              to="/ai-question-paper"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition shadow"
            >
              🤖 AI Paper
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


              {/* ==============================
                  MOBILE BRANCH
              ============================== */}

              <div>

                <button
                  type="button"
                  onClick={() => setBranchOpen(!branchOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >

                  <span>
                    🎓 Branch
                  </span>

                  <span
                    className={`transition-transform duration-200 ${
                      branchOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>

                </button>


                {branchOpen && (

                  <div className="mt-2 ml-2 bg-blue-700 rounded-xl overflow-hidden">

                    {branches.map((branch) => (

                      <button
                        key={branch.id}
                        type="button"
                        onClick={() => openBranch(branch.id)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-blue-800 transition"
                      >

                        <span className="text-2xl">
                          {branch.icon}
                        </span>

                        <span className="flex-1">

                          <span className="block font-bold">
                            {branch.shortName}
                          </span>

                          <span className="block text-xs text-blue-200">
                            {branch.name}
                          </span>

                        </span>

                        <span>
                          →
                        </span>

                      </button>

                    ))}

                  </div>

                )}

              </div>


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
                  AI QUESTION PAPER MOBILE
              ============================== */}

              <Link
                to="/ai-question-paper"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg bg-white text-blue-600 font-bold hover:bg-blue-50 transition"
              >
                🤖 AI Question Paper
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
