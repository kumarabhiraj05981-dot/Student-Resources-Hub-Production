import { useEffect, useState } from "react";
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

const BRANCHES = [
  "Computer Science",
  "Electrical",
  "Mechanical",
  "Civil & CTM",
  "Electronics",
  "Leather Technology",
];

const CATEGORIES = [
  "Notes",
  "PYQ",
  "Syllabus",
  "Ebooks",
  "Other",
];

const SEMESTERS = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
];

export default function Admin() {
  // ==========================================
  // UPLOAD STATES
  // ==========================================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [branch, setBranch] = useState("Computer Science");
  const [semester, setSemester] = useState("");
  const [category, setCategory] = useState("Notes");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [uploading, setUploading] = useState(false);

  // ==========================================
  // RESOURCE STATES
  // ==========================================

  const [resources, setResources] = useState<Resource[]>([]);
  const [loadingResources, setLoadingResources] =
    useState(true);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] =
    useState("All");
  const [filterBranch, setFilterBranch] =
    useState("All");

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  // ==========================================
  // MAX FILE SIZE
  // ==========================================

  const MAX_FILE_SIZE = 500 * 1024 * 1024;

  // ==========================================
  // LOAD RESOURCES
  // ==========================================

  const loadResources = async () => {
    try {
      setLoadingResources(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await api.get("/api/resources", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("RESOURCES:", res.data);

      setResources(
        Array.isArray(res.data?.resources)
          ? res.data.resources
          : []
      );
    } catch (error: any) {
      console.error(
        "LOAD RESOURCES ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Unable to load resources"
      );
    } finally {
      setLoadingResources(false);
    }
  };

  // ==========================================
  // LOAD ON PAGE OPEN
  // ==========================================

  useEffect(() => {
    loadResources();
  }, []);

  // ==========================================
  // FILE SELECT
  // ==========================================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile =
      e.target.files?.[0] || null;

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // PDF CHECK
    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name
        .toLowerCase()
        .endsWith(".pdf")
    ) {
      alert("❌ Only PDF files are allowed");

      e.target.value = "";
      setFile(null);

      return;
    }

    // SIZE CHECK
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert(
        `❌ File size must be less than 500MB`
      );

      e.target.value = "";
      setFile(null);

      return;
    }

    setFile(selectedFile);
  };

  // ==========================================
  // UPLOAD RESOURCE
  // ==========================================

  const handleUpload = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter resource title");
      return;
    }

    if (!branch) {
      alert("Please select branch");
      return;
    }

    if (!semester) {
      alert("Please select semester");
      return;
    }

    if (!category) {
      alert("Please select category");
      return;
    }

    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Only PDF files are allowed");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File size must be less than 500MB");
      return;
    }

    try {
      setUploading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      // ======================================
      // FORM DATA
      // ======================================

      const formData = new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "description",
        description.trim()
      );

      formData.append(
        "branch",
        branch
      );

      formData.append(
        "semester",
        semester
      );

      formData.append(
        "category",
        category
      );

      formData.append(
        "subject",
        subject.trim()
      );

      formData.append(
        "file",
        file
      );

      console.log("UPLOADING:", {
        title,
        description,
        branch,
        semester,
        category,
        subject,
        file: file.name,
        size: `${(
          file.size /
          1024 /
          1024
        ).toFixed(2)} MB`,
      });

      // ======================================
      // API REQUEST
      // ======================================

      const res = await api.post(
        "/api/upload",
        formData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },

          maxContentLength:
            500 * 1024 * 1024,

          maxBodyLength:
            500 * 1024 * 1024,
        }
      );

      console.log(
        "UPLOAD RESPONSE:",
        res.data
      );

      if (!res.data?.success) {
        throw new Error(
          res.data?.message ||
            "Upload failed"
        );
      }

      alert(
        `✅ Resource uploaded successfully!\n\nBranch: ${branch}`
      );

      // ======================================
      // RESET
      // ======================================

      setTitle("");
      setDescription("");
      setBranch("Computer Science");
      setSemester("");
      setCategory("Notes");
      setSubject("");
      setFile(null);

      const fileInput =
        document.getElementById(
          "resource-file"
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      await loadResources();

    } catch (error: any) {
      console.error(
        "UPLOAD ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "File upload failed"
      );
    } finally {
      setUploading(false);
    }
  };

  // ==========================================
  // DELETE RESOURCE
  // ==========================================

  const handleDelete = async (
    id: string
  ) => {
    const resource = resources.find(
      (item) => item._id === id
    );

    if (!resource) return;

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${resource.title}"?`
      );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const res = await api.delete(
        `/api/resources/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      console.log(
        "DELETE RESPONSE:",
        res.data
      );

      if (!res.data?.success) {
        throw new Error(
          res.data?.message ||
            "Delete failed"
        );
      }

      alert(
        "🗑️ Resource deleted successfully!"
      );

      setResources((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

    } catch (error: any) {
      console.error(
        "DELETE ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete resource"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // FILTER RESOURCES
  // ==========================================

  const filteredResources =
    resources.filter((resource) => {
      const searchText =
        search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        resource.title
          ?.toLowerCase()
          .includes(searchText) ||
        resource.subject
          ?.toLowerCase()
          .includes(searchText) ||
        resource.description
          ?.toLowerCase()
          .includes(searchText) ||
        resource.branch
          ?.toLowerCase()
          .includes(searchText);

      const matchesCategory =
        filterCategory === "All" ||
        resource.category
          ?.toLowerCase() ===
          filterCategory.toLowerCase();

      const matchesBranch =
        filterBranch === "All" ||
        resource.branch === filterBranch;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesBranch
      );
    });

  // ==========================================
  // FORMAT FILE SIZE
  // ==========================================

  const formatFileSize = (
    bytes: number
  ) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (
      bytes <
      1024 * 1024
    ) {
      return `${(
        bytes / 1024
      ).toFixed(2)} KB`;
    }

    return `${(
      bytes /
      1024 /
      1024
    ).toFixed(2)} MB`;
  };

  // ==========================================
  // BRANCH ICON
  // ==========================================

  const getBranchIcon = (
    branchName?: string
  ) => {
    switch (branchName) {
      case "Computer Science":
        return "💻";

      case "Electrical":
        return "⚡";

      case "Mechanical":
        return "🔧";

      case "Civil & CTM":
        return "🏗️";

      case "Electronics":
        return "📡";

      case "Leather Technology":
        return "👞";

      default:
        return "🎓";
    }
  };
  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ======================================
            UPLOAD SECTION
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">
              📚 Admin Resource Upload
            </h1>

            <p className="text-gray-600">
              Upload Notes, PYQs, Syllabus and E-books
              branch-wise.
            </p>
          </div>

          {/* ==================================
              UPLOAD FORM
          ================================== */}

          <form
            onSubmit={handleUpload}
            className="space-y-6"
          >

            {/* TITLE */}

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Resource Title *
              </label>

              <input
                type="text"
                placeholder="Example: DBMS Unit 1 Notes"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>


            {/* ==================================
                BRANCH
            ================================== */}

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                🎓 Branch *
              </label>

              <select
                value={branch}
                onChange={(e) =>
                  setBranch(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {BRANCHES.map(
                  (branchName) => (
                    <option
                      key={branchName}
                      value={branchName}
                    >
                      {getBranchIcon(
                        branchName
                      )}{" "}
                      {branchName}
                    </option>
                  )
                )}
              </select>
            </div>


            {/* ==================================
                DESCRIPTION
            ================================== */}

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Description
              </label>

              <textarea
                placeholder="Enter resource description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
              />
            </div>


            {/* ==================================
                SEMESTER
            ================================== */}

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Semester *
              </label>

              <select
                value={semester}
                onChange={(e) =>
                  setSemester(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">
                  Select Semester
                </option>

                {SEMESTERS.map(
                  (semesterName) => (
                    <option
                      key={semesterName}
                      value={semesterName}
                    >
                      {semesterName}
                    </option>
                  )
                )}
              </select>
            </div>


            {/* ==================================
                SUBJECT
            ================================== */}

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                📖 Subject
              </label>

              <input
                type="text"
                placeholder="Example: DBMS"
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>


            {/* ==================================
                CATEGORY
            ================================== */}

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                📂 Category *
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {CATEGORIES.map(
                  (categoryName) => (
                    <option
                      key={categoryName}
                      value={categoryName}
                    >
                      {categoryName ===
                        "Ebooks"
                        ? "📚 E-Books"
                        : categoryName}
                    </option>
                  )
                )}
              </select>
            </div>


            {/* ==================================
                PDF FILE
            ================================== */}

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                📄 Select PDF *
              </label>

              <input
                id="resource-file"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-white cursor-pointer"
                required
              />

              {/* SELECTED FILE */}

              {file && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl p-4">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                    <p className="text-sm text-blue-700 font-semibold break-all">
                      📄 {file.name}
                    </p>

                    <p className="text-sm text-gray-600 whitespace-nowrap">
                      📦 {formatFileSize(
                        file.size
                      )}
                    </p>

                  </div>

                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Maximum file size:{" "}
                <strong>500MB</strong>. PDF files
                only.
              </p>
            </div>


            {/* ==================================
                UPLOAD BUTTON
            ================================== */}

            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-3.5 rounded-lg text-white font-bold text-lg transition ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
              }`}
            >
              {uploading
                ? "⏳ Uploading to Cloudinary..."
                : "🚀 Upload Resource"}
            </button>

          </form>
        </div>


        {/* ======================================
            RESOURCE MANAGEMENT
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* ==================================
              HEADER
          ================================== */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                📋 Manage Resources
              </h2>

              <p className="text-gray-500 mt-1">
                Total resources:{" "}
                <span className="font-bold text-blue-600">
                  {resources.length}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={loadResources}
              disabled={loadingResources}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-5 py-2.5 rounded-lg transition"
            >
              {loadingResources
                ? "⏳ Loading..."
                : "🔄 Refresh"}
            </button>
          </div>


          {/* ==================================
              FILTER HEADER
          ================================== */}

          <div className="mb-6">

            <h3 className="text-xl font-bold text-gray-800">
              🔎 Filter Resources
            </h3>

            <p className="text-gray-500 mt-1">
              Search and filter your uploaded
              resources.
            </p>

          </div>


          {/* ==================================
              SEARCH + FILTERS
          ================================== */}

          <div className="grid md:grid-cols-3 gap-4 mb-8">

            {/* SEARCH */}

            <div className="md:col-span-1">

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>

              <input
                type="text"
                placeholder="Search title, subject, branch..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />

            </div>


            {/* CATEGORY FILTER */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>

              <select
                value={filterCategory}
                onChange={(e) =>
                  setFilterCategory(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="All">
                  All Categories
                </option>

                {CATEGORIES.map(
                  (categoryName) => (
                    <option
                      key={categoryName}
                      value={categoryName}
                    >
                      {categoryName ===
                        "Ebooks"
                        ? "E-Books"
                        : categoryName}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* BRANCH FILTER */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Branch
              </label>

              <select
                value={filterBranch}
                onChange={(e) =>
                  setFilterBranch(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg p-3 bg-white outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="All">
                  All Branches
                </option>

                {BRANCHES.map(
                  (branchName) => (
                    <option
                      key={branchName}
                      value={branchName}
                    >
                      {getBranchIcon(
                        branchName
                      )}{" "}
                      {branchName}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>


          {/* ==================================
              FILTER RESULT COUNT
          ================================== */}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">

            <p className="text-gray-600">
              Showing{" "}
              <span className="font-bold text-blue-600">
                {filteredResources.length}
              </span>{" "}
              of{" "}
              <span className="font-bold">
                {resources.length}
              </span>{" "}
              resources
            </p>

            {(search ||
              filterCategory !== "All" ||
              filterBranch !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilterCategory("All");
                  setFilterBranch("All");
                }}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg transition"
              >
                ✖ Clear Filters
              </button>
            )}

          </div>


          {/* ==================================
              PART 3 WILL CONTINUE HERE
          ================================== */}
          {/* ==================================
              LOADING RESOURCES
          ================================== */}

          {loadingResources ? (
            <div className="py-16 text-center">

              <div className="text-5xl mb-4">
                ⏳
              </div>

              <p className="text-xl font-semibold text-gray-700">
                Loading resources...
              </p>

              <p className="text-gray-500 mt-2">
                Please wait
              </p>

            </div>
          ) : filteredResources.length === 0 ? (

            /* ==================================
               NO RESOURCES
            ================================== */

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-10 text-center">

              <div className="text-6xl mb-4">
                📚
              </div>

              <h3 className="text-xl font-bold text-gray-700">
                No resources found
              </h3>

              <p className="text-gray-500 mt-2">
                {resources.length === 0
                  ? "No resources have been uploaded yet."
                  : "Try changing your search or filters."}
              </p>

              {(search ||
                filterCategory !== "All" ||
                filterBranch !== "All") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setFilterCategory("All");
                    setFilterBranch("All");
                  }}
                  className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2.5 rounded-lg transition"
                >
                  🔄 Reset Filters
                </button>
              )}

            </div>

          ) : (

            /* ==================================
               RESOURCE GRID
            ================================== */

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {filteredResources.map(
                (resource) => (

                  <div
                    key={resource._id}
                    className="border border-gray-200 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                  >

                    {/* ==================================
                        CARD HEADER
                    ================================== */}

                    <div className="p-6">

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex-1 min-w-0">

                          <h3 className="text-xl font-bold text-gray-800 break-words">
                            {resource.title}
                          </h3>

                        </div>

                        {/* CATEGORY BADGE */}

                        <span className="shrink-0 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                          {resource.category ===
                          "Ebooks"
                            ? "E-Book"
                            : resource.category}
                        </span>

                      </div>


                      {/* ==================================
                          BRANCH
                      ================================== */}

                      <div className="mt-4 flex items-center gap-2">

                        <span className="text-lg">
                          {getBranchIcon(
                            resource.branch
                          )}
                        </span>

                        <span className="text-sm font-semibold text-gray-700">
                          {resource.branch ||
                            "Computer Science"}
                        </span>

                      </div>


                      {/* ==================================
                          SEMESTER
                      ================================== */}

                      {resource.semester && (
                        <div className="mt-3">

                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Semester
                          </p>

                          <p className="text-sm font-medium text-gray-700 mt-1">
                            🎓{" "}
                            {resource.semester}
                          </p>

                        </div>
                      )}


                      {/* ==================================
                          SUBJECT
                      ================================== */}

                      {resource.subject && (
                        <div className="mt-3">

                          <p className="text-xs font-semibold text-gray-500 uppercase">
                            Subject
                          </p>

                          <p className="text-sm font-medium text-gray-700 mt-1">
                            📖{" "}
                            {resource.subject}
                          </p>

                        </div>
                      )}


                      {/* ==================================
                          DESCRIPTION
                      ================================== */}

                      {resource.description && (
                        <div className="mt-4">

                          <p className="text-sm text-gray-600 line-clamp-3">
                            {resource.description}
                          </p>

                        </div>
                      )}


                      {/* ==================================
                          FILE NAME
                      ================================== */}

                      {resource.fileName && (
                        <div className="mt-4 bg-gray-50 border border-gray-100 rounded-lg p-3">

                          <p
                            className="text-sm text-gray-600 truncate"
                            title={
                              resource.fileName
                            }
                          >
                            📄{" "}
                            {resource.fileName}
                          </p>

                        </div>
                      )}


                      {/* ==================================
                          CREATED DATE
                      ================================== */}

                      {resource.createdAt && (
                        <p className="text-xs text-gray-400 mt-4">
                          Uploaded:{" "}
                          {new Date(
                            resource.createdAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </p>
                      )}

                    </div>


                    {/* ==================================
                        ACTION BUTTONS
                    ================================== */}

                    <div className="border-t border-gray-100 bg-gray-50 p-4">

                      <div className="grid grid-cols-2 gap-3">

                        {/* OPEN */}

                        <a
                          href={
                            resource.fileUrl
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 px-3 rounded-lg transition"
                        >
                          👁️ Open
                        </a>


                        {/* DOWNLOAD */}

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
                          className="text-center bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-2.5 px-3 rounded-lg transition"
                        >
                          ⬇️ Download
                        </a>

                      </div>


                      {/* ==================================
                          DELETE
                      ================================== */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            resource._id
                          )
                        }
                        disabled={
                          deletingId ===
                          resource._id
                        }
                        className={`w-full mt-3 py-2.5 rounded-lg text-white font-semibold transition ${
                          deletingId ===
                          resource._id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 active:bg-red-800"
                        }`}
                      >
                        {deletingId ===
                        resource._id
                          ? "⏳ Deleting..."
                          : "🗑️ Delete Resource"}
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>
    </div>
  );
}
