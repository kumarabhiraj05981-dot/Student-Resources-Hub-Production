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
    icon: "💻",
    description:
      "Notes, PYQs, Syllabus, E-Books and other study resources.",
  },
  {
    id: "electrical",
    name: "Electrical Engineering",
    shortName: "Electrical",
    icon: "⚡",
    description:
      "Electrical Engineering notes, PYQs, syllabus and study materials.",
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    shortName: "Mechanical",
    icon: "⚙️",
    description:
      "Mechanical Engineering notes, PYQs, syllabus and study materials.",
  },
  {
    id: "civil-ctm",
    name: "Civil Engineering / CTM",
    shortName: "Civil / CTM",
    icon: "🏗️",
    description:
      "Civil Engineering and CTM study resources.",
  },
  {
    id: "electronics",
    name: "Electronics Engineering",
    shortName: "Electronics",
    icon: "🔌",
    description:
      "Electronics Engineering notes, PYQs, syllabus and study materials.",
  },
  {
    id: "leather",
    name: "Leather Technology",
    shortName: "Leather",
    icon: "📚",
    description:
      "Leather Technology notes, PYQs, syllabus and study materials.",
  },
];

/* ============================================================
   ADMIN BRANCH NAME -> URL BRANCH
============================================================ */

const branchApiNames: Record<string, string> = {
  cse: "Computer Science",
  electrical: "Electrical",
  mechanical: "Mechanical",
  "civil-ctm": "Civil & CTM",
  electronics: "Electronics",
  leather: "Leather Technology",
};

/* ============================================================
   FOUR MAIN RESOURCE FOLDERS
============================================================ */

const RESOURCE_FOLDERS = [
  {
    id: "Notes",
    name: "Notes",
    icon: "📘",
    description:
      "Semester-wise notes, unit notes and subject study material.",
    bg: "bg-blue-50",
    hover: "hover:bg-blue-100",
    border: "border-blue-200",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  {
    id: "PYQ",
    name: "PYQ",
    icon: "📄",
    description:
      "Previous year question papers semester-wise.",
    bg: "bg-orange-50",
    hover: "hover:bg-orange-100",
    border: "border-orange-200",
    button: "bg-orange-500 hover:bg-orange-600",
  },
  {
    id: "Syllabus",
    name: "Syllabus",
    icon: "📋",
    description:
      "Complete semester-wise syllabus documents.",
    bg: "bg-purple-50",
    hover: "hover:bg-purple-100",
    border: "border-purple-200",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  {
    id: "Ebooks",
    name: "E-Books",
    icon: "📗",
    description:
      "Books and useful learning material in PDF format.",
    bg: "bg-green-50",
    hover: "hover:bg-green-100",
    border: "border-green-200",
    button: "bg-green-600 hover:bg-green-700",
  },
];

/* ============================================================
   SEMESTERS
============================================================ */

const SEMESTERS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
];

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function BranchResources() {
  const { branchId } = useParams();

  const selectedBranchId = branchId || "cse";

  const branch =
    branches.find((item) => item.id === selectedBranchId) ||
    branches[0];

  const apiBranchName =
    branchApiNames[branch.id] || "Computer Science";

  /* ==========================================================
     STATES
  ========================================================== */

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
   * selectedFolder:
   *
   * null
   *    => 4 folders show honge
   *
   * "Notes"
   *    => Notes ke andar resources show honge
   *
   * "PYQ"
   *    => PYQ ke andar resources
   *
   * etc.
   */

  const [selectedFolder, setSelectedFolder] =
    useState<string | null>(null);

  /* ==========================================================
     LOAD RESOURCES
  ========================================================== */

  const loadResources = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/resources");

      console.log(
        "FRONTEND RESOURCES:",
        response.data
      );

      const data = response.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.resources)
        ? data.resources
        : [];

      setResources(list);
    } catch (err: any) {
      console.error(
        "RESOURCE LOAD ERROR:",
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

  /* ==========================================================
     CURRENT BRANCH RESOURCES
  ========================================================== */

  const branchResources = useMemo(() => {
    const selectedBranch =
      apiBranchName.trim().toLowerCase();

    return resources.filter((resource) => {
      const resourceBranch =
        resource.branch?.trim().toLowerCase();

      return resourceBranch === selectedBranch;
    });
  }, [resources, apiBranchName]);

  /* ==========================================================
     CURRENT FOLDER RESOURCES
  ========================================================== */

  const folderResources = useMemo(() => {
    if (!selectedFolder) {
      return [];
    }

    return branchResources.filter((resource) => {
      return (
        resource.category?.trim().toLowerCase() ===
        selectedFolder.trim().toLowerCase()
      );
    });
  }, [branchResources, selectedFolder]);

  /* ==========================================================
     SEMESTER GROUPING
  ========================================================== */

  const semesterGroups = useMemo(() => {
    const groups: Record<string, Resource[]> = {};

    folderResources.forEach((resource) => {
      const semester =
        resource.semester || "Other";

      if (!groups[semester]) {
        groups[semester] = [];
      }

      groups[semester].push(resource);
    });

    return groups;
  }, [folderResources]);

  /* ==========================================================
     GET FOLDER COUNT
  ========================================================== */

  const getFolderCount = (folderId: string) => {
    return branchResources.filter(
      (resource) =>
        resource.category?.trim().toLowerCase() ===
        folderId.trim().toLowerCase()
    ).length;
  };

  /* ==========================================================
     DATE
  ========================================================== */

  const formatDate = (date?: string) => {
    if (!date) return "";

    try {
      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return "";
    }
  };

  /* ==========================================================
     BACK TO FOLDERS
  ========================================================== */

  const backToFolders = () => {
    setSelectedFolder(null);
  };

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
            <div className="inline-block mt-6 bg-white/10 border border-white/30 px-6 py-2 rounded-full font-semibold">
              📚 {branchResources.length} Resources Available
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
              Choose your engineering branch.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {branches.map((item) => {
              const isSelected =
                item.id === branch.id;

              return (
                <Link
                  key={item.id}
                  to={`/branch/${item.id}`}
                  onClick={() =>
                    setSelectedFolder(null)
                  }
                  className={`block rounded-2xl p-6 transition duration-300 hover:-translate-y-2 ${
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

      {/* ======================================================
          RESOURCE AREA
      ====================================================== */}

      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">

          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && (
            <div className="text-center py-20">

              <div className="inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

              <p className="mt-5 text-gray-600 font-medium">
                Resources load ho rahe hain...
              </p>

            </div>
          )}

          {/* ==================================================
              ERROR
          ================================================== */}

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

          {/* ==================================================
              CONTENT
          ================================================== */}

          {!loading && !error && (
            <>
              {/* =================================================
                  FOLDER VIEW
              ================================================= */}

              {!selectedFolder && (
                <>

                  <div className="text-center mb-12">

                    <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
                      {branch.shortName} Resources
                    </h2>

                    <p className="text-gray-600 mt-3">
                      Select a folder to view resources.
                    </p>

                  </div>

                  {branchResources.length === 0 ? (
                    <div className="max-w-3xl mx-auto text-center bg-blue-50 rounded-3xl p-10 md:p-14 shadow-xl">

                      <div className="text-7xl mb-6">
                        📚
                      </div>

                      <h3 className="text-3xl font-bold text-gray-800">
                        No Resources Available
                      </h3>

                      <p className="text-gray-600 text-lg mt-4">
                        Abhi{" "}
                        <strong>
                          {branch.name}
                        </strong>{" "}
                        ke liye koi resource upload nahi hua hai.
                      </p>

                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">

                      {RESOURCE_FOLDERS.map(
                        (folder) => {

                          const count =
                            getFolderCount(
                              folder.id
                            );

                          return (
                            <button
                              key={folder.id}
                              type="button"
                              onClick={() =>
                                setSelectedFolder(
                                  folder.id
                                )
                              }
                              className={`${folder.bg} ${folder.hover} ${folder.border} border-2 rounded-3xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300`}
                            >

                              <div className="text-7xl mb-5">
                                {folder.icon}
                              </div>

                              <h3 className="text-2xl font-bold text-gray-800">
                                {folder.name}
                              </h3>

                              <p className="text-gray-600 mt-3 text-sm">
                                {folder.description}
                              </p>

                              <div className="mt-6">

                                <span className="inline-block bg-white px-5 py-2 rounded-full text-sm font-bold text-gray-700 shadow">
                                  {count}{" "}
                                  {count === 1
                                    ? "File"
                                    : "Files"}
                                </span>

                              </div>

                              <div className="mt-5 text-blue-700 font-bold">
                                Open Folder →
                              </div>

                            </button>
                          );
                        }
                      )}

                    </div>
                  )}

                </>
              )}

              {/* =================================================
                  INSIDE FOLDER
              ================================================= */}

              {selectedFolder && (
                <>

                  {/* BACK BUTTON */}

                  <button
                    type="button"
                    onClick={backToFolders}
                    className="mb-8 bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-3 rounded-xl font-semibold transition"
                  >
                    ← Back to Folders
                  </button>

                  {/* FOLDER HEADER */}

                  <div className="text-center mb-12">

                    <div className="text-6xl mb-4">
                      {
                        RESOURCE_FOLDERS.find(
                          (item) =>
                            item.id ===
                            selectedFolder
                        )?.icon
                      }
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
                      {
                        RESOURCE_FOLDERS.find(
                          (item) =>
                            item.id ===
                            selectedFolder
                        )?.name
                      }
                    </h2>

                    <p className="text-gray-600 mt-3">
                      {branch.name} ke{" "}
                      {
                        RESOURCE_FOLDERS.find(
                          (item) =>
                            item.id ===
                            selectedFolder
                        )?.name
                      }{" "}
                      resources.
                    </p>

                  </div>

                  {/* NO FILE */}

                  {folderResources.length === 0 && (
                    <div className="max-w-3xl mx-auto text-center bg-blue-50 rounded-3xl p-10 shadow-xl">

                      <div className="text-6xl mb-5">
                        📂
                      </div>

                      <h3 className="text-2xl font-bold text-gray-800">
                        Folder Empty
                      </h3>

                      <p className="text-gray-600 mt-3">
                        Is folder mein abhi koi resource upload nahi hua hai.
                      </p>

                    </div>
                  )}

                  {/* =================================================
                      SEMESTER FOLDERS
                  ================================================= */}

                  {folderResources.length > 0 && (
                    <div className="space-y-10">

                      {SEMESTERS.map(
                        (semester) => {

                          const semesterResources =
                            semesterGroups[
                              semester
                            ] || [];

                          if (
                            semesterResources.length ===
                            0
                          ) {
                            return null;
                          }

                          return (
                            <div
                              key={semester}
                              className="bg-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8"
                            >

                              {/* SEMESTER HEADER */}

                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                                <div>

                                  <h3 className="text-2xl font-bold text-gray-800">
                                    📁{" "}
                                    {semester}
                                  </h3>

                                  <p className="text-gray-500 mt-1">
                                    {
                                      semesterResources.length
                                    }{" "}
                                    {semesterResources.length ===
                                    1
                                      ? "resource"
                                      : "resources"}
                                  </p>

                                </div>

                                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                                  {branch.shortName}
                                </span>

                              </div>

                              {/* FILES */}

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                                {semesterResources.map(
                                  (resource) => (
                                    <div
                                      key={
                                        resource._id
                                      }
                                      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition"
                                    >

                                      <div className="flex items-start justify-between gap-3">

                                        <div className="text-5xl">
                                          📕
                                        </div>

                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                                          PDF
                                        </span>

                                      </div>

                                      <h4 className="text-xl font-bold text-gray-800 mt-5">
                                        {
                                          resource.title
                                        }
                                      </h4>

                                      {resource.subject && (
                                        <p className="text-sm text-gray-600 mt-2">
                                          <strong>
                                            Subject:
                                          </strong>{" "}
                                          {
                                            resource.subject
                                          }
                                        </p>
                                      )}

                                      {resource.description && (
                                        <p className="text-sm text-gray-500 mt-3 line-clamp-3">
                                          {
                                            resource.description
                                          }
                                        </p>
                                      )}

                                      <p className="text-xs text-gray-400 mt-4">
                                        Uploaded:{" "}
                                        {formatDate(
                                          resource.createdAt
                                        )}
                                      </p>

                                      {/* OPEN PDF */}

                                      {resource.fileUrl ? (
                                        <a
                                          href={
                                            resource.fileUrl
                                          }
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="block mt-5 bg-blue-600 hover:bg-blue-700 text-white text-center px-5 py-3 rounded-xl font-bold transition"
                                        >
                                          📖 Open PDF →
                                        </a>
                                      ) : (
                                        <div className="mt-5 bg-gray-200 text-gray-500 text-center px-5 py-3 rounded-xl font-semibold">
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

                      {/* =================================================
                          OTHER / UNKNOWN SEMESTER
                      ================================================= */}

                      {Object.entries(
                        semesterGroups
                      )
                        .filter(
                          ([semester]) =>
                            !SEMESTERS.includes(
                              semester
                            )
                        )
                        .map(
                          ([
                            semester,
                            semesterResources,
                          ]) => (
                            <div
                              key={semester}
                              className="bg-gray-50 border border-gray-200 rounded-3xl p-6"
                            >

                              <h3 className="text-2xl font-bold text-gray-800 mb-5">
                                📁 {semester}
                              </h3>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                                {semesterResources.map(
                                  (resource) => (
                                    <div
                                      key={
                                        resource._id
                                      }
                                      className="bg-white rounded-2xl p-6 shadow-md"
                                    >

                                      <div className="text-5xl">
                                        📕
                                      </div>

                                      <h4 className="text-xl font-bold text-gray-800 mt-4">
                                        {
                                          resource.title
                                        }
                                      </h4>

                                      {resource.subject && (
                                        <p className="text-sm text-gray-600 mt-2">
                                          {
                                            resource.subject
                                          }
                                        </p>
                                      )}

                                      <a
                                        href={
                                          resource.fileUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block mt-5 bg-blue-600 hover:bg-blue-700 text-white text-center px-5 py-3 rounded-xl font-bold"
                                      >
                                        📖 Open PDF →
                                      </a>

                                    </div>
                                  )
                                )}

                              </div>

                            </div>
                          )
                        )}

                    </div>
                  )}

                </>
              )}
            </>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}
