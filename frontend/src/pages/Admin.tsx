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

  // IMPORTANT:
  // File input ko reset karne ke liye key use karenge.
  const [fileInputKey, setFileInputKey] = useState(0);

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
  // RESET FILE INPUT
  // ==========================================

  const resetFileInput = () => {
    setFile(null);

    // File input ko completely recreate karega.
    setFileInputKey((prev) => prev + 1);
  };

  // ==========================================
  // FILE SELECT
  // ==========================================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("FILE INPUT CHANGED");

    const inputFile = e.currentTarget.files?.[0];

    console.log("SELECTED FILE:", inputFile);

    if (!inputFile) {
      setFile(null);
      return;
    }

    // ======================================
    // PDF CHECK
    // ======================================

    const isPDF =
      inputFile.type === "application/pdf" ||
      inputFile.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPDF) {
      alert("Only PDF files are allowed");

      e.currentTarget.value = "";
      setFile(null);

      return;
    }

    // ======================================
    // SIZE CHECK
    // ======================================

    if (inputFile.size > MAX_FILE_SIZE) {
      alert("File size must be less than 500MB");

      e.currentTarget.value = "";
      setFile(null);

      return;
    }

    // ======================================
    // SAVE FILE
    // ======================================

    setFile(inputFile);

    console.log(
      "FILE SAVED:",
      inputFile.name
    );
  };

  // ==========================================
  // UPLOAD RESOURCE
  // ==========================================

  const handleUpload = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // ======================================
    // VALIDATION
    // ======================================

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

    const isPDF =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPDF) {
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
        file,
        file.name
      );

      console.log("================================");
      console.log("UPLOADING FILE");
      console.log("Name:", file.name);
      console.log("Type:", file.type);
      console.log("Size:", file.size);
      console.log("Branch:", branch);
      console.log("Semester:", semester);
      console.log("Category:", category);
      console.log("================================");

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
        `Resource uploaded successfully!\n\nBranch: ${branch}`
      );

      // ======================================
      // RESET FORM
      // ======================================

      setTitle("");
      setDescription("");
      setBranch("Computer Science");
      setSemester("");
      setCategory("Notes");
      setSubject("");

      resetFileInput();

      // ======================================
      // RELOAD RESOURCES
      // ======================================

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
        "Resource deleted successfully!"
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
  // BRANCH ICON
  // ==========================================

  const getBranchIcon = (
    branchName?: string
  ) => {
    switch (branchName) {
      case "Computer Science":
        return "";

      case "Electrical":
        return "";

      case "Mechanical":
        return "";

      case "Civil & CTM":
        return "";

      case "Electronics":
        return "";

      case "Leather Technology":
        return "";

      default:
        return "";
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
              Admin Resource Upload
            </h1>

            <p className="text-gray-600">
              Upload Notes, PYQs, Syllabus and
              E-books branch-wise.
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

            {/* BRANCH */}

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Branch *
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

            {/* DESCRIPTION */}

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

            {/* SEMESTER */}

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

            {/* SUBJECT */}

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Subject
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

            {/* CATEGORY */}

            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Category *
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
                        ? "E-Books"
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
                Select PDF *
              </label>

              <input
                key={fileInputKey}
                id="resource-file"
                name="file"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                className="w-full border border-gray-300 rounded-lg p-3 bg-white cursor-pointer"
                required={!file}
              />

              {/* ==================================
                  SELECTED FILE
              ================================== */}

              {file ? (
                <div className="mt-3 bg-green-50 border border-green-300 rounded-xl p-4">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    <div className="min-w-0">
                      <p className="text-xs text-green-700 font-semibold mb-1">
                        SELECTED FILE
                      </p>

                      <p className="text-sm text-green-800 font-bold break-all">
                        {file.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">

                      <p className="text-sm text-gray-600 whitespace-nowrap">
                        {formatFileSize(
                          file.size
                        )}
                      </p>

                      <button
                        type="button"
                        onClick={resetFileInput}
                        className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-semibold"
                      >
                        Remove
                      </button>

                    </div>

                  </div>

                </div>
              ) : (
                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-500">
                    No file selected
                  </p>
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
                ? "Uploading to Cloudinary..."
                : "Upload Resource"}
            </button>

          </form>
        </div>

        {/* ======================================
            RESOURCE MANAGEMENT
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Manage Resources
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
                ? "Loading..."
                : "Refresh"}
            </button>

          </div>

          <div className="mb-6">

            <h3 className="text-xl font-bold text-gray-800">
              Filter Resources
            </h3>

            <p className="text-gray-500 mt-1">
              Search and filter your uploaded
              resources.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">

            {/* SEARCH */}

            <div>
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

            {/* CATEGORY */}

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

            {/* BRANCH */}

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

          {/* ======================================
              RESOURCE LIST
          ====================================== */}

          {loadingResources ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                Loading resources...
              </p>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">
                No resources found.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {filteredResources.map(
                (resource) => (
                  <div
                    key={resource._id}
                    className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
                  >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                      <div className="min-w-0">

                        <h3 className="text-lg font-bold text-gray-800 break-words">
                          {resource.title}
                        </h3>

                        {resource.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {resource.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-3">

                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {resource.branch}
                          </span>

                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                            {resource.category}
                          </span>

                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                            {resource.semester}
                          </span>

                          {resource.subject && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                              {resource.subject}
                            </span>
                          )}

                        </div>

                        {resource.fileName && (
                          <p className="text-xs text-gray-500 mt-3 break-all">
                            File: {resource.fileName}
                          </p>
                        )}

                      </div>

                      <div className="flex flex-wrap gap-2">

                        {resource.fileUrl && (
                          <a
                            href={resource.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm"
                          >
                            Open
                          </a>
                        )}

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
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg font-semibold text-sm"
                        >
                          {deletingId ===
                          resource._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

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
