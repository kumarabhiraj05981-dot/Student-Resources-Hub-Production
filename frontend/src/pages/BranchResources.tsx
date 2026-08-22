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
}

interface Resource {
  _id?: string;
  id?: string;
  title: string;
  subject?: string;
  semester?: string | number;
  category?: string;
  branch?: string;
  filepath?: string;
  fileUrl?: string;
  url?: string;
  filename?: string;
}

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://student-resources-hub-1.onrender.com/api";

const FILE_BASE =
  "https://student-resources-hub-1.onrender.com";

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
      "Civil Engineering and CTM notes, PYQs, syllabus and study materials.",
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

export default function BranchResources() {
  const { branchId } = useParams();

  const selectedBranch = branchId || "cse";

  const branch =
    branches.find((item) => item.id === selectedBranch) ||
    branches[0];

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * ============================================================
   * FETCH BRANCH RESOURCES
   * ============================================================
   */

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError("");
      setResources([]);

      try {
        /*
         * First try branch-specific API
         */
        const response = await fetch(
          `${API_BASE}/resources?branch=${encodeURIComponent(branch.id)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch resources");
        }

        const data = await response.json();

        /*
         * API response can be:
         * [ ... ]
         * OR
         * { resources: [...] }
         * OR
         * { data: [...] }
         */

        let resourceList: Resource[] = [];

        if (Array.isArray(data)) {
          resourceList = data;
        } else if (Array.isArray(data.resources)) {
          resourceList = data.resources;
        } else if (Array.isArray(data.data)) {
          resourceList = data.data;
        }

        /*
         * Extra frontend safety filter.
         * This prevents another branch's resources from appearing.
         */

        const filteredResources = resourceList.filter((resource) => {
          if (!resource.branch) {
            return true;
          }

          const resourceBranch = String(resource.branch)
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");

          const currentBranch = branch.id
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");

          /*
           * Civil / CTM compatibility
           */

          if (
            currentBranch === "civil-ctm" &&
            ["civil", "ctm", "civil-ctm"].includes(resourceBranch)
          ) {
            return true;
          }

          return (
            resourceBranch === currentBranch ||
            resourceBranch === branch.shortName.toLowerCase()
          );
        });

        setResources(filteredResources);
      } catch (err) {
        console.error("Resource loading error:", err);
        setError("Unable to load resources right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [branch.id]);

  /*
   * ============================================================
   * OPEN RESOURCE
   * ============================================================
   */

  const getFileUrl = (resource: Resource) => {
    const filePath =
      resource.fileUrl ||
      resource.url ||
      resource.filepath;

    if (!filePath) {
      return "#";
    }

    if (filePath.startsWith("http://")) {
      return filePath;
    }

    if (filePath.startsWith("https://")) {
      return filePath;
    }

    if (filePath.startsWith("/")) {
      return `${FILE_BASE}${filePath}`;
    }

    return `${FILE_BASE}/${filePath}`;
  };

  /*
   * ============================================================
   * CATEGORY
   * ============================================================
   */

  const categoryName = (category?: string) => {
    if (!category) return "Other";

    const value = category.toLowerCase();

    if (value === "notes") return "Notes";
    if (value === "pyq") return "PYQs";
    if (value === "syllabus") return "Syllabus";
    if (value === "ebook" || value === "ebooks") return "E-Books";

    return category;
  };

  const categoryStyle = (category?: string) => {
    const value = category?.toLowerCase();

    if (value === "notes") {
      return "bg-blue-100 text-blue-700";
    }

    if (value === "pyq") {
      return "bg-orange-100 text-orange-700";
    }

    if (value === "syllabus") {
      return "bg-purple-100 text-purple-700";
    }

    if (value === "ebook" || value === "ebooks") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  /*
   * ============================================================
   * CATEGORY COUNT
   * ============================================================
   */

  const getCount = (category: string) => {
    return resources.filter(
      (resource) =>
        resource.category?.toLowerCase() === category.toLowerCase() ||
        (category === "ebooks" &&
          resource.category?.toLowerCase() === "ebook")
    ).length;
  };

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

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

          <div className="inline-block mt-6 bg-green-500/20 border border-green-300/40 px-6 py-2 rounded-full font-semibold">
             Resources Section
          </div>

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
                      Selected
                    </span>
                  ) : (
                    <span className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                      View Resources
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
              
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
              {branch.shortName} Study Resources
            </h2>

            <p className="text-gray-600 mt-3">
              Access study materials for {branch.name}.
            </p>

          </div>

          {/* ==================================================
              RESOURCE CATEGORY CARDS
          ================================================== */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">

            {/* NOTES */}

            <div className="bg-blue-50 rounded-2xl p-7 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition">

              <div className="text-5xl mb-4">
                
              </div>

              <h3 className="text-2xl font-bold text-gray-800">
                Notes
              </h3>

              <p className="text-gray-600 mt-2">
                {getCount("notes")} resources
              </p>

            </div>

            {/* PYQ */}

            <div className="bg-orange-50 rounded-2xl p-7 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition">

              <div className="text-5xl mb-4">
                
              </div>

              <h3 className="text-2xl font-bold text-gray-800">
                PYQs
              </h3>

              <p className="text-gray-600 mt-2">
                {getCount("pyq")} resources
              </p>

            </div>

            {/* SYLLABUS */}

            <div className="bg-purple-50 rounded-2xl p-7 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition">

              <div className="text-5xl mb-4">
                
              </div>

              <h3 className="text-2xl font-bold text-gray-800">
                Syllabus
              </h3>

              <p className="text-gray-600 mt-2">
                {getCount("syllabus")} resources
              </p>

            </div>

            {/* EBOOK */}

            <div className="bg-green-50 rounded-2xl p-7 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition">

              <div className="text-5xl mb-4">
                
              </div>

              <h3 className="text-2xl font-bold text-gray-800">
                E-Books
              </h3>

              <p className="text-gray-600 mt-2">
                {getCount("ebooks")} resources
              </p>

            </div>

          </div>

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (
            <div className="text-center py-16">

              <div className="text-6xl animate-pulse">
                
              </div>

              <p className="mt-5 text-gray-600 text-lg">
                Loading {branch.shortName} resources...
              </p>

            </div>
          )}

          {/* ==================================================
              ERROR
          ================================================== */}

          {!loading && error && (
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-8 text-center">

              <div className="text-5xl mb-4">
                
              </div>

              <h3 className="text-2xl font-bold text-red-700">
                Unable to Load Resources
              </h3>

              <p className="text-red-600 mt-3">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Try Again
              </button>

            </div>
          )}

          {/* ==================================================
              NO RESOURCES
          ================================================== */}

          {!loading && !error && resources.length === 0 && (
            <div className="max-w-3xl mx-auto text-center bg-blue-50 rounded-3xl p-10 md:p-14 shadow-xl">

              <div className="text-7xl mb-6">
                
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                No Resources Available Yet
              </h2>

              <p className="text-gray-600 text-lg mt-5">
                Resources for {branch.name} have not been uploaded yet.
              </p>

              <p className="text-gray-500 mt-3">
                Once the administrator uploads Notes, PYQs, Syllabus or
                E-Books for this branch, they will appear here automatically.
              </p>

            </div>
          )}

          {/* ==================================================
              RESOURCE LIST
          ================================================== */}

          {!loading && !error && resources.length > 0 && (

            <div>

              <div className="flex items-center justify-between mb-7">

                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                   Available Resources
                </h3>

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
                  {resources.length} Resources
                </span>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {resources.map((resource) => (

                  <div
                    key={resource._id || resource.id || resource.title}
                    className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition"
                  >

                    {/* CATEGORY */}

                    <div className="flex justify-between items-start gap-3">

                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${categoryStyle(
                          resource.category
                        )}`}
                      >
                        {categoryName(resource.category)}
                      </span>

                      {resource.semester && (
                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Sem {resource.semester}
                        </span>
                      )}

                    </div>

                    {/* TITLE */}

                    <h4 className="text-xl font-bold text-gray-800 mt-5 line-clamp-2">
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

                    {/* FILE */}

                    <a
                      href={getFileUrl(resource)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-6 text-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"
                    >
                       Open Resource →
                    </a>

                  </div>

                ))}

              </div>

            </div>
          )}

          {/* ==================================================
              AI QUESTION PAPER
          ================================================== */}

          {branch.id === "cse" && (
            <div className="mt-14 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-3xl p-8 md:p-10 text-center shadow-2xl">

              <div className="text-6xl mb-5">
                
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
