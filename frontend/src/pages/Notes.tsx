import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

interface Resource {
  _id: string;
  title: string;
  description?: string;
  category: string;
  subject?: string;
  semester: string;
  fileUrl: string;
  fileName?: string;
  createdAt: string;
}

export default function Notes() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Phase 1 Filters
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(
          "/api/resources/category/Notes"
        );

        console.log("NOTES RESPONSE:", res.data);

        const notesOnly = (res.data.resources || []).filter(
          (resource: Resource) =>
            resource.category?.trim().toLowerCase() === "notes"
        );

        console.log("FINAL NOTES:", notesOnly);

        setResources(notesOnly);
      } catch (err: any) {
        console.error("Notes loading error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load notes"
        );
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);

  // ======================================
  // UNIQUE SEMESTERS
  // ======================================

  const semesters = useMemo(() => {
    const values = resources
      .map((resource) => resource.semester?.trim())
      .filter(Boolean);

    return Array.from(new Set(values));
  }, [resources]);

  // ======================================
  // UNIQUE SUBJECTS
  // ======================================

  const subjects = useMemo(() => {
    const values = resources
      .map((resource) => resource.subject?.trim())
      .filter(Boolean);

    return Array.from(new Set(values)).sort();
  }, [resources]);

  // ======================================
  // FILTER NOTES
  // ======================================

  const filteredResources = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const title = resource.title?.toLowerCase() || "";
      const description =
        resource.description?.toLowerCase() || "";
      const subject =
        resource.subject?.toLowerCase() || "";
      const semester =
        resource.semester?.toLowerCase() || "";
      const fileName =
        resource.fileName?.toLowerCase() || "";

      // Search
      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        description.includes(searchText) ||
        subject.includes(searchText) ||
        semester.includes(searchText) ||
        fileName.includes(searchText);

      // Semester
      const matchesSemester =
        semesterFilter === "All" ||
        resource.semester === semesterFilter;

      // Subject
      const matchesSubject =
        subjectFilter === "All" ||
        resource.subject === subjectFilter;

      return (
        matchesSearch &&
        matchesSemester &&
        matchesSubject
      );
    });
  }, [
    resources,
    search,
    semesterFilter,
    subjectFilter,
  ]);

  // ======================================
  // CLEAR FILTERS
  // ======================================

  const clearFilters = () => {
    setSearch("");
    setSemesterFilter("All");
    setSubjectFilter("All");
  };

  const filtersActive =
    search.trim() !== "" ||
    semesterFilter !== "All" ||
    subjectFilter !== "All";

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>

          <p className="text-xl font-semibold text-gray-700">
            Loading Notes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">
            📚 Student Notes
          </h1>

          <p className="text-gray-600">
            Semester-wise study notes and learning materials
          </p>
        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6">
            ❌ {error}
          </div>
        )}

        {/* ======================================
            SEARCH + FILTERS
        ====================================== */}

        {resources.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-8">

            <div className="grid md:grid-cols-3 gap-4">

              {/* SEARCH */}

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔎 Search Notes
                </label>

                <input
                  type="text"
                  placeholder="Search by title, subject..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* SEMESTER */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🎓 Semester
                </label>

                <select
                  value={semesterFilter}
                  onChange={(e) =>
                    setSemesterFilter(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">
                    All Semesters
                  </option>

                  {semesters.map((semester) => (
                    <option
                      key={semester}
                      value={semester}
                    >
                      {semester}
                    </option>
                  ))}
                </select>
              </div>

              {/* SUBJECT */}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📖 Subject
                </label>

                <select
                  value={subjectFilter}
                  onChange={(e) =>
                    setSubjectFilter(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">
                    All Subjects
                  </option>

                  {subjects.map((subject) => (
                    <option
                      key={subject}
                      value={subject}
                    >
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {/* FILTER INFO */}

            <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t">

              <p className="text-gray-600">
                Showing{" "}
                <span className="font-bold text-blue-600">
                  {filteredResources.length}
                </span>{" "}
                of{" "}
                <span className="font-bold">
                  {resources.length}
                </span>{" "}
                notes
              </p>

              {filtersActive && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg transition"
                >
                  ✖ Clear Filters
                </button>
              )}

            </div>

          </div>
        )}

        {/* ======================================
            NO NOTES AT ALL
        ====================================== */}

        {resources.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <div className="text-6xl mb-4">
              📚
            </div>

            <p className="text-xl font-semibold text-gray-700">
              No Notes uploaded yet.
            </p>

            <p className="text-gray-500 mt-2">
              Notes uploaded by the admin will appear here.
            </p>

          </div>

        ) : filteredResources.length === 0 ? (

          /* ======================================
              NO SEARCH RESULT
          ====================================== */

          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <div className="text-6xl mb-4">
              🔎
            </div>

            <p className="text-xl font-semibold text-gray-700">
              No matching notes found.
            </p>

            <p className="text-gray-500 mt-2">
              Try another search, semester or subject.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              🔄 Show All Notes
            </button>

          </div>

        ) : (

          /* ======================================
              NOTES CARDS
          ====================================== */

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredResources.map((resource) => (

              <div
                key={resource._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300"
              >

                {/* TITLE */}

                <div className="flex justify-between items-start gap-3">

                  <h2 className="text-xl font-bold text-gray-800 break-words">
                    {resource.title}
                  </h2>

                  <span className="shrink-0 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Notes
                  </span>

                </div>

                {/* SEMESTER */}

                {resource.semester && (
                  <p className="mt-4 text-sm font-semibold text-blue-600">
                    🎓 Semester: {resource.semester}
                  </p>
                )}

                {/* SUBJECT */}

                {resource.subject && (
                  <p className="mt-2 text-sm font-semibold text-gray-500">
                    📖 Subject: {resource.subject}
                  </p>
                )}

                {/* DESCRIPTION */}

                {resource.description && (
                  <p className="mt-3 text-gray-600">
                    {resource.description}
                  </p>
                )}

                {/* FILE NAME */}

                {resource.fileName && (
                  <p className="mt-4 text-sm text-gray-500 truncate">
                    📄 {resource.fileName}
                  </p>
                )}

                {/* BUTTONS */}

                <div className="flex gap-3 mt-6">

                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition"
                  >
                    👁️ View PDF
                  </a>

                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={
                      resource.fileName || true
                    }
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition"
                  >
                    ⬇️ Download
                  </a>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </div>
  );
}