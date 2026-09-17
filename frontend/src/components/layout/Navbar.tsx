import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

const branches = [
  {
    id: "cse",
    name: "Computer Science Engineering",
  },
  {
    id: "electrical",
    name: "Electrical Engineering",
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
  },
  {
    id: "civil-ctm",
    name: "Civil Engineering / CTM",
  },
  {
    id: "electronics",
    name: "Electronics Engineering",
  },
  {
    id: "leather",
    name: "Leather Technology",
  },
];

const resourceLinks = [
  {
    name: "Notes",
    path: "/notes",
    description: "Subject-wise study notes",
  },
  {
    name: "PYQ",
    path: "/pyq",
    description: "Previous year questions",
  },
  {
    name: "Syllabus",
    path: "/syllabus",
    description: "Semester-wise syllabus",
  },
  {
    name: "E-Books",
    path: "/ebooks",
    description: "Useful study books",
  },
];

const studyLinks = [
  {
    name: "AI Study Assistant",
    path: "/study-assistant",
    description: "Ask AI your study questions",
  },
  {
    name: "AI Question Paper",
    path: "/ai-question-paper",
    description: "Generate practice papers with AI",
  },
  {
    name: "Study Planner",
    path: "/study-planner",
    description: "Plan your study schedule",
  },
];

export default function Navbar() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

        const role = String(user?.role || "")
          .trim()
          .toLowerCase();

        setIsAdmin(role === "admin");
      } catch {
        setIsAdmin(false);
      }
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileSection(null);
  };

  const toggleMobileSection = (section: string) => {
    setMobileSection((previous) =>
      previous === section ? null : section
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setIsAdmin(false);

    window.dispatchEvent(new Event("auth-change"));

    closeMobileMenu();
    navigate("/login");
  };

  const navClass = ({ isActive }: { isActive: boolean }) =>
    [
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

  const dropdownButtonClass =
    "flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-semibold text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900";

  const dropdownItemClass =
    "block rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-gray-50";

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[72px] items-center justify-between gap-4">

          {/* BRAND */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="group flex shrink-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-sm font-extrabold tracking-wide text-white shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md">
              SR
            </div>

            <div className="hidden sm:block">
              <div className="text-[15px] font-extrabold leading-tight tracking-tight text-gray-900">
                Student Resources
              </div>

              <div className="mt-0.5 text-xs font-medium text-gray-500">
                Study smarter. Prepare better.
              </div>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-1 lg:flex">

            {/* HOME */}
            <NavLink to="/" end className={navClass}>
              Home
            </NavLink>

            {/* RESOURCES DROPDOWN */}
            <div className="group relative">
              <button
                type="button"
                className={dropdownButtonClass}
              >
                Resources
                <span className="text-xs transition-transform duration-200 group-hover:rotate-180">
                  ▼
                </span>
              </button>

              <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-200/50">

                  {resourceLinks.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={dropdownItemClass}
                    >
                      <div className="text-sm font-bold text-gray-800">
                        {item.name}
                      </div>

                      <div className="mt-0.5 text-xs text-gray-500">
                        {item.description}
                      </div>
                    </NavLink>
                  ))}

                </div>
              </div>
            </div>

            {/* BRANCHES DROPDOWN */}
            <div className="group relative">
              <button
                type="button"
                className={dropdownButtonClass}
              >
                Branches
                <span className="text-xs transition-transform duration-200 group-hover:rotate-180">
                  ▼
                </span>
              </button>

              <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-200/50">

                  <NavLink
                    to="/branch-resources"
                    className="mb-1 block rounded-xl px-3 py-2.5 text-sm font-bold text-blue-700 transition-all duration-200 hover:bg-blue-50"
                  >
                    All Branch Resources
                  </NavLink>

                  <div className="my-1 border-t border-gray-100" />

                  {branches.map((branch) => (
                    <NavLink
                      key={branch.id}
                      to={`/branch-resources/${branch.id}`}
                      className={dropdownItemClass}
                    >
                      <div className="text-sm font-semibold text-gray-800">
                        {branch.name}
                      </div>
                    </NavLink>
                  ))}

                </div>
              </div>
            </div>

            {/* STUDY & AI DROPDOWN */}
            <div className="group relative">
              <button
                type="button"
                className={dropdownButtonClass}
              >
                Study & AI
                <span className="text-xs transition-transform duration-200 group-hover:rotate-180">
                  ▼
                </span>
              </button>

              <div className="pointer-events-none invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:opacity-100">
                <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-200/50">

                  {studyLinks.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={dropdownItemClass}
                    >
                      <div className="text-sm font-bold text-gray-800">
                        {item.name}
                      </div>

                      <div className="mt-0.5 text-xs text-gray-500">
                        {item.description}
                      </div>
                    </NavLink>
                  ))}

                </div>
              </div>
            </div>

            {/* DASHBOARD */}
            {isLoggedIn && (
              <NavLink to="/dashboard" className={navClass}>
                Dashboard
              </NavLink>
            )}

            {/* BOOKMARKS */}
            {isLoggedIn && (
              <NavLink to="/bookmarks" className={navClass}>
                Bookmarks
              </NavLink>
            )}
          </nav>

          {/* DESKTOP ACCOUNT ACTIONS */}
          <div className="hidden items-center gap-2 md:flex">

            {/* PROFILE - SEPARATE */}
            {isLoggedIn && (
              <NavLink
                to="/profile"
                className={navClass}
              >
                Profile
              </NavLink>
            )}

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
                    "whitespace-nowrap",
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
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow active:scale-[0.98]"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((previous) => !previous)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-lg text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 md:hidden"
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">

            <nav className="flex flex-col gap-1">

              {/* HOME */}
              <NavLink
                to="/"
                end
                onClick={closeMobileMenu}
                className={mobileNavClass}
              >
                <span>Home</span>
                <span className="text-gray-400">→</span>
              </NavLink>

              {/* RESOURCES MOBILE DROPDOWN */}
              <div className="rounded-xl">
                <button
                  type="button"
                  onClick={() => toggleMobileSection("resources")}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
                >
                  <span>Resources</span>

                  <span
                    className={`text-xs text-gray-400 transition-transform duration-200 ${
                      mobileSection === "resources"
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {mobileSection === "resources" && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">

                    {resourceLinks.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {item.name}
                      </NavLink>
                    ))}

                  </div>
                )}
              </div>

              {/* BRANCHES MOBILE DROPDOWN */}
              <div className="rounded-xl">
                <button
                  type="button"
                  onClick={() => toggleMobileSection("branches")}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
                >
                  <span>Branches</span>

                  <span
                    className={`text-xs text-gray-400 transition-transform duration-200 ${
                      mobileSection === "branches"
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {mobileSection === "branches" && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">

                    <NavLink
                      to="/branch-resources"
                      onClick={closeMobileMenu}
                      className="block rounded-lg px-3 py-2.5 text-sm font-bold text-blue-700 hover:bg-blue-50"
                    >
                      All Branch Resources
                    </NavLink>

                    {branches.map((branch) => (
                      <NavLink
                        key={branch.id}
                        to={`/branch-resources/${branch.id}`}
                        onClick={closeMobileMenu}
                        className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {branch.name}
                      </NavLink>
                    ))}

                  </div>
                )}
              </div>

              {/* STUDY & AI MOBILE DROPDOWN */}
              <div className="rounded-xl">
                <button
                  type="button"
                  onClick={() => toggleMobileSection("study")}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-50"
                >
                  <span>Study & AI</span>

                  <span
                    className={`text-xs text-gray-400 transition-transform duration-200 ${
                      mobileSection === "study"
                        ? "rotate-180"
                        : ""
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {mobileSection === "study" && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-gray-100 pl-2">

                    {studyLinks.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={closeMobileMenu}
                        className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      >
                        {item.name}
                      </NavLink>
                    ))}

                  </div>
                )}
              </div>

              {/* DASHBOARD */}
              {isLoggedIn && (
                <NavLink
                  to="/dashboard"
                  onClick={closeMobileMenu}
                  className={mobileNavClass}
                >
                  <span>Dashboard</span>
                  <span className="text-gray-400">→</span>
                </NavLink>
              )}

              {/* BOOKMARKS */}
              {isLoggedIn && (
                <NavLink
                  to="/bookmarks"
                  onClick={closeMobileMenu}
                  className={mobileNavClass}
                >
                  <span>Bookmarks</span>
                  <span className="text-gray-400">→</span>
                </NavLink>
              )}

              {/* PROFILE - SEPARATE */}
              {isLoggedIn && (
                <NavLink
                  to="/profile"
                  onClick={closeMobileMenu}
                  className={mobileNavClass}
                >
                  <span>Profile</span>
                  <span className="text-gray-400">→</span>
                </NavLink>
              )}

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

            {/* MOBILE ACCOUNT ACTIONS */}
            <div className="mt-4 border-t border-gray-100 pt-4">

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">

                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-bold text-gray-700 transition-all duration-200 hover:bg-gray-50"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="rounded-xl bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white transition-all duration-200 hover:bg-blue-700"
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