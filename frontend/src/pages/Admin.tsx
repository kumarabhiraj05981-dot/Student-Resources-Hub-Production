import { useState } from "react";
import api from "../services/api";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [semester, setSemester] = useState("");
  const [category, setCategory] = useState("Notes");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter resource title");
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
      alert("Please select a file");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        return;
      }

      const formData = new FormData();

      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("semester", semester);
      formData.append("category", category);
      formData.append("subject", subject.trim());
      formData.append("file", file);

      console.log("UPLOAD DATA:", {
        title,
        description,
        semester,
        category,
        subject,
        file: file.name,
      });

      const res = await api.post("/api/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("UPLOAD RESPONSE:", res.data);

      if (res.data?.success) {
        alert("✅ Resource uploaded successfully!");

        setTitle("");
        setDescription("");
        setSemester("");
        setCategory("Notes");
        setSubject("");
        setFile(null);

        const fileInput = document.getElementById(
          "resource-file"
        ) as HTMLInputElement | null;

        if (fileInput) {
          fileInput.value = "";
        }
      } else {
        alert(res.data?.message || "Upload failed");
      }
    } catch (error: any) {
      console.error(
        "UPLOAD ERROR:",
        error.response?.data || error
      );

      const message =
        error.response?.data?.message ||
        error.message ||
        "File upload failed";

      alert(`❌ ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">

          <h1 className="text-3xl font-bold text-blue-700 mb-2">
            📚 Admin Resource Upload
          </h1>

          <p className="text-gray-600 mb-8">
            Upload Notes, PYQs, Syllabus and E-books.
          </p>

          <form
            onSubmit={handleUpload}
            className="space-y-5"
          >

            {/* Title */}
            <div>
              <label className="block font-semibold mb-2">
                Resource Title
              </label>

              <input
                type="text"
                placeholder="Example: DBMS Unit 1 Notes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>


            {/* Description */}
            <div>
              <label className="block font-semibold mb-2">
                Description
              </label>

              <textarea
                placeholder="Enter resource description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>


            {/* Semester */}
            <div>
              <label className="block font-semibold mb-2">
                Semester
              </label>

              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
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


            {/* Subject */}
            <div>
              <label className="block font-semibold mb-2">
                Subject
              </label>

              <input
                type="text"
                placeholder="Example: DBMS"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>


            {/* Category */}
            <div>
              <label className="block font-semibold mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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


            {/* File */}
            <div>
              <label className="block font-semibold mb-2">
                Select File
              </label>

              <input
                id="resource-file"
                type="file"
                accept=".pdf"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
                className="w-full border border-gray-300 rounded-lg p-3"
                required
              />

              {file && (
                <p className="text-sm text-gray-600 mt-2">
                  📄 Selected: {file.name}
                </p>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Maximum file size: 20MB. PDF only.
              </p>
            </div>


            {/* Upload Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-bold text-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading
                ? "⏳ Uploading..."
                : "🚀 Upload Resource"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}