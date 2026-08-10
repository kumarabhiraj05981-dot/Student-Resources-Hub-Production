import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // ==========================================
  // AUTH CHECK
  // ==========================================

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      setIsLoggedIn(Boolean(token));

      if (!userString) {
        setIsAdmin(false);
        return;
      }

      try {
        const user = JSON.parse(userString);
        setIsAdmin(user?.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  // ==========================================
  // CLOSE MOBILE MENU
  // ==========================================

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setIsAdmin(false);

    closeMobileMenu();

    navigate("/login");
  };

  // ==========================================
  // NAV LINK STYLE
  // ==========================================

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      "group",
      "relative",
      "rounded-lg",
      "px-3.5",
      "py-2",
      "text-sm",
      "font-semibold",
      "transition-all",
      "duration-200",
      "whitespace-nowrap",

      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
    ].join(" ");

  // ==========================================
  // MOBILE LINK STYLE
  // ==========================================

  const mobileNavClass = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    [
      "flex",
      "items-center",
      "justify-between",
      "rounded-xl",
      "px-4",
      "py-3",
      "text-sm",
      "font-semibold",
      "transition-all",
      "duration-200",

      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-700 hover:bg-gray-50",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">

      {/* ==========================================
          MAIN NAVBAR
      ========================================== */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex min-h-[72px] items-center justify-between gap-4">

          {/* ======================================
              BRAND
          ====================================== */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex shrink-0 items-center gap-3"
          >

            {/* Logo Box */}

            <div
              className="
                flex h-11 w-11
                items-center justify-center
                rounded-xl
                border border-blue-100
                bg-blue-600
                text-sm
                font-extrabold
                tracking-wide
                text-white
                shadow-sm
                transition-all
                duration-200
                group-hover:-translate-y-0.5
                group-hover:shadow-md
              "
            >
              SR
            </div>

            {/* Brand Text */}

            <div className="hidden sm:block">

              <div className="text-[15px] font-extrabold leading-tight tracking-tight text-gray-900">
                Student Resources
              </div>

              <div className="mt-0.5 text-xs font-medium text-gray-500">
                Study smarter. Prepare better.
              </div>

            </div>

          </Link>


          {/* ======================================
              DESKTOP NAVIGATION
          ====================================== */}

          <nav className="hidden lg:flex items-center gap-1">

            <NavLink
              to="/"
              end
              className={navClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/notes"
              className={navClass}
            >
              Notes
            </NavLink>

            <NavLink
              to="/pyq"
              className={navClass}
            >
              PYQ
            </NavLink>

            <NavLink
              to="/syllabus"
              className={navClass}
            >
              Syllabus
            </NavLink>

            <NavLink
              to="/ebooks"
              className={navClass}
            >
              E-Books
            </NavLink>

            <NavLink
              to="/branches"
              className={navClass}
            >
              Branches
            </NavLink>

            <NavLink
              to="/ai-question-paper"
              className={({ isActive }) =>
                [
                  "rounded-lg",
                  "px-3.5",
                  "py-2",
                  "text-sm",
                  "font-bold",
                  "transition-all",
                  "duration-200",
                  "whitespace-nowrap",

                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-900 hover:text-white",
                ].join(" ")
              }
            >
              AI Paper
            </NavLink>

          </nav>


          {/* ======================================
              DESKTOP USER ACTIONS
          ====================================== */}

          <div className="hidden md:flex items-center gap-2">

            {/* ADMIN */}

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  [
                    "rounded-lg",
                    "border",
                    "px-3.5",
                    "py-2",
                    "text-sm",
                    "font-bold",
                    "transition-all",
                    "duration-200",

                    isActive
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50",
                  ].join(" ")
                }
              >
                Admin
              </NavLink>
            )}

            {/* LOGGED IN */}

            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="
                  rounded-lg
                  border border-gray-200
                  bg-white
                  px-4 py-2
                  text-sm
                  font-semibold
                  text-gray-700
                  transition-all
                  duration-200
                  hover:border-red-200
                  hover:bg-red-50
                  hover:text-red-600
                "
              >
                Logout
              </button>
            ) : (
              <>
                {/* LOGIN */}

                <Link
                  to="/login"
                  className="
                    rounded-lg
                    border border-gray-200
                    bg-white
                    px-4 py-2
                    text-sm
                    font-semibold
                    text-gray-700
                    transition-all
                    duration-200
                    hover:border-gray-300
                    hover:bg-gray-50
                  "
                >
                  Login
                </Link>

                {/* REGISTER */}

                <Link
                  to="/register"
                  className="
                    rounded-lg
                    bg-blue-600
                    px-4 py-2
                    text-sm
                    font-bold
                    text-white
                    shadow-sm
                    transition-all
                    duration-200
                    hover:bg-blue-700
                    hover:shadow
                    active:scale-[0.98]
                  "
                >
                  Register
                </Link>
              </>
            )}

          </div>


          {/* ======================================
              MOBILE MENU BUTTON
          ====================================== */}

          <button
            type="button"
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            onClick={() =>
              setMobileOpen((previous) => !previous)
            }
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-lg
              border border-gray-200
              bg-white
              text-lg
              text-gray-700
              transition-all
              duration-200
              hover:border-gray-300
              hover:bg-gray-50
              md:hidden
            "
          >
            {mobileOpen ? "✕" : "☰"}
          </button>

        </div>


        {/* ==========================================
            MOBILE MENU
        ========================================== */}

        {mobileOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">

            {/* MOBILE NAVIGATION */}

            <nav className="flex flex-col gap-1">

              <NavLink
                to="/"
                end
                onClick={closeMobileMenu}
                className={mobileNavClass}
              >
                <span>Home</span>
                <span className="text-gray-400">→</span>
              </NavLink>

              <NavLink
                to="/notes"
                onClick={closeMobileMenu}
                className={mobileNavClass}
              >
                <span>Notes</span>
                <span className="text-gray-400">→</span>
              </NavLink>

              <NavLink
                to="/pyq"
                onClick={closeMobileMenu}
                className={mobileNavClass}
              >
                <span>Previous Year Questions</span>
                <span className="text-gray-400">→</span>
              </NavLink>

              <NavLink
                to="/syllabus"
                onClick={closeMobileMenu}
                className={mobileNavClass}
              >
                <span>Syllabus</span>
                <span className="text-gray-400">→</span>
              </NavLink>

              <NavLink
                to="/ebooks"
                onClick={closeMobileMenu}
                className={mobileNavClass}
              >
                <span>E-Books</span>
                <span className="text-gray-400">→</span>
              </NavLink>

              <NavLink
                to="/branches"
                onClick={closeMobileMenu}
                className={mobileNavClass}
              >
                <span>Branches</span>
                <span className="text-gray-400">→</span>
              </NavLink>

              <NavLink
                to="/ai-question-paper"
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  [
                    "flex",
                    "items-center",
                    "justify-between",
                    "rounded-xl",
                    "px-4",
                    "py-3",
                    "text-sm",
                    "font-bold",
                    "transition-all",
                    "duration-200",

                    isActive
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50 text-gray-800 hover:bg-gray-100",
                  ].join(" ")
                }
              >
                <span>AI Question Paper</span>
                <span>→</span>
              </NavLink>


              {/* ADMIN */}

              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={closeMobileMenu}
                  className={mobileNavClass}
                >
                  <span>Admin Dashboard</span>
                  <span className="text-gray-400">→</span>
                </NavLink>
              )}

            </nav>


            {/* ======================================
                MOBILE ACCOUNT ACTIONS
            ====================================== */}

            <div className="mt-4 border-t border-gray-100 pt-4">

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    w-full
                    rounded-xl
                    border border-gray-200
                    bg-white
                    px-4 py-3
                    text-sm
                    font-bold
                    text-gray-700
                    transition-all
                    duration-200
                    hover:border-red-200
                    hover:bg-red-50
                    hover:text-red-600
                  "
                >
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">

                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="
                      rounded-xl
                      border border-gray-200
                      bg-white
                      px-4 py-3
                      text-center
                      text-sm
                      font-bold
                      text-gray-700
                      transition-all
                      duration-200
                      hover:bg-gray-50
                    "
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="
                      rounded-xl
                      bg-blue-600
                      px-4 py-3
                      text-center
                      text-sm
                      font-bold
                      text-white
                      transition-all
                      duration-200
                      hover:bg-blue-700
                    "
                  >
                    Register
                  </Link>

                </div>
              )}

            </div>

          </div>
        )}

      </div>

    </header>
  );
}
