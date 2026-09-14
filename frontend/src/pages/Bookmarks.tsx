import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../services/api";

interface Resource {
  _id: string;
  title: string;
  description?: string;
  category: string;
  semester: string;
  subject?: string;
  fileUrl: string;
  fileName?: string;
  createdAt: string;
  bookmarkId?: string;
  bookmarkedAt?: string;
}

export default function Bookmarks() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState("");

  // ==========================================
  // LOAD BOOKMARKS
  // ==========================================

  const loadBookmarks = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.get("/api/bookmarks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setResources(res.data.resources || []);
    } catch (err: any) {
      console.error(
        "Bookmarks loading error:",
        err.response?.data || err
      );

      if (err.response?.status === 401) {
        setError("Please login again to view your bookmarks.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load bookmarks. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  // ==========================================
  // REMOVE BOOKMARK
  // ==========================================

  const removeBookmark = async (resourceId: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first.");
      return;
    }

    try {
      setRemovingId(resourceId);

      await api.delete(
        `/api/bookmarks/${resourceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResources((currentResources) =>
        currentResources.filter(
          (resource) =>
            resource._id !== resourceId
        )
      );
    } catch (err: any) {
      console.error(
        "Remove bookmark error:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.message ||
          "Unable to remove bookmark."
      );
    } finally {
      setRemovingId("");
    }
  };

  // ==========================================
  // NOT LOGGED IN
  // ==========================================

  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-lg w-full">

            <div className="text-6xl mb-5">
              🔖
            </div>

            <h1 className="text-3xl font-bold text-gray-800">
              Login Required
            </h1>

            <p className="text-gray-600 mt-3">
              Please login to view and manage
              your bookmarked resources.
            </p>

            <Link
              to="/login"
              className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              Login
            </Link>

          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex flex-col">
        <Navbar />

        <main className="flex-1 flex items-center justify-center px-4">

          <div className="text-center">

            <div className="text-5xl mb-4">
              🔖
            </div>

            <p className="text-xl font-semibold text-gray-700">
              Loading Bookmarks...
            </p>

            <p className="text-sm text-gray-500 mt-2">
              Please wait
            </p>

          </div>

        </main>

        <Footer />
      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">

      <Navbar />

      <main className="flex-1 py-10 px-4">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}

          <div className="mb-8">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">

              <div>

                <h1 className="text-4xl font-bold text-purple-700 mb-2">
                  My Bookmarks
                </h1>

                <p className="text-gray-600">
                  Your saved study resources in one place
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  {resources.length}{" "}
                  {resources.length === 1
                    ? "resource"
                    : "resources"}{" "}
                  saved
                </p>

              </div>

              <Link
                to="/"
                className="inline-flex items-center justify-center bg-white border border-gray-300 hover:border-purple-400 hover:bg-purple-50 text-gray-700 font-semibold px-5 py-3 rounded-xl transition"
              >
                ← Browse Resources
              </Link>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6">

              <p className="font-semibold">
                ❌ {error}
              </p>

              <button
                type="button"
                onClick={loadBookmarks}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Try Again
              </button>

            </div>
          )}

          {/* EMPTY STATE */}

          {!error && resources.length === 0 ? (

            <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

              <div className="text-6xl mb-5">
                🔖
              </div>

              <h2 className="text-2xl font-bold text-gray-800">
                No Bookmarks Yet
              </h2>

              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Save Notes, PYQs, Syllabus and
                Ebooks using the Bookmark button.
                Your saved resources will appear here.
              </p>

              <Link
                to="/"
                className="inline-block mt-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition"
              >
                Explore Resources
              </Link>

            </div>

          ) : (

            /* BOOKMARK CARDS */

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {resources.map((resource) => (

                <div
                  key={resource._id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300"
                >

                  {/* TITLE + CATEGORY */}

                  <div className="flex justify-between items-start gap-3">

                    <h2 className="text-xl font-bold text-gray-800 break-words">
                      {resource.title}
                    </h2>

                    <span className="shrink-0 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {resource.category}
                    </span>

                  </div>

                  {/* SEMESTER */}

                  {resource.semester && (
                    <div className="mt-4">

                      <p className="text-sm font-semibold text-purple-600">
                        Semester
                      </p>

                      <p className="text-gray-700 mt-1">
                        {resource.semester}
                      </p>

                    </div>
                  )}

                  {/* SUBJECT */}

                  {resource.subject && (
                    <div className="mt-3">

                      <p className="text-sm font-semibold text-gray-500">
                        Subject
                      </p>

                      <p className="text-gray-700 mt-1">
                        {resource.subject}
                      </p>

                    </div>
                  )}

                  {/* DESCRIPTION */}

                  {resource.description && (
                    <div className="mt-3">

                      <p className="text-gray-600 line-clamp-3">
                        {resource.description}
                      </p>

                    </div>
                  )}

                  {/* FILE NAME */}

                  {resource.fileName && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-3">

                      <p
                        className="text-sm text-gray-600 truncate"
                        title={resource.fileName}
                      >
                        {resource.fileName}
                      </p>

                    </div>
                  )}

                  {/* BOOKMARK INFO */}

                  {resource.bookmarkedAt && (
                    <p className="text-xs text-gray-400 mt-3">
                      Saved on{" "}
                      {new Date(
                        resource.bookmarkedAt
                      ).toLocaleDateString()}
                    </p>
                  )}

                  {/* BUTTONS */}

                  <div className="flex gap-3 mt-6">

                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition"
                    >
                      Open
                    </a>

                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={
                        resource.fileName ||
                        undefined
                      }
                      className="flex-1 text-center bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-2.5 px-4 rounded-lg transition"
                    >
                      Download
                    </a>

                  </div>

                  {/* REMOVE BOOKMARK */}

                  <button
                    type="button"
                    onClick={() =>
                      removeBookmark(resource._id)
                    }
                    disabled={
                      removingId === resource._id
                    }
                    className="w-full mt-3 border border-red-300 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 px-4 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {removingId === resource._id
                      ? "Removing..."
                      : "★ Remove Bookmark"}
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

      </main>

      <Footer />

    </div>
  );
}