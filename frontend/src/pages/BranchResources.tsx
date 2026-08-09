import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

interface Resource {
  _id: string;
  title: string;
  description?: string;
  branch?: string;
  category: string;
  subject?: string;
  semester: string;
  fileUrl: string;
  fileName?: string;
  createdAt: string;
}

const BRANCHES = [
  {
    id: "cse",
    name: "Computer Science",
    shortName: "CSE",
    icon: "💻",
  },
  {
    id: "electrical",
    name: "Electrical",
    shortName: "Electrical",
    icon: "⚡",
  },
  {
    id: "mechanical",
    name: "Mechanical",
    shortName: "Mechanical",
    icon: "🔧",
  },
  {
    id: "civil-ctm",
    name: "Civil & CTM",
    shortName: "Civil & CTM",
    icon: "🏗️",
  },
  {
    id: "electronics",
    name: "Electronics",
    shortName: "Electronics",
    icon: "📡",
  },
  {
    id: "leather",
    name: "Leather Technology",
    shortName: "Leather Technology",
    icon: "👞",
  },
];

export default function BranchResources() {
  const [searchParams] = useSearchParams();

  const branchId =
    searchParams.get("branch") || "cse";

  const branch =
    BRANCHES.find(
      (item) => item.id === branchId
    ) || BRANCHES[0];

  const [resources, setResources] =
    useState<Resource[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [semesterFilter, setSemesterFilter] =
    useState("All");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [subjectFilter, setSubjectFilter] =
    useState("All");

  // ======================================
  // LOAD RESOURCES
  // ======================================

  useEffect(() => {
    const loadResources = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/api/resources"
        );

        console.log(
          "BRANCH RESOURCE RESPONSE:",
          response.data
        );

        const allResources =
          response.data.resources || [];

        // ======================================
        // CSE BACKWARD COMPATIBILITY
        // ======================================
        //
        // Old resources do not have branch.
        // We treat them as Computer Science.
        //

        const branchResources =
          allResources.filter(
            (resource: Resource) => {
              const resourceBranch =
                resource.branch?.trim();

              if (!resourceBranch) {
                return (
                  branch.id === "cse"
                );
              }

              return (
                resourceBranch ===
                branch.name
              );
            }
          );

        setResources(branchResources);
      } catch (err: any) {
        console.error(
          "Branch resources error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load resources."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResources();
  }, [branch.id, branch.name]);

  // ======================================
  // UNIQUE VALUES
  // ======================================

  const semesters = useMemo(() => {
    return Array.from(
      new Set(
        resources
          .map((item) =>
            item.semester?.trim()
          )
          .filter(Boolean)
      )
    );
  }, [resources]);

  const subjects = useMemo(() => {
    return Array.from(
      new Set(
        resources
          .map((item) =>
            item.subject?.trim()
          )
          .filter(Boolean)
      )
    ).sort();
  }, [resources]);

  // ======================================
  // FILTER
  // ======================================

  const filteredResources =
    useMemo(() => {
      const text =
        search.trim().toLowerCase();

      return resources.filter(
        (resource) => {
          const title =
            resource.title?.toLowerCase() ||
            "";

          const description =
            resource.description?.toLowerCase() ||
            "";

          const subject =
            resource.subject?.toLowerCase() ||
            "";

          const semester =
            resource.semester?.toLowerCase() ||
            "";

          const fileName =
            resource.fileName?.toLowerCase() ||
            "";

          const matchesSearch =
            !text ||
            title.includes(text) ||
            description.includes(text) ||
            subject.includes(text) ||
            semester.includes(text) ||
            fileName.includes(text);

          const matchesSemester =
            semesterFilter === "All" ||
            resource.semester ===
              semesterFilter;

          const matchesCategory =
            categoryFilter === "All" ||
            resource.category ===
              categoryFilter;

          const matchesSubject =
            subjectFilter === "All" ||
            resource.subject ===
              subjectFilter;

          return (
            matchesSearch &&
            matchesSemester &&
            matchesCategory &&
            matchesSubject
          );
        }
      );
    }, [
      resources,
      search,
      semesterFilter,
      categoryFilter,
      subjectFilter,
    ]);

  // ======================================
  // CLEAR FILTERS
  // ======================================

  const clearFilters = () => {
    setSearch("");
    setSemesterFilter("All");
    setCategoryFilter("All");
    setSubjectFilter("All");
  };

  // ======================================
  // LOADING
  // ======================================

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-5">
            {branch.icon}
          </div>

          <h2 className="text-2xl font-bold text-blue-700">
            Loading {branch.name} Resources...
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait...
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

        <div className="bg-gradient-to-r from-blue-700 to-cyan-500 text-white rounded-3xl shadow-xl p-8 md:p-12 mb-8">

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">

            <div className="text-center md:text-left">

              <div className="text-6xl mb-4">
                {branch.icon}
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold">
                {branch.name}
              </h1>

              <p className="text-blue-100 mt-3 text-lg">
                Student Resources
              </p>

              <p className="text-blue-100 mt-1">
                Notes, PYQs, Syllabus and E-Books
              </p>

            </div>

            <Link
              to="/"
              className="bg-white text-blue-700 px-6 py-3 rounded-xl font-bold shadow hover:scale-105 transition"
            >
              🏠 Back to Home
            </Link>

          </div>

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-5 rounded-xl mb-6">
            ❌ {error}
          </div>
        )}

        {/* ======================================
            RESOURCE CATEGORY SUMMARY
        ====================================== */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <div className="text-3xl">
              📄
            </div>

            <h3 className="font-bold mt-2">
              Notes
            </h3>

            <p className="text-blue-600 font-bold text-xl">
              {
                resources.filter(
                  (r) =>
                    r.category === "Notes"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <div className="text-3xl">
              📝
            </div>

            <h3 className="font-bold mt-2">
              PYQs
            </h3>

            <p className="text-orange-600 font-bold text-xl">
              {
                resources.filter(
                  (r) =>
                    r.category === "PYQ"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <div className="text-3xl">
              📘
            </div>

            <h3 className="font-bold mt-2">
              Syllabus
            </h3>

            <p className="text-purple-600 font-bold text-xl">
              {
                resources.filter(
                  (r) =>
                    r.category ===
                    "Syllabus"
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <div className="text-3xl">
              📖
            </div>

            <h3 className="font-bold mt-2">
              E-Books
            </h3>

            <p className="text-green-600 font-bold text-xl">
              {
                resources.filter(
                  (r) =>
                    r.category ===
                    "Ebooks"
                ).length
              }
            </p>
          </div>

        </div>

        {/* ======================================
            FILTERS
        ====================================== */}

        {resources.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              🔎 Find Your Resource
            </h2>

            <div className="grid md:grid-cols-4 gap-4">

              {/* SEARCH */}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Search
                </label>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search resource..."
                  className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* SEMESTER */}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Semester
                </label>

                <select
                  value={semesterFilter}
                  onChange={(e) =>
                    setSemesterFilter(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl px-4 py-3 bg-white"
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

              {/* CATEGORY */}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Category
                </label>

                <select
                  value={categoryFilter}
                  onChange={(e) =>
                    setCategoryFilter(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl px-4 py-3 bg-white"
                >
                  <option value="All">
                    All Categories
                  </option>

                  <option value="Notes">
                    Notes
                  </option>

                  <option value="PYQ">
                    PYQ
                  </option>

                  <option value="Syllabus">
                    Syllabus
                  </option>

                  <option value="Ebooks">
                    E-Books
                  </option>
                </select>
              </div>

              {/* SUBJECT */}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Subject
                </label>

                <select
                  value={subjectFilter}
                  onChange={(e) =>
                    setSubjectFilter(
                      e.target.value
                    )
                  }
                  className="w-full border rounded-xl px-4 py-3 bg-white"
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

            <div className="mt-5 pt-4 border-t flex flex-wrap justify-between gap-3">

              <p className="text-gray-600">
                Showing{" "}
                <strong className="text-blue-600">
                  {
                    filteredResources.length
                  }
                </strong>{" "}
                resources
              </p>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg font-semibold"
              >
                🔄 Clear Filters
              </button>

            </div>

          </div>
        )}

        {/* ======================================
            EMPTY STATE
        ====================================== */}

        {resources.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

            <div className="text-7xl mb-5">
              📚
            </div>

            <h2 className="text-2xl font-bold text-gray-700">
              No {branch.name} resources yet
            </h2>

            <p className="text-gray-500 mt-3">
              Resources for this branch will
              appear here when uploaded by
              the administrator.
            </p>

            {branch.id !== "cse" && (
              <div className="mt-5 inline-block bg-yellow-50 border border-yellow-200 text-yellow-700 px-5 py-3 rounded-xl">
                🚀 This branch is ready for
                future resource uploads.
              </div>
            )}

          </div>

        ) : filteredResources.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

            <div className="text-6xl">
              🔎
            </div>

            <h2 className="text-xl font-bold mt-4">
              No matching resources found
            </h2>

            <button
              onClick={
                clearFilters
              }
              className="mt-5 bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
            >
              Show All
            </button>

          </div>

        ) : (

          /* ======================================
              RESOURCE CARDS
          ====================================== */

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredResources.map(
              (resource) => (

                <div
                  key={resource._id}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-1 transition"
                >

                  <div className="flex justify-between gap-3">

                    <h2 className="text-xl font-bold text-gray-800">
                      {resource.title}
                    </h2>

                    <span className="shrink-0 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      {resource.category}
                    </span>

                  </div>

                  <div className="mt-4 space-y-2 text-sm">

                    <p className="text-blue-600 font-semibold">
                      🎓 {resource.semester}
                    </p>

                    {resource.subject && (
                      <p className="text-gray-600 font-semibold">
                        📖{" "}
                        {resource.subject}
                      </p>
                    )}

                  </div>

                  {resource.description && (
                    <p className="mt-4 text-gray-600">
                      {resource.description}
                    </p>
                  )}

                  {resource.fileName && (
                    <p className="mt-4 text-sm text-gray-500 truncate">
                      📄{" "}
                      {resource.fileName}
                    </p>
                  )}

                  <div className="flex gap-3 mt-6">

                    <a
                      href={
                        resource.fileUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold"
                    >
                      👁️ View
                    </a>

                    <a
                      href={
                        resource.fileUrl
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      download={
                        resource.fileName ||
                        true
                      }
                      className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-semibold"
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
