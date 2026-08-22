import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../services/api";

interface Resource {
  _id: string;
  title: string;
  description?: string;
  branch?: string;
  category: string;
  semester: string;
  subject?: string;
  fileUrl: string;
  fileName?: string;
  createdAt: string;
}

interface Branch {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
}

const branches: Branch[] = [
  {
    id: "cse",
    name: "Computer Science Engineering",
    shortName: "CSE",
    icon: "",
    description:
      "Notes, PYQs, Syllabus, E-Books and other study resources.",
  },
  {
    id: "electrical",
    name: "Electrical Engineering",
    shortName: "Electrical",
    icon: "",
    description:
      "Electrical Engineering notes, PYQs, syllabus and study materials.",
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    shortName: "Mechanical",
    icon: "",
    description:
      "Mechanical Engineering notes, PYQs, syllabus and study materials.",
  },
  {
    id: "civil-ctm",
    name: "Civil Engineering / CTM",
    shortName: "Civil / CTM",
    icon: "",
    description:
      "Civil Engineering and CTM study resources.",
  },
  {
    id: "electronics",
    name: "Electronics Engineering",
    shortName: "Electronics",
    icon: "",
    description:
      "Electronics Engineering notes, PYQs, syllabus and study materials.",
  },
  {
    id: "leather",
    name: "Leather Technology",
    shortName: "Leather",
    icon: "",
    description:
      "Leather Technology notes, PYQs, syllabus and study materials.",
  },
];

/*
|--------------------------------------------------------------------------
| IMPORTANT
|--------------------------------------------------------------------------
| These names MUST match the branch values used in Admin.tsx
|
| Admin:
| Computer Science
| Electrical
| Mechanical
| Civil & CTM
| Electronics
| Leather Technology
|--------------------------------------------------------------------------
*/

const branchApiNames: Record<string, string> = {
  cse: "Computer Science",
  electrical: "Electrical",
  mechanical: "Mechanical",
  "civil-ctm": "Civil & CTM",
  electronics: "Electronics",
  leather: "Leather Technology",
};

const categoryStyles: Record<
  string,
  {
    bg: string;
    badge: string;
    button: string;
  }
> = {
  Notes: {
    bg: "bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  PYQ: {
    bg: "bg-orange-50",
    badge: "bg-orange-100 text-orange-700",
    button: "bg-orange-500 hover:bg-orange-600",
  },
  Syllabus: {
    bg: "bg-purple-50",
    badge: "bg-purple-100 text-purple-700",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  Ebooks: {
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-700",
    button: "bg-green-600 hover:bg-green-700",
  },
  Other: {
    bg: "bg-indigo-50",
    badge: "bg-indigo-100 text-indigo-700",
    button: "bg-indigo-600 hover:bg-indigo-700",
  },
};

export default function BranchResources() {
  const { branchId } = useParams();

  const selectedBranchId = branchId || "cse";

  const branch =
    branches.find((item) => item.id === selectedBranchId) ||
    branches[0];

  /*
  |--------------------------------------------------------------------------
  | ADMIN BRANCH NAME
  |--------------------------------------------------------------------------
  */

  const apiBranchName =
    branchApiNames[branch.id] || "Computer Science";

  /*
  |--------------------------------------------------------------------------
  | RESOURCE STATES
  |--------------------------------------------------------------------------
  */

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | LOAD ALL RESOURCES
  |--------------------------------------------------------------------------
  |
  | Admin already uses:
  |
  | GET /api/resources
  |
  | So frontend uses the SAME API.
  |
  */

  const loadResources = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/resources");

      console.log("Branch resources response:", response.data);

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.resources)
        ? data.resources
        : [];

      setResources(list);
    } catch (err: any) {
      console.error(
        "BRANCH RESOURCE LOAD ERROR:",
        err?.response?.data || err
      );

      setError(
        err?.response?.data?.message ||
          "Resources load nahi ho pa rahe hain."
      );

      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResources();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTER CURRENT BRANCH
  |--------------------------------------------------------------------------
  |
  | Admin branch:
  | "Electrical"
  |
  | Current branch:
  | electrical
  |
  | We convert URL ID -> Admin branch name and compare.
  |
  */

  const branchResources = useMemo(() => {
    return resources.filter((resource) => {
      const resourceBranch =
        resource.branch?.trim().toLowerCase();

      const selectedBranch =
        apiBranchName.trim().toLowerCase();

      return resourceBranch === selectedBranch;
    });
  }, [resources, apiBranchName]);

  /*
  |--------------------------------------------------------------------------
  | GROUP BY CATEGORY
  |--------------------------------------------------------------------------
  */

  const groupedResources = useMemo(() => {
    const groups: Record<string, Resource[]> = {};

    branchResources.forEach((resource) => {
      const category = resource.category || "Other";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(resource);
    });

    return groups;
  }, [branchResources]);

  /*
  |--------------------------------------------------------------------------
  | FORMAT DATE
  |--------------------------------------------------------------------------
  */

  const formatDate = (date?: string) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | CATEGORY STYLE
  |--------------------------------------------------------------------------
  */

  const getCategoryStyle = (category: string) => {
    return (
      categoryStyles[category] ||
      categoryStyles.Other
    );
  };

  return (
    <>
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

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
              {branchResources.length > 0
                ? `✅ ${branchResources.length} Resources Available`
                : "📚 Resources Section"}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          BRANCH SELECTOR
      ===================================================== */}

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
            {branches.map((item) => {
              const isSelected = item.id === branch.id;

              return (
                <Link
                  key={item.id}
                  to={`/branch/${item.id}`}
                  className={`block rounded-2xl p-6 transition duration-300 transform hover:-translate-y-2 ${
                    isSelected
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
                          isSelected
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {item.name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <span
                      className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isSelected
                        ? "Selected"
                        : "View Resources"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          RESOURCES
      ===================================================== */}

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
              {branch.shortName} Study Resources
            </h2>

            <p className="text-gray-600 mt-3">
              All resources uploaded by admin for{" "}
              <strong>{branch.name}</strong>.
            </p>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="text-center py-16">
              <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

              <p className="mt-5 text-gray-600 font-medium">
                Resources load ho rahe hain...
              </p>
            </div>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && (
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">
                ⚠️
              </div>

              <h3 className="text-xl font-bold text-red-700">
                Resources load nahi ho pa rahe
              </h3>

              <p className="text-red-600 mt-3">
                {error}
              </p>

              <button
                onClick={loadResources}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Try Again
              </button>
            </div>
          )}

          {/* =================================================
              NO RESOURCES
          ================================================= */}

          {!loading &&
            !error &&
            branchResources.length === 0 && (
              <div className="max-w-3xl mx-auto text-center bg-blue-50 rounded-3xl p-10 md:p-14 shadow-xl">

                <div className="text-7xl mb-6">
                  
                </div>

                <h3 className="text-3xl font-bold text-gray-800">
                  No Resources Available
                </h3>

                <p className="text-gray-600 text-lg mt-4">
                  Abhi{" "}
                  <strong>{branch.name}</strong>{" "}
                  ke liye koi resource upload nahi hua hai.
                </p>

                <p className="text-gray-500 mt-3">
                  Admin jab is branch ke liye Notes,
                  PYQs, Syllabus ya E-Books upload karega,
                  woh yahan automatically dikhenge.
                </p>
              </div>
            )}

          {/* =================================================
              RESOURCE LIST
          ================================================= */}

          {!loading &&
            !error &&
            branchResources.length > 0 && (
              <div className="space-y-12">

                {Object.entries(groupedResources).map(
                  ([category, categoryResources]) => {
                    const style =
                      getCategoryStyle(category);

                    return (
                      <div key={category}>

                        {/* CATEGORY HEADER */}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

                          <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                              {category === "Ebooks"
                                ? "E-Books"
                                : category}
                            </h3>

                            <p className="text-gray-500 mt-1">
                              {categoryResources.length}{" "}
                              {categoryResources.length === 1
                                ? "resource"
                                : "resources"}
                            </p>
                          </div>

                          <span
                            className={`self-start sm:self-auto px-4 py-2 rounded-full text-sm font-semibold ${style.badge}`}
                          >
                            {branch.shortName}
                          </span>
                        </div>

                        {/* RESOURCE CARDS */}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                          {categoryResources.map(
                            (resource) => (
                              <div
                                key={resource._id}
                                className={`${style.bg} rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300`}
                              >

                                {/* PDF ICON */}

                                <div className="flex items-start justify-between gap-4">

                                  <div className="text-5xl">
                                    
                                  </div>

                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold ${style.badge}`}
                                  >
                                    {resource.category}
                                  </span>
                                </div>

                                {/* TITLE */}

                                <h4 className="text-xl font-bold text-gray-800 mt-5">
                                  {resource.title}
                                </h4>

                                {/* SUBJECT */}

                                {resource.subject && (
                                  <p className="text-sm text-gray-600 mt-2">
                                    <strong>
                                      Subject:
                                    </strong>{" "}
                                    {resource.subject}
                                  </p>
                                )}

                                {/* SEMESTER */}

                                {resource.semester && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    <strong>
                                      Semester:
                                    </strong>{" "}
                                    {resource.semester}
                                  </p>
                                )}

                                {/* DESCRIPTION */}

                                {resource.description && (
                                  <p className="text-gray-600 text-sm mt-3 line-clamp-3">
                                    {resource.description}
                                  </p>
                                )}

                                {/* DATE */}

                                {resource.createdAt && (
                                  <p className="text-xs text-gray-500 mt-4">
                                    Uploaded:{" "}
                                    {formatDate(
                                      resource.createdAt
                                    )}
                                  </p>
                                )}

                                {/* OPEN BUTTON */}

                                {resource.fileUrl ? (
                                  <a
                                    href={resource.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`block text-center mt-6 text-white px-5 py-3 rounded-xl font-bold transition ${style.button}`}
                                  >
                                    Open PDF →
                                  </a>
                                ) : (
                                  <div className="mt-6 bg-gray-200 text-gray-500 px-5 py-3 rounded-xl text-center font-semibold">
                                    PDF unavailable
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}

        </div>
      </section>

      <Footer />
    </>
  );
}
