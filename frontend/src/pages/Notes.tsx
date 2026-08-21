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

  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [subjectFilter, setSubjectFilter] = useState("All");

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        setError("");

        // Backend API unchanged
        const res = await api.get("/api/resources/category/Notes");

        const notesOnly = (res.data.resources || []).filter(
          (resource: Resource) =>
            resource.category?.trim().toLowerCase() === "notes"
        );

        setResources(notesOnly);
      } catch (err: any) {
        console.error("Notes loading error:", err);

        setError(
          err.response?.data?.message || "Unable to load notes"
        );
      } finally {
        setLoading(false);
      }
    };

    loadNotes();
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
      <div className="min-h-screen bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-lg font-semibold text-gray-700">
            Loading notes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Student Notes
          </h1>

          <p className="mt-2 text-gray-600">
            Semester-wise study notes and learning materials.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        {resources.length > 0 && (
          <section className="mb-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">

              {/* Search */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Search Notes
                </label>

                <input
                  type="text"
                  placeholder="Search by title or subject"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                <span className="font-bold text-blue-600">
                  {filteredResources.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-gray-900">
                  {resources.length}
                </span>{" "}
                notes
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

        {/* No Notes */}
        {resources.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No notes uploaded yet.
            </h2>

            <p className="mt-2 text-gray-500">
              Notes uploaded by the admin will appear here.
            </p>
          </div>
        ) : filteredResources.length === 0 ? (
          /* No Search Result */
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No matching notes found.
            </h2>

            <p className="mt-2 text-gray-500">
              Try another search, semester, or subject.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Show All Notes
            </button>
          </div>
        ) : (
          /* Notes Cards */
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <article
                key={resource._id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="break-words text-xl font-bold text-gray-900">
                    {resource.title}
                  </h2>

                  <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Notes
                  </span>
                </div>

                {resource.semester && (
                  <p className="mt-4 text-sm font-semibold text-blue-600">
                    Semester: {resource.semester}
                  </p>
                )}

                {resource.subject && (
                  <p className="mt-2 text-sm text-gray-600">
                    Subject: {resource.subject}
                  </p>
                )}

                {resource.description && (
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    {resource.description}
                  </p>
                )}

                {resource.fileName && (
                  <p className="mt-4 truncate text-sm text-gray-500">
                    File: {resource.fileName}
                  </p>
                )}

                <div className="mt-6 flex gap-3">
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    View PDF
                  </a>

                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={resource.fileName || true}
                    className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
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
