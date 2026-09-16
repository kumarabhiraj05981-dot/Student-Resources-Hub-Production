
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import api from "../services/api";
import BookmarkButton from "../components/bookmarks/BookmarkButton";
import ResourceFilters from "../components/resources/ResourceFilters";

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
  description: string;
}

const branches: Branch[] = [
  {
    id: "cse",
    name: "Computer Science Engineering",
    shortName: "CSE",
    description:
      "Notes, PYQs, Syllabus, E-Books and other study resources.",
  },
  {
    id: "electrical",
    name: "Electrical Engineering",
    shortName: "Electrical",
    description:
      "Electrical Engineering notes, PYQs, syllabus and study materials.",
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    shortName: "Mechanical",
    description:
      "Mechanical Engineering notes, PYQs, syllabus and study materials.",
  },
  {
    id: "civil-ctm",
    name: "Civil Engineering / CTM",
    shortName: "Civil / CTM",
    description:
      "Civil Engineering and CTM study resources.",
  },
  {
    id: "electronics",
    name: "Electronics Engineering",
    shortName: "Electronics",
    description:
      "Electronics Engineering notes, PYQs, syllabus and study materials.",
  },
  {
    id: "leather",
    name: "Leather Technology",
    shortName: "Leather",
    description:
      "Leather Technology notes, PYQs, syllabus and study materials.",
  },
];

const branchApiNames: Record<string, string> = {
  cse: "Computer Science",
  electrical: "Electrical",
  mechanical: "Mechanical",
  "civil-ctm": "Civil & CTM",
  electronics: "Electronics",
  leather: "Leather Technology",
};

const RESOURCE_FOLDERS = [
  {
    id: "Notes",
    name: "Notes",
    description:
      "Study notes, unit notes and subject-wise learning material.",
    bg: "bg-blue-50",
    hover: "hover:bg-blue-100",
    border: "border-blue-200",
    iconBg: "bg-blue-100",
    iconText: "text-blue-700",
    button: "bg-blue-600 hover:bg-blue-700",
  },
  {
    id: "PYQ",
    name: "PYQ",
    description:
      "Previous year question papers and exam papers.",
    bg: "bg-orange-50",
    hover: "hover:bg-orange-100",
    border: "border-orange-200",
    iconBg: "bg-orange-100",
    iconText: "text-orange-700",
    button: "bg-orange-500 hover:bg-orange-600",
  },
  {
    id: "Syllabus",
    name: "Syllabus",
    description:
      "Semester-wise syllabus and course documents.",
    bg: "bg-purple-50",
    hover: "hover:bg-purple-100",
    border: "border-purple-200",
    iconBg: "bg-purple-100",
    iconText: "text-purple-700",
    button: "bg-purple-600 hover:bg-purple-700",
  },
  {
    id: "Ebooks",
    name: "E-Books",
    description:
      "Useful books and learning material in PDF format.",
    bg: "bg-green-50",
    hover: "hover:bg-green-100",
    border: "border-green-200",
    iconBg: "bg-green-100",
    iconText: "text-green-700",
    button: "bg-green-600 hover:bg-green-700",
  },
];

export default function BranchResources() {
  const { branchId } = useParams();

  const selectedBranchId = branchId || "cse";

  const branch =
    branches.find((item) => item.id === selectedBranchId) ||
    branches[0];

  const apiBranchName =
    branchApiNames[branch.id] || "Computer Science";

  /* =========================================================
     STATES
  ========================================================= */

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedFolder, setSelectedFolder] =
    useState<string | null>(null);

  /* FILTER STATES */

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  /* BOOKMARK STATES */

  const [bookmarkedIds, setBookmarkedIds] =
    useState<string[]>([]);

  /* =========================================================
     LOAD RESOURCES
  ========================================================= */

  const loadResources = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/api/resources");

      const data = response.data;

      let resourceList: Resource[] = [];

      if (Array.isArray(data)) {
        resourceList = data;
      } else if (Array.isArray(data?.resources)) {
        resourceList = data.resources;
      }

      setResources(resourceList);
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

  /* =========================================================
     LOAD BOOKMARKS
  ========================================================= */

  const loadBookmarks = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setBookmarkedIds([]);
      return;
    }

    try {
      const response = await api.get(
        "/api/bookmarks/ids",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookmarkedIds(
        response.data?.resourceIds || []
      );
    } catch (err) {
      console.error(
        "BOOKMARK LOAD ERROR:",
        err
      );

      setBookmarkedIds([]);
    }
  };

  /* =========================================================
     PAGE LOAD
  ========================================================= */

  useEffect(() => {
    loadResources();
    loadBookmarks();
  }, []);

  /* =========================================================
     BOOKMARK CHANGE
  ========================================================= */

  const handleBookmarkChange = (
    resourceId: string,
    bookmarked: boolean
  ) => {
    setBookmarkedIds((prev) => {
      if (bookmarked) {
        return prev.includes(resourceId)
          ? prev
          : [...prev, resourceId];
      }

      return prev.filter(
        (id) => id !== resourceId
      );
    });
  };

  /* =========================================================
     BRANCH RESOURCES
  ========================================================= */

  const branchResources = useMemo(() => {
    const selectedBranch =
      apiBranchName.trim().toLowerCase();

    return resources.filter((resource) => {
      const resourceBranch =
        resource.branch
          ?.trim()
          .toLowerCase();

      return resourceBranch === selectedBranch;
    });
  }, [resources, apiBranchName]);

  /* =========================================================
     FILTERED BRANCH RESOURCES
  ========================================================= */

  const filteredBranchResources = useMemo(() => {
    const searchText = search
      .trim()
      .toLowerCase();

    return branchResources.filter((resource) => {
      const matchesSearch =
        !searchText ||
        resource.title
          ?.toLowerCase()
          .includes(searchText) ||
        resource.description
          ?.toLowerCase()
          .includes(searchText) ||
        resource.subject
          ?.toLowerCase()
          .includes(searchText) ||
        resource.semester
          ?.toLowerCase()
          .includes(searchText) ||
        resource.branch
          ?.toLowerCase()
          .includes(searchText) ||
        resource.fileName
          ?.toLowerCase()
          .includes(searchText);

      let matchesBranch = true;

      if (branchFilter) {
        const filter = branchFilter
          .trim()
          .toLowerCase();

        const currentBranch =
          resource.branch
            ?.trim()
            .toLowerCase();

        const branchAliases: Record<
          string,
          string[]
        > = {
          "computer science": [
            "computer science",
          ],
          "information technology": [
            "information technology",
          ],
          "electronics & communication": [
            "electronics",
            "electronics & communication",
          ],
          electrical: ["electrical"],
          mechanical: ["mechanical"],
          "civil / ctm": [
            "civil & ctm",
            "civil / ctm",
            "civil",
          ],
          electronics: ["electronics"],
          "leather technology": [
            "leather technology",
          ],
        };

        const aliases =
          branchAliases[filter] || [filter];

        matchesBranch =
          aliases.includes(
            currentBranch || ""
          );
      }

      const matchesSemester =
        !semesterFilter ||
        resource.semester
          ?.toString()
          .trim()
          .toLowerCase() ===
          semesterFilter
            .trim()
            .toLowerCase();

      const matchesCategory =
        !categoryFilter ||
        resource.category
          ?.trim()
          .toLowerCase() ===
          categoryFilter
            .trim()
            .toLowerCase();

      return (
        matchesSearch &&
        matchesBranch &&
        matchesSemester &&
        matchesCategory
      );
    });
  }, [
    branchResources,
    search,
    branchFilter,
    semesterFilter,
    categoryFilter,
  ]);

  /* =========================================================
     SELECTED FOLDER RESOURCES
  ========================================================= */

  const folderResources = useMemo(() => {
    if (!selectedFolder) {
      return [];
    }

    const selectedCategory =
      selectedFolder
        .trim()
        .toLowerCase();

    return filteredBranchResources.filter(
      (resource) => {
        const resourceCategory =
          resource.category
            ?.trim()
            .toLowerCase();

        return (
          resourceCategory ===
          selectedCategory
        );
      }
    );
  }, [
    filteredBranchResources,
    selectedFolder,
  ]);

  /* =========================================================
     FOLDER COUNT
  ========================================================= */

  const getFolderCount = (
    folderId: string
  ) => {
    const category =
      folderId.trim().toLowerCase();

    return branchResources.filter(
      (resource) =>
        resource.category
          ?.trim()
          .toLowerCase() === category
    ).length;
  };

  /* =========================================================
     CLEAR FILTERS
  ========================================================= */

  const clearFilters = () => {
    setSearch("");
    setBranchFilter("");
    setSemesterFilter("");
    setCategoryFilter("");
  };

  /* =========================================================
     DATE FORMAT
  ========================================================= */

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "";
    }

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

  /* =========================================================
     FOLDER INFORMATION
  ========================================================= */

  const selectedFolderInfo =
    RESOURCE_FOLDERS.find(
      (folder) =>
        folder.id === selectedFolder
    );

  /* =========================================================
     OPEN PDF
  ========================================================= */

  const openPdf = (
    fileUrl: string
  ) => {
    if (!fileUrl) {
      return;
    }

    window.open(
      fileUrl,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =========================================================
     RESET WHEN BRANCH CHANGES
  ========================================================= */

  useEffect(() => {
    setSelectedFolder(null);
    clearFilters();
  }, [branch.id]);

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <>
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 text-center">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            {branch.name}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-3xl mx-auto">
            {branch.description}
          </p>

          {!loading && (
            <div className="inline-block mt-6 bg-white/10 border border-white/30 px-5 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-base">
              {branchResources.length > 0
                ? `${branchResources.length} Resources Available`
                : "Resources Section"}
            </div>
          )}

        </div>
      </section>

      {/* =====================================================
          BRANCH SELECTOR
      ===================================================== */}

      <section className="bg-blue-50 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700">
              Select Your Branch
            </h2>

            <p className="text-gray-600 mt-3 text-sm sm:text-base">
              Choose your engineering branch to access study resources.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

            {branches.map((item) => {
              const isSelected =
                item.id === branch.id;

              return (
                <Link
                  key={item.id}
                  to={`/branch/${item.id}`}
                  className={`block rounded-2xl p-5 sm:p-6 transition duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-2xl"
                      : "bg-white text-gray-800 shadow-lg hover:shadow-2xl"
                  }`}
                >

                  <h3 className="text-xl font-bold">
                    {item.shortName}
                  </h3>

                  <p
                    className={`text-sm mt-2 ${
                      isSelected
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {item.name}
                  </p>

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
          MAIN RESOURCE SECTION
      ===================================================== */}

      <section className="bg-white py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <div className="text-center py-20">

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
            <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-6 sm:p-8 text-center">

              <h3 className="text-xl font-bold text-red-700">
                Resources load nahi ho pa rahe
              </h3>

              <p className="text-red-600 mt-3">
                {error}
              </p>

              <button
                type="button"
                onClick={loadResources}
                className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Try Again
              </button>

            </div>
          )}

          {/* =================================================
              CONTENT
          ================================================= */}

          {!loading && !error && (
            <>

              {/* =================================================
                  BEFORE FOLDER SELECTION
              ================================================= */}

              {!selectedFolder && (
                <>

                  {branchResources.length > 0 && (
                    <div className="mb-10">

                      <ResourceFilters
                        search={search}
                        branch={branchFilter}
                        semester={semesterFilter}
                        category={categoryFilter}
                        onSearchChange={setSearch}
                        onBranchChange={setBranchFilter}
                        onSemesterChange={setSemesterFilter}
                        onCategoryChange={setCategoryFilter}
                        onClear={clearFilters}
                        branchOptions={[
                          "Computer Science",
                          "Information Technology",
                          "Electronics & Communication",
                          "Electrical",
                          "Mechanical",
                          "Civil / CTM",
                          "Leather Technology",
                        ]}
                      />

                    </div>
                  )}

                  {(search ||
                    branchFilter ||
                    semesterFilter ||
                    categoryFilter) &&
                    branchResources.length > 0 && (
                      <div className="mb-8 rounded-2xl bg-blue-50 border border-blue-100 p-4 sm:p-5">

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                          <p className="text-gray-700 text-sm sm:text-base">
                            <strong>
                              {filteredBranchResources.length}
                            </strong>{" "}
                            matching resources found
                          </p>

                          <button
                            type="button"
                            onClick={clearFilters}
                            className="text-blue-700 font-semibold hover:text-blue-900 text-sm sm:text-base"
                          >
                            Clear Filters
                          </button>

                        </div>

                      </div>
                    )}

                  {branchResources.length > 0 &&
                    filteredBranchResources.length === 0 && (
                      <div className="max-w-2xl mx-auto bg-gray-50 border border-gray-200 rounded-3xl p-8 sm:p-12 text-center">

                        <div className="text-5xl mb-5">
                          🔎
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800">
                          No Matching Resources
                        </h3>

                        <p className="text-gray-600 mt-3">
                          Search ya filters change karke dobara try karo.
                        </p>

                        <button
                          type="button"
                          onClick={clearFilters}
                          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                        >
                          Clear All Filters
                        </button>

                      </div>
                    )}

                  {filteredBranchResources.length > 0 && (
                    <>

                      <div className="text-center mb-10 sm:mb-12">

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700">
                          {branch.shortName} Resources
                        </h2>

                        <p className="text-gray-600 mt-3">
                          Select a folder to view files.
                        </p>

                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">

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
                                onClick={() => {
                                  setSelectedFolder(
                                    folder.id
                                  );

                                  /*
                                   * Folder open karte waqt
                                   * category filter reset kar dete hain,
                                   * taaki Notes ke andar PYQ filter ki wajah
                                   * se blank result na aaye.
                                   */
                                  setCategoryFilter("");
                                }}
                                className={`${folder.bg} ${folder.hover} ${folder.border} border-2 rounded-3xl p-6 sm:p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-1 sm:hover:-translate-y-2 transition duration-300`}
                              >

                                <div
                                  className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ${folder.iconBg}`}
                                >
                                  <span
                                    className={`text-2xl font-bold ${folder.iconText}`}
                                  >
                                    PDF
                                  </span>
                                </div>

                                <h3 className="text-2xl font-bold text-gray-800 mt-6">
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

                    </>
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
                    onClick={() => {
                      setSelectedFolder(null);
                      clearFilters();
                    }}
                    className="mb-6 bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-3 rounded-xl font-semibold transition"
                  >
                    ← Back to Folders
                  </button>

                  {/* =================================================
                      FOLDER FILTERS
                  ================================================= */}

                  {branchResources.length > 0 && (
                    <div className="mb-8">

                      <ResourceFilters
                        search={search}
                        branch={branchFilter}
                        semester={semesterFilter}
                        category={categoryFilter}
                        onSearchChange={setSearch}
                        onBranchChange={setBranchFilter}
                        onSemesterChange={setSemesterFilter}
                        onCategoryChange={setCategoryFilter}
                        onClear={clearFilters}
                        branchOptions={[
                          "Computer Science",
                          "Information Technology",
                          "Electronics & Communication",
                          "Electrical",
                          "Mechanical",
                          "Civil / CTM",
                          "Leather Technology",
                        ]}
                      />

                    </div>
                  )}

                  {/* FOLDER HEADER */}

                  <div className="text-center mb-10 sm:mb-12">

                    <div
                      className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl flex items-center justify-center ${
                        selectedFolderInfo?.iconBg ||
                        "bg-blue-100"
                      }`}
                    >

                      <span
                        className={`text-2xl sm:text-3xl font-bold ${
                          selectedFolderInfo?.iconText ||
                          "text-blue-700"
                        }`}
                      >
                        PDF
                      </span>

                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700 mt-6">
                      {selectedFolderInfo?.name}
                    </h2>

                    <p className="text-gray-600 mt-3">
                      {branch.name} ke{" "}
                      {selectedFolderInfo?.name}{" "}
                      resources
                    </p>

                    <p className="text-gray-500 mt-2">
                      Total Files:{" "}
                      <strong>
                        {folderResources.length}
                      </strong>
                    </p>

                  </div>

                  {/* =================================================
                      FILTER RESULT SUMMARY INSIDE FOLDER
                  ================================================= */}

                  {(search ||
                    branchFilter ||
                    semesterFilter ||
                    categoryFilter) && (
                    <div className="mb-8 rounded-2xl bg-blue-50 border border-blue-100 p-4 sm:p-5">

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <p className="text-gray-700 text-sm sm:text-base">
                          <strong>
                            {folderResources.length}
                          </strong>{" "}
                          matching files found in{" "}
                          <strong>
                            {selectedFolderInfo?.name}
                          </strong>
                        </p>

                        <button
                          type="button"
                          onClick={clearFilters}
                          className="text-blue-700 font-semibold hover:text-blue-900 text-sm sm:text-base"
                        >
                          Clear Filters
                        </button>

                      </div>

                    </div>
                  )}

                  {/* =================================================
                      EMPTY / NO MATCHING FILES
                  ================================================= */}

                  {folderResources.length === 0 ? (
                    <div className="max-w-2xl mx-auto bg-blue-50 rounded-3xl p-8 sm:p-10 text-center shadow-lg">

                      <div className="text-5xl mb-4">
                        🔎
                      </div>

                      <h3 className="text-2xl font-bold text-gray-800">
                        No Matching Files
                      </h3>

                      <p className="text-gray-600 mt-3">
                        Search ya filters change karke dobara try karo.
                      </p>

                      <button
                        type="button"
                        onClick={clearFilters}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                      >
                        Clear Filters
                      </button>

                    </div>
                  ) : (

                    /* =================================================
                       RESOURCE CARDS
                    ================================================= */

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

                      {folderResources.map(
                        (resource) => (

                          <div
                            key={resource._id}
                            className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition duration-300 flex flex-col"
                          >

                            {/* FILE HEADER */}

                            <div className="flex items-start justify-between gap-4">

                              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                <span className="text-red-700 font-bold">
                                  PDF
                                </span>
                              </div>

                              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                                PDF
                              </span>

                            </div>

                            {/* TITLE */}

                            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mt-5 break-words">
                              {resource.title}
                            </h3>

                            {/* FILE NAME */}

                            {resource.fileName && (
                              <p className="text-xs text-gray-500 mt-2 break-all">
                                File:{" "}
                                {resource.fileName}
                              </p>
                            )}

                            {/* SUBJECT */}

                            {resource.subject && (
                              <p className="text-sm text-gray-600 mt-3">
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
                              <p className="text-sm text-gray-500 mt-3 line-clamp-3">
                                {resource.description}
                              </p>
                            )}

                            {/* DATE */}

                            {resource.createdAt && (
                              <p className="text-xs text-gray-400 mt-4">
                                Uploaded:{" "}
                                {formatDate(
                                  resource.createdAt
                                )}
                              </p>
                            )}

                            {/* ACTIONS */}

                            <div className="mt-auto pt-6">

                              {/* BOOKMARK */}

                              <BookmarkButton
                                resourceId={
                                  resource._id
                                }
                                bookmarked={bookmarkedIds.includes(
                                  resource._id
                                )}
                                onChange={
                                  handleBookmarkChange
                                }
                              />

                              {/* OPEN / DOWNLOAD */}

                              <div className="mt-3 flex flex-col gap-3 sm:flex-row">

                                {resource.fileUrl ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openPdf(
                                          resource.fileUrl
                                        )
                                      }
                                      className={`w-full sm:flex-1 text-white px-4 py-3 rounded-xl font-bold transition ${
                                        selectedFolderInfo?.button ||
                                        "bg-blue-600 hover:bg-blue-700"
                                      }`}
                                    >
                                      Open PDF →
                                    </button>

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
                                      className="w-full sm:flex-1 bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-xl font-bold text-center transition"
                                    >
                                      Download
                                    </a>
                                  </>
                                ) : (
                                  <div className="w-full bg-gray-200 text-gray-500 text-center px-5 py-3 rounded-xl font-semibold">
                                    PDF unavailable
                                  </div>
                                )}

                              </div>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  )}

                </>
              )}

              {/* =================================================
                  NO RESOURCES AT ALL
              ================================================= */}

              {branchResources.length === 0 && (
                <div className="max-w-3xl mx-auto text-center bg-blue-50 rounded-3xl p-8 sm:p-10 md:p-14 shadow-xl">

                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                    No Resources Available
                  </h3>

                  <p className="text-gray-600 text-base sm:text-lg mt-4">
                    Abhi{" "}
                    <strong>
                      {branch.name}
                    </strong>{" "}
                    ke liye koi resource upload nahi hua hai.
                  </p>

                  <p className="text-gray-500 mt-3">
                    Admin se resource upload hone ke baad yahan automatically dikhai dega.
                  </p>

                </div>
              )}

            </>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}
