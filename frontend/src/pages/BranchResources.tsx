import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

interface Branch {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  apiName: string;
}

interface Resource {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  subject?: string;
  semester?: string | number;
  category?: string;
  branch?: string;
  fileUrl?: string;
  filename?: string;
  fileName?: string;
}

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://student-resources-hub-1.onrender.com/api";

const FILE_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
  "https://student-resources-hub-1.onrender.com";

/* ============================================================
   BRANCH LIST
   IMPORTANT:
   apiName MUST MATCH DATABASE BRANCH NAME
============================================================ */

const branches: Branch[] = [
  {
    id: "cse",
    name: "Computer Science Engineering",
    shortName: "CSE",
    icon: "💻",
    apiName: "Computer Science",
    description:
      "Notes, PYQs, Syllabus, E-Books and other CSE study resources.",
  },

  {
    id: "electrical",
    name: "Electrical Engineering",
    shortName: "Electrical",
    icon: "⚡",
    apiName: "Electrical",
    description:
      "Electrical Engineering notes, PYQs, syllabus and study materials.",
  },

  {
    id: "mechanical",
    name: "Mechanical Engineering",
    shortName: "Mechanical",
    icon: "⚙️",
    apiName: "Mechanical",
    description:
      "Mechanical Engineering notes, PYQs, syllabus and study materials.",
  },

  {
    id: "civil-ctm",
    name: "Civil Engineering / CTM",
    shortName: "Civil / CTM",
    icon: "🏗️",
    apiName: "Civil & CTM",
    description:
      "Civil Engineering and CTM notes, PYQs, syllabus and study materials.",
  },

  {
    id: "electronics",
    name: "Electronics Engineering",
    shortName: "Electronics",
    icon: "🔌",
    apiName: "Electronics",
    description:
      "Electronics Engineering notes, PYQs, syllabus and study materials.",
  },

  {
    id: "leather",
    name: "Leather Technology",
    shortName: "Leather",
    icon: "🧪",
    apiName: "Leather Technology",
    description:
      "Leather Technology notes, PYQs, syllabus and study materials.",
  },
];

/* ============================================================
   CATEGORY HELPERS
============================================================ */

const normalizeCategory = (category?: string) => {
  if (!category) return "Other";

  const value = category.trim().toLowerCase();

  if (value === "notes") return "Notes";

  if (
    value === "pyq" ||
    value === "pyqs" ||
    value === "previous year question"
  ) {
    return "PYQ";
  }

  if (value === "syllabus") return "Syllabus";

  if (
    value === "ebook" ||
    value === "ebooks" ||
    value === "e-book" ||
    value === "e-books"
  ) {
    return "E-Books";
  }

  return "Other";
};

/* ============================================================
   BRANCH NAME COMPARISON
============================================================ */

const normalizeBranch = (branch?: string) => {
  if (!branch) return "";

  return branch
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

export default function BranchResources() {
  const { branchId } = useParams();

  const branch =
    branches.find((item) => item.id === branchId) ||
    branches[0];

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ==========================================================
     FETCH RESOURCES
  ========================================================== */

  useEffect(() => {
    let isMounted = true;

    const loadResources = async () => {
      try {
        setLoading(true);
        setError("");
        setResources([]);

        /*
         * VERY IMPORTANT:
         *
         * Example:
         *
         * Electrical
         * /api/resources/branch/Electrical
         *
         * Mechanical
         * /api/resources/branch/Mechanical
         *
         * Electronics
         * /api/resources/branch/Electronics
         */

        const response = await fetch(
          `${API_BASE}/resources/branch/${encodeURIComponent(
            branch.apiName
          )}`
        );

        if (!response.ok) {
          throw new Error(
            `Server returned ${response.status}`
          );
        }

        const data = await response.json();

        let list: Resource[] = [];

        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data.resources)) {
          list = data.resources;
        } else if (Array.isArray(data.data)) {
          list = data.data;
        }

        if (!isMounted) return;

        /*
         * Extra safety filter.
         *
         * This makes sure Electrical resources do not appear
         * on Mechanical page etc.
         */

        const filtered = list.filter((resource) => {
          if (!resource.branch) {
            return true;
          }

          return (
            normalizeBranch(resource.branch) ===
            normalizeBranch(branch.apiName)
          );
        });

        setResources(filtered);
      } catch (err) {
        console.error("Resource loading error:", err);

        if (!isMounted) return;

        setResources([]);
        setError(
          "Resources load nahi ho pa rahe hain. Please try again."
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadResources();

    return () => {
      isMounted = false;
    };
  }, [branch.apiName]);

  /* ==========================================================
     FILE URL
  ========================================================== */

  const getFileUrl = (resource: Resource) => {
    const file =
      resource.fileUrl ||
      resource.filename ||
      resource.fileName;

    if (!file) {
      return "#";
    }

    if (
      file.startsWith("http://") ||
      file.startsWith("https://")
    ) {
      return file;
    }

    if (file.startsWith("/")) {
      return `${FILE_BASE}${file}`;
    }

    return `${FILE_BASE}/${file}`;
  };

  /* ==========================================================
     CATEGORY COUNT
  ========================================================== */

  const getCategoryCount = (category: string) => {
    return resources.filter(
      (resource) =>
        normalizeCategory(resource.category) === category
    ).length;
  };

  /* ==========================================================
     RESOURCE CATEGORY DATA
  ========================================================== */

  const categoryCards = [
    {
      name: "Notes",
      icon: "📚",
      bg: "bg-blue-50",
      text: "text-blue-700",
    },
    {
      name: "PYQ",
      icon: "📝",
      bg: "bg-orange-50",
      text: "text-orange-700",
    },
    {
      name: "Syllabus",
      icon: "📋",
      bg: "bg-purple-50",
      text: "text-purple-700",
    },
    {
      name: "E-Books",
      icon: "📖",
      bg: "bg-green-50",
      text: "text-green-700",
    },
    {
      name: "Other",
      icon: "📁",
      bg: "bg-gray-50",
      text: "text-gray-700",
    },
  ];

  /* ==========================================================
     GROUP RESOURCES
  ========================================================== */

  const groupedResources = categoryCards.map((category) => ({
    ...category,
    resources: resources.filter(
      (resource) =>
        normalizeCategory(resource.category) === category.name
    ),
  }));

  /* ==========================================================
     PAGE
  ========================================================== */

  return (
    <>
      <Navbar />

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">

          <div className="text-6xl mb-5">
            {branch.icon}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold">
            {branch.name}
          </h1>

          <p className="mt-4 text-lg text-blue-100 max-w-3xl mx-auto">
            {branch.description}
          </p>

          {!loading && (
            <div className="inline-block mt-6 bg-green-500/20 border border-green-300/40 px-6 py-2 rounded-full font-semibold">
              ✅ {resources.length}{" "}
              {resources.length === 1
                ? "Resource Available"
                : "Resources Available"}
            </div>
          )}

        </div>
      </section>

      {/* ======================================================
          BRANCH SELECTOR
      ====================================================== */}

      <section className="bg-blue-50 py-14">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-10">

            <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
              Select Your Branch
            </h2>

            <p className="text-gray-600 mt-3">
              Choose your engineering branch to access study resources.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {branches.map((item) => (
              <Link
                key={item.id}
                to={`/branch/${item.id}`}
                className={`block rounded-2xl p-6 transition duration-300 transform hover:-translate-y-2 ${
                  item.id === branch.id
                    ? "bg-blue-600 text-white shadow-2xl"
                    : "bg-white text-gray-800 shadow-lg hover:shadow-2xl"
                }`}
              >

                <div className="flex items-center gap-4">

                  <div className="text-5xl">
                    {item.icon}
                  </div>

                  <div className="flex-1">

                    <h3 className="text-xl font-bold">
                      {item.shortName}
                    </h3>

                    <p
                      className={`text-sm mt-1 ${
                        item.id === branch.id
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {item.name}
                    </p>

                  </div>

                </div>

                <div className="mt-5">

                  {item.id === branch.id ? (
                    <span className="inline-block bg-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                      ✓ Selected
                    </span>
                  ) : (
                    <span className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                      View Resources →
                    </span>
                  )}

                </div>

              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* ======================================================
          RESOURCE SECTION
      ====================================================== */}

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">

          {/* HEADER */}

          <div className="text-center mb-12">

            <div className="text-5xl mb-4">
              📚
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
              {branch.shortName} Study Resources
            </h2>

            <p className="text-gray-600 mt-3">
              {branch.name} ke uploaded study materials yahan
              automatically show honge.
            </p>

          </div>

          {/* ==================================================
              CATEGORY CARDS
          ================================================== */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-14">

            {categoryCards.map((category) => (
              <div
                key={category.name}
                className={`${category.bg} rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition`}
              >

                <div className="text-5xl mb-3">
                  {category.icon}
                </div>

                <h3
                  className={`text-xl font-bold ${category.text}`}
                >
                  {category.name}
                </h3>

                <p className="text-3xl font-extrabold text-gray-800 mt-2">
                  {getCategoryCount(category.name)}
                </p>

                <p className="text-sm text-gray-500">
                  Resources
                </p>

              </div>
            ))}

          </div>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (
            <div className="max-w-3xl mx-auto text-center bg-blue-50 rounded-3xl p-12 shadow-lg">

              <div className="text-6xl animate-pulse">
                📚
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mt-5">
                Loading Resources...
              </h3>

              <p className="text-gray-600 mt-3">
                {branch.shortName} resources load ho rahe hain...
              </p>

            </div>
          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading && error && (
            <div className="max-w-3xl mx-auto text-center bg-red-50 border border-red-200 rounded-3xl p-10 shadow-lg">

              <div className="text-6xl mb-5">
                ⚠️
              </div>

              <h3 className="text-2xl font-bold text-red-700">
                Resources Load Nahi Ho Rahe
              </h3>

              <p className="text-red-600 mt-3">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold"
              >
                Try Again
              </button>

            </div>
          )}

          {/* ==================================================
              NO RESOURCES
          ================================================== */}

          {!loading &&
            !error &&
            resources.length === 0 && (
              <div className="max-w-3xl mx-auto text-center bg-blue-50 rounded-3xl p-10 md:p-14 shadow-xl">

                <div className="text-7xl mb-6">
                  📂
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-gray-800">
                  No Resources Uploaded Yet
                </h3>

                <p className="text-gray-600 text-lg mt-5">
                  Abhi{" "}
                  <strong>{branch.name}</strong>{" "}
                  ke liye koi resource upload nahi hua hai.
                </p>

                <p className="text-gray-500 mt-3">
                  Admin jab is branch ke liye Notes, PYQs,
                  Syllabus, E-Books ya Other files upload karega,
                  woh automatically yahan dikh jayengi.
                </p>

              </div>
            )}

          {/* ==================================================
              RESOURCE LIST
          ================================================== */}

          {!loading &&
            !error &&
            resources.length > 0 && (
              <div className="space-y-12">

                {groupedResources
                  .filter(
                    (group) => group.resources.length > 0
                  )
                  .map((group) => (
                    <div key={group.name}>

                      {/* GROUP TITLE */}

                      <div className="flex items-center justify-between mb-6">

                        <div className="flex items-center gap-3">

                          <span className="text-4xl">
                            {group.icon}
                          </span>

                          <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                            {group.name}
                          </h3>

                        </div>

                        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                          {group.resources.length}{" "}
                          {group.resources.length === 1
                            ? "Resource"
                            : "Resources"}
                        </span>

                      </div>

                      {/* RESOURCE CARDS */}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {group.resources.map((resource) => (
                          <div
                            key={
                              resource._id ||
                              resource.id ||
                              resource.title
                            }
                            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition"
                          >

                            {/* CATEGORY */}

                            <div className="flex items-start justify-between gap-3">

                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${group.bg} ${group.text}`}
                              >
                                {group.name}
                              </span>

                              {resource.semester && (
                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                                  Sem {resource.semester}
                                </span>
                              )}

                            </div>

                            {/* TITLE */}

                            <h4 className="text-xl font-bold text-gray-800 mt-5 break-words">
                              {resource.title}
                            </h4>

                            {/* SUBJECT */}

                            {resource.subject && (
                              <p className="text-gray-600 mt-3">
                                <span className="font-semibold">
                                  Subject:
                                </span>{" "}
                                {resource.subject}
                              </p>
                            )}

                            {/* DESCRIPTION */}

                            {resource.description && (
                              <p className="text-gray-500 text-sm mt-3">
                                {resource.description}
                              </p>
                            )}

                            {/* BRANCH */}

                            <div className="mt-4">

                              <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                {branch.shortName}
                              </span>

                            </div>

                            {/* OPEN FILE */}

                            {(
                              resource.fileUrl ||
                              resource.filename ||
                              resource.fileName
                            ) ? (
                              <a
                                href={getFileUrl(resource)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl text-center font-semibold transition"
                              >
                                📄 Open Resource →
                              </a>
                            ) : (
                              <div className="block mt-6 bg-gray-200 text-gray-500 px-5 py-3 rounded-xl text-center font-semibold">
                                File Not Available
                              </div>
                            )}

                          </div>
                        ))}

                      </div>

                    </div>
                  ))}

              </div>
            )}

          {/* ==================================================
              CSE AI QUESTION PAPER
          ================================================== */}

          {branch.id === "cse" && (
            <div className="mt-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-3xl p-8 md:p-10 text-center shadow-2xl">

              <div className="text-6xl mb-5">
                🤖
              </div>

              <h3 className="text-2xl md:text-3xl font-bold">
                AI Question Paper Generator
              </h3>

              <p className="mt-3 text-indigo-100 max-w-2xl mx-auto">
                Enter your subject and syllabus or units.
                AI will generate a question paper based on
                the provided syllabus.
              </p>

              <Link
                to="/ai-question-paper"
                className="inline-block mt-6 bg-white text-indigo-700 px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
              >
                Generate Question Paper
              </Link>

            </div>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}
