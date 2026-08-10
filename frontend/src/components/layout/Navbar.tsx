import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const userString = localStorage.getItem("user");

      setIsLoggedIn(Boolean(token));

      if (userString) {
        try {
          const user = JSON.parse(userString);
          setIsAdmin(user?.role === "admin");
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setIsAdmin(false);

    closeMobileMenu();

    navigate("/login");
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
      "relative",
      "px-3",
      "py-2",
      "rounded-lg",
      "text-sm",
      "font-semibold",
      "transition",
      isActive
        ? "text-blue-700 bg-blue-50"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
    ].join(" ");

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">

      <div className="page-container">

        <div className="flex h-[68px] items-center justify-between gap-4">

          {/* =================================
              BRAND
          ================================= */}

          <Link
            to="/"
            onClick={closeMobileMenu}
            className="flex items-center gap-3 shrink-0"
          >

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              SR
            </div>

            <div className="hidden sm:block">
              <div className="text-[15px] font-extrabold leading-tight text-gray-900">
                Student Resources
              </div>

              <div className="text-xs font-medium text-gray-500">
                Hub
              </div>
            </div>

          </Link>


          {/* =================================
              DESKTOP NAVIGATION
          ================================= */}

          <nav className="hidden lg:flex items-center gap-1">

            <NavLink to="/" className={navClass}>
              Home
            </NavLink>

            <NavLink to="/notes" className={navClass}>
              Notes
            </NavLink>

            <NavLink to="/pyq" className={navClass}>
              PYQ
            </NavLink>

            <NavLink to="/syllabus" className={navClass}>
              Syllabus
            </NavLink>

            <NavLink to="/ebooks" className={navClass}>
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
              className={navClass}
            >
              AI Paper
            </NavLink>

          </nav>


          {/* =================================
              DESKTOP ACTIONS
          ================================= */}

          <div className="hidden md:flex items-center gap-2">

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  [
                    "px-3",
                    "py-2",
                    "rounded-lg",
                    "text-sm",
                    "font-bold",
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-700 hover:bg-gray-100",
                  ].join(" ")
                }
              >
                Admin
              </NavLink>
            )}

            {isLoggedIn ? (
              <button
                type="button"
                onClick={handleLogout}
                className="secondary-button min-h-[40px] px-4"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="secondary-button min-h-[40px] px-4"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="primary-button min-h-[40px] px-4"
                >
                  Register
                </Link>
              </>
            )}

          </div>


          {/* =================================
              MOBILE MENU BUTTON
          ================================= */}

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={() =>
              setMobileOpen((prev) => !prev)
            }
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>

        </div>


        {/* =================================
            MOBILE NAVIGATION
        ================================= */}

        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">

            <nav className="flex flex-col gap-1">

              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className={navClass}
              >
                Home
              </NavLink>

              <NavLink
                to="/notes"
                onClick={closeMobileMenu}
                className={navClass}
              >
                Notes
              </NavLink>

              <NavLink
                to="/pyq"
                onClick={closeMobileMenu}
                className={navClass}
              >
                PYQ
              </NavLink>

              <NavLink
                to="/syllabus"
                onClick={closeMobileMenu}
                className={navClass}
              >
                Syllabus
              </NavLink>

              <NavLink
                to="/ebooks"
                onClick={closeMobileMenu}
                className={navClass}
              >
                E-Books
              </NavLink>

              <NavLink
                to="/branches"
                onClick={closeMobileMenu}
                className={navClass}
              >
                Branches
              </NavLink>

              <NavLink
                to="/ai-question-paper"
                onClick={closeMobileMenu}
                className={navClass}
              >
                AI Question Paper
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={closeMobileMenu}
                  className={navClass}
                >
                  Admin Dashboard
                </NavLink>
              )}

            </nav>


            {/* MOBILE ACTIONS */}

            <div className="mt-4 border-t border-gray-100 pt-4">

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="secondary-button"
                >
                  Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2">

                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="secondary-button"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="primary-button"
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
