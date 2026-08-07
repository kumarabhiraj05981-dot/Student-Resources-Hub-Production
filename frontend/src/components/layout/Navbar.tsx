import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold">
          📚 Student Resources Hub
        </h1>

        <div className="flex gap-6 items-center">
          <Link to="/">Home</Link>
          <Link to="/notes">Notes</Link>
          <Link to="/pyq">PYQ</Link>
          <Link to="/syllabus">Syllabus</Link>
          <Link to="/ebooks">E-books</Link>

          {!token ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          )}

          <Link to="/admin">Admin</Link>
        </div>
      </div>
    </nav>
  );
}