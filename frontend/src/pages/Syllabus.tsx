import { useEffect, useMemo, useState } from "react";
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
}

export default function Syllabus() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FILTER STATES
  // ==========================================

  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");

  // ==========================================
  // LOAD SYLLABUS
  // ==========================================

  const loadSyllabus = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get(
        "/api/resources/category/Syllabus"
      );

      console.log("SYLLABUS API RESPONSE:", res.data);

      const allResources = Array.isArray(
        res.data?.resources
      )
        ? res.data.resources
        : [];

      const syllabusOnly = allResources.filter(
        (item: Resource) =>
          item.category?.trim().toLowerCase() ===
          "syllabus"
      );

      console.log(
        "SYLLABUS FILTERED:",
        syllabusOnly
      );

      setResources(syllabusOnly);

    } catch (err: any) {
      console.error(
        "Syllabus loading error:",
        err.response?.data || err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load syllabus. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSyllabus();
  }, []);

  // ==========================================
  // UNIQUE SEMESTERS
  // ==========================================

  const semesters = useMemo(() => {
    const values = resources
      .map((resource) =>
        resource.semester?.trim()
      )
      .filter(Boolean);

    return Array.from(
      new Set(values)
    );
  }, [resources]);

  // ==========================================
  // UNIQUE SUBJECTS
  // ==========================================

  const subjects = useMemo(() => {
    const values = resources
      .map((resource) =>
        resource.subject?.trim()
      )
      .filter(Boolean);

    return Array.from(
      new Set(values)
    ).sort();
  }, [resources]);

  // ==========================================
  // FILTER SYLLABUS
  // ==========================================

  const filteredResources = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return resources.filter((resource) => {

      const title =
        resource.title?.toLowerCase() || "";

      const description =
        resource.description?.toLowerCase() || "";

      const subject =
        resource.subject?.toLowerCase() || "";

      const semester =
        resource.semester?.toLowerCase() || "";

      const fileName =
        resource.fileName?.toLowerCase() || "";

      // SEARCH

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        description.includes(searchText) ||
        subject.includes(searchText) ||
        semester.includes(searchText) ||
        fileName.includes(searchText);

      // SEMESTER

      const matchesSemester =
        semesterFilter === "All" ||
        resource.semester === semesterFilter;

      // SUBJECT

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

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSearch("");
    setSemesterFilter("All");
    setSubjectFilter("All");
  };

  const filtersActive =
    search.trim() !== "" ||
    semesterFilter !== "All" ||
    subjectFilter !== "All";

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">

        <div className="text-center">

          <div className="text-6xl mb-4">
            📘
          </div>

          <p className="text-xl font-semibold text-gray-700">
            Loading Syllabus...
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Please wait
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // MAIN PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-purple-700 mb-2">
            📘 Student Syllabus
          </h1>

          <p className="text-gray-600">
            Semester-wise syllabus and course documents
          </p>

          {resources.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              📚 Showing{" "}
              <span className="font-semibold">
                {filteredResources.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold">
                {resources.length}
              </span>{" "}
              syllabus
            </p>
          )}

        </div>

        {/* ERROR */}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6">

            <p className="font-semibold">
              ❌ {error}
            </p>

            <button
              onClick={loadSyllabus}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              🔄 Try Again
            </button>

          </div>
        )}

        {/* ======================================
            SEARCH + FILTERS
        ====================================== */}

        {resources.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-5 mb-8">

            <div className="grid md:grid-cols-3 gap-4">

              {/* SEARCH */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🔎 Search Syllabus
                </label>

                <input
                  type="text"
                  placeholder="Search title, subject..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
                    setSemesterFilter(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-purple-500"
                >

                  <option value="All">
                    All Semesters
                  </option>

                  {semesters.map(
                    (semester) => (
                      <option
                        key={semester}
                        value={semester}
                      >
                        {semester}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* SUBJECT */}

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  📚 Subject
                </label>

                <select
                  value={subjectFilter}
                  onChange={(e) =>
                    setSubjectFilter(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-purple-500"
                >

                  <option value="All">
                    All Subjects
                  </option>

                  {subjects.map(
                    (subject) => (
                      <option
                        key={subject}
                        value={subject}
                      >
                        {subject}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            {/* FILTER INFO */}

            <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t">

              <p className="text-gray-600">

                Showing{" "}

                <span className="font-bold text-purple-600">
                  {filteredResources.length}
                </span>{" "}

                of{" "}

                <span className="font-bold">
                  {resources.length}
                </span>{" "}

                syllabus

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
            NO SYLLABUS
        ====================================== */}

        {!error && resources.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <div className="text-6xl mb-4">
              📘
            </div>

            <p className="text-xl font-semibold text-gray-700">
              No Syllabus uploaded yet.
            </p>

            <p className="text-gray-500 mt-2">
              Syllabus uploaded by the admin
              will appear here.
            </p>

          </div>

        ) : filteredResources.length === 0 ? (

          /* NO SEARCH RESULT */

          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <div className="text-6xl mb-4">
              🔎
            </div>

            <p className="text-xl font-semibold text-gray-700">
              No matching syllabus found.
            </p>

            <p className="text-gray-500 mt-2">
              Try another search, semester
              or subject.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              🔄 Show All Syllabus
            </button>

          </div>

        ) : (

          /* ======================================
             SYLLABUS CARDS
          ====================================== */

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredResources.map(
              (resource) => (

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
                      Syllabus
                    </span>

                  </div>

                  {/* SEMESTER */}

                  {resource.semester && (
                    <div className="mt-4">

                      <p className="text-sm font-semibold text-purple-600">
                        🎓 Semester
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
                        📚 Subject
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
                        📄 {resource.fileName}
                      </p>

                    </div>
                  )}

                  {/* BUTTONS */}

                  <div className="flex gap-3 mt-6">

                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition"
                    >
                      👁️ Open
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
                      ⬇️ Download
                    </a>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}