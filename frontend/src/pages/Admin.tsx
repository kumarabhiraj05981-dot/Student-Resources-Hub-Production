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

export default function Admin() {
  // ==========================================
  // UPLOAD STATES
  // ==========================================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // BRANCH
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
  const [loadingResources, setLoadingResources] = useState(true);

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterBranch, setFilterBranch] = useState("All");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ==========================================
  // FILE SIZE
  // 500 MB
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
  // LOAD WHEN PAGE OPENS
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
    const selectedFile = e.target.files?.[0] || null;

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // PDF CHECK
    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("❌ Only PDF files are allowed");

      e.target.value = "";
      setFile(null);

      return;
    }

    // SIZE CHECK
    if (selectedFile.size > MAX_FILE_SIZE) {
      alert(
        `❌ File size must be less than ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB`
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

    // TITLE
    if (!title.trim()) {
      alert("Please enter resource title");
      return;
    }

    // BRANCH
    if (!branch) {
      alert("Please select branch");
      return;
    }

    // SEMESTER
    if (!semester) {
      alert("Please select semester");
      return;
    }

    // CATEGORY
    if (!category) {
      alert("Please select category");
      return;
    }

    // FILE
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    // PDF CHECK
    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      alert("Only PDF files are allowed");
      return;
    }

    // SIZE CHECK
    if (file.size > MAX_FILE_SIZE) {
      alert(
        `File size must be less than ${
          MAX_FILE_SIZE / 1024 / 1024
        }MB`
      );
      return;
    }

    try {
      setUploading(true);

      const token = localStorage.getItem("token");

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

      // IMPORTANT
      // BRANCH IS SENT TO BACKEND
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
            Authorization: `Bearer ${token}`,
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
      // RESET FORM
      // ======================================

      setTitle("");
      setDescription("");

      // Default branch back to CSE
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

      // Reload resources
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

    if (!resource) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${resource.title}"?`
    );

    if (!confirmed) {
      return;
    }

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
            Authorization: `Bearer ${token}`,
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

    if (bytes < 1024 * 1024) {
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
  // GET BRANCH ICON
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

          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            📚 Admin Resource Upload
          </h1>

          <p className="text-gray-600 mb-8">
            Upload Notes, PYQs, Syllabus and
            E-books branch-wise.
          </p>

          <form
            onSubmit={handleUpload}
            className="space-y-5"
          >

            {/* TITLE */}

            <div>
              <label className="block font-semibold mb-2">
                Resource Title
              </label>

              <input
                type="text"
                placeholder="Example: DBMS Unit 1 Notes"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>


            {/* ==================================
                BRANCH
            ================================== */}

            <div>
              <label className="block font-semibold mb-2">
                🎓 Branch
              </label>

              <select
                value={branch}
                onChange={(e) =>
                  setBranch(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              >

                <option value="Computer Science">
                  💻 Computer Science
                </option>

                <option value="Electrical">
                  ⚡ Electrical
                </option>

                <option value="Mechanical">
                  🔧 Mechanical
                </option>

                <option value="Civil & CTM">
                  🏗️ Civil & CTM
                </option>

                <option value="Electronics">
                  📡 Electronics
                </option>

                <option value="Leather Technology">
                  👞 Leather Technology
                </option>

              </select>
            </div>


            {/* DESCRIPTION */}

            <div>
              <label className="block font-semibold mb-2">
                Description
              </label>

              <textarea
                placeholder="Enter resource description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>


            {/* SEMESTER */}

            <div>
              <label className="block font-semibold mb-2">
                Semester
              </label>

              <select
                value={semester}
                onChange={(e) =>
                  setSemester(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              >

                <option value="">
                  Select Semester
                </option>

                <option value="1st Semester">
                  1st Semester
                </option>

                <option value="2nd Semester">
                  2nd Semester
                </option>

                <option value="3rd Semester">
                  3rd Semester
                </option>

                <option value="4th Semester">
                  4th Semester
                </option>

                <option value="5th Semester">
                  5th Semester
                </option>

                <option value="6th Semester">
                  6th Semester
                </option>

              </select>
            </div>


            {/* SUBJECT */}

            <div>
              <label className="block font-semibold mb-2">
                Subject
              </label>

              <input
                type="text"
                placeholder="Example: DBMS"
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>


            {/* CATEGORY */}

            <div>
              <label className="block font-semibold mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              >

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
                  E-books
                </option>

                <option value="Other">
                  Other
                </option>

              </select>
            </div>


            {/* FILE */}

            <div>
              <label className="block font-semibold mb-2">
                Select PDF
              </label>

              <input
                id="resource-file"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              />

              {file && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4">

                  <p className="text-sm text-blue-700 font-semibold">
                    📄 Selected: {file.name}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    📦 Size:{" "}
                    {formatFileSize(file.size)}
                  </p>

                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Maximum file size:{" "}
                <strong>500MB</strong>.
                PDF only.
              </p>

            </div>


            {/* UPLOAD BUTTON */}

            <button
              type="submit"
              disabled={uploading}
              className={`w-full py-3 rounded-lg text-white font-bold text-lg transition ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {uploading
                ? "⏳ Uploading..."
                : "🚀 Upload Resource"}
            </button>

          </form>
        </div>


        {/* ======================================
            RESOURCE MANAGEMENT
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                📋 Manage Resources
              </h2>

              <p className="text-gray-500 mt-1">
                Total resources:{" "}
                <span className="font-bold">
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


          {/* ======================================
              FILTER HEADER
          ====================================== */}

          <div className="mb-6">

            <h3 className="text-xl font-bold text-gray-800">
              🔎 Filter Resources
            </h3>

            <p className="text-gray-500 mt-1">
              Search and filter your uploaded resources
            </p>

          </div>


          {/* ======================================
              SEARCH + FILTER
          ====================================== */}

          <div className="grid md:grid-cols-3 gap-4 mb-8">

            {/* SEARCH */}

            <input
              type="text"
              placeholder="🔎 Search title, subject, branch..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />


            {/* CATEGORY FILTER */}

            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
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
                E-books
              </option>

              <option value="Other">
                Other
              </option>

            </select>


            {/* BRANCH FILTER */}

            <select
              value={filterBranch}
              onChange={(e) =>
                setFilterBranch(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="All">
                All Branches
              </option>

              <option value="Computer Science">
                💻 Computer Science
              </option>

              <option value="Electrical">
                ⚡ Electrical
              </option>

              <option value="Mechanical">
                🔧 Mechanical
              </option>

              <option value="Civil & CTM">
                🏗️ Civil & CTM
              </option>

              <option value="Electronics">
                📡 Electronics
              </option>

              <option value="Leather Technology">
                👞 Leather Technology
              </option>

            </select>

          </div>


          {/* ======================================
              LOADING
          ====================================== */}

          {loadingResources ? (

            <div className="text-center py-12">

              <div className="text-5xl mb-4">
                ⏳
              </div>

              <p className="text-lg font-semibold text-gray-600">
                Loading resources...
              </p>

            </div>

          ) : filteredResources.length === 0 ? (

            <div className="text-center py-12 bg-gray-50 rounded-xl">

              <div className="text-5xl mb-4">
                📂
              </div>

              <p className="text-xl font-semibold text-gray-700">
                No resources found
              </p>

              <p className="text-gray-500 mt-2">
                Try another search or upload a
                resource.
              </p>

            </div>

          ) : (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredResources.map(
                (resource) => (

                  <div
                    key={resource._id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-lg transition bg-white"
                  >

                    {/* RESOURCE ICON */}

                    <div className="flex items-start justify-between gap-3">

                      <div className="text-4xl">
                        📄
                      </div>

                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                        {resource.category}
                      </span>

                    </div>


                    {/* TITLE */}

                    <h3 className="text-lg font-bold text-gray-800 mt-4 break-words">
                      {resource.title}
                    </h3>


                    {/* BRANCH */}

                    <div className="mt-3">

                      <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">
                        {getBranchIcon(resource.branch)}
                        {resource.branch || "Computer Science"}
                      </span>

                    </div>


                    {/* DESCRIPTION */}

                    {resource.description && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                        {resource.description}
                      </p>
                    )}


                    {/* DETAILS */}

                    <div className="mt-4 space-y-2 text-sm">

                      <p className="text-gray-600">
                        🎓{" "}
                        <strong>
                          Semester:
                        </strong>{" "}
                        {resource.semester}
                      </p>

                      <p className="text-gray-600">
                        📚{" "}
                        <strong>
                          Subject:
                        </strong>{" "}
                        {resource.subject ||
                          "N/A"}
                      </p>

                      {resource.fileName && (
                        <p className="text-gray-500 break-all">
                          📎{" "}
                          {resource.fileName}
                        </p>
                      )}

                    </div>


                    {/* DATE */}

                    {resource.createdAt && (
                      <p className="text-xs text-gray-400 mt-4">
                        Uploaded:{" "}
                        {new Date(
                          resource.createdAt
                        ).toLocaleDateString()}
                      </p>
                    )}


                    {/* ACTIONS */}

                    <div className="flex gap-3 mt-5">

                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                      >
                        👁️ Open PDF
                      </a>

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
                        className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                          deletingId ===
                          resource._id
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                      >
                        {deletingId ===
                        resource._id
                          ? "..."
                          : "🗑️"}
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
