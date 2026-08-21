import { useEffect, useMemo, useState } from "react";
import api from "../services/api";

interface Resource {
  _id: string;
  title: string;
  description?: string;
  category: string;
  semester?: string;
  subject?: string;
  fileUrl: string;
  fileName?: string;
  createdAt?: string;
}

export default function PYQ() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");

  const loadPYQ = async () => {
    try {
      setLoading(true);
      setError("");

      // Backend API unchanged
      const response = await api.get("/api/resources/category/PYQ");

      const data = response.data;

      if (!data?.success) {
        throw new Error(data?.message || "Unable to load PYQs");
      }

      const apiResources = Array.isArray(data.resources)
        ? data.resources
        : [];

      const pyqResources = apiResources.filter(
        (resource: Resource) =>
          String(resource.category || "")
            .trim()
            .toLowerCase() === "pyq"
      );

      setResources(pyqResources);
    } catch (err: any) {
      console.error("PYQ loading error:", err);

      setResources([]);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to load PYQs"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPYQ();
  }, []);

  const semesters = useMemo(() => {
    const values = resources
      .map((resource) => resource.semester?.trim())
      .filter(Boolean);

    return Array.from(new Set(values));
  }, [resources]);

  const subjects = useMemo(() => {
    const values = resources
      .map((resource) => resource.subject?.trim())
      .filter(Boolean);

    return Array.from(new Set(values)).sort();
  }, [resources]);

  const filteredResources = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const title = resource.title?.toLowerCase() || "";
      const description = resource.description?.toLowerCase() || "";
      const subject = resource.subject?.toLowerCase() || "";
      const semester = resource.semester?.toLowerCase() || "";
      const fileName = resource.fileName?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        title.includes(searchText) ||
        description.includes(searchText) ||
        subject.includes(searchText) ||
        semester.includes(searchText) ||
        fileName.includes(searchText);

      const matchesSemester =
        semesterFilter === "All" ||
        resource.semester === semesterFilter;

      const matchesSubject =
        subjectFilter === "All" ||
        resource.subject === subjectFilter;

      return matchesSearch && matchesSemester && matchesSubject;
    });
  }, [resources, search, semesterFilter, subjectFilter]);

  const clearFilters = () => {
    setSearch("");
    setSemesterFilter("All");
    setSubjectFilter("All");
  };

  const filtersActive =
    search.trim() !== "" ||
    semesterFilter !== "All" ||
    subjectFilter !== "All";

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-lg font-semibold text-gray-700">
            Loading PYQs...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Previous Year Questions
          </h1>

          <p className="mt-2 text-gray-600">
            Semester-wise previous year question papers.
          </p>

          {resources.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">
              Showing {filteredResources.length} of{" "}
              {resources.length} PYQs
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={loadPYQ}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Filters */}
        {resources.length > 0 && (
          <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">

              {/* Search */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Search PYQs
                </label>

                <input
                  type="text"
                  placeholder="Search title or subject"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                />
              </div>

              {/* Semester */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Semester
                </label>

                <select
                  value={semesterFilter}
                  onChange={(e) => setSemesterFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="All">All Semesters</option>

                  {semesters.map((semester) => (
                    <option key={semester} value={semester}>
                      {semester}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Subject
                </label>

                <select
                  value={subjectFilter}
                  onChange={(e) => setSubjectFilter(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                >
                  <option value="All">All Subjects</option>

                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">
              <p className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-bold text-orange-600">
                  {filteredResources.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900">
                  {resources.length}
                </span>{" "}
                PYQs
              </p>

              {filtersActive && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </section>
        )}

        {/* No PYQs */}
        {!error && resources.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No PYQs uploaded yet.
            </h2>

            <p className="mt-2 text-gray-500">
              Previous year question papers uploaded by the admin
              will appear here.
            </p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No matching PYQs found.
            </h2>

            <p className="mt-2 text-gray-500">
              Try another search, semester, or subject.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition hover:bg-orange-700"
            >
              Show All PYQs
            </button>
          </div>
        ) : (
          /* PYQ Cards */
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <article
                key={resource._id}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="break-words text-xl font-bold text-gray-900">
                    {resource.title}
                  </h2>

                  <span className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                    PYQ
                  </span>
                </div>

                {resource.semester && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-blue-600">
                      Semester
                    </p>

                    <p className="mt-1 text-gray-700">
                      {resource.semester}
                    </p>
                  </div>
                )}

                {resource.subject && (
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-gray-500">
                      Subject
                    </p>

                    <p className="mt-1 text-gray-700">
                      {resource.subject}
                    </p>
                  </div>
                )}

                {resource.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                    {resource.description}
                  </p>
                )}

                {resource.fileName && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <p className="mb-1 text-xs font-semibold text-gray-500">
                      PDF FILE
                    </p>

                    <p
                      className="truncate text-sm text-gray-700"
                      title={resource.fileName}
                    >
                      {resource.fileName}
                    </p>
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Open
                  </a>

                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={resource.fileName || undefined}
                    className="flex-1 rounded-lg bg-gray-900 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    Download
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
