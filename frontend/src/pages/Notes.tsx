import { useEffect, useState } from "react";
import api from "../services/api";

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  subject: string;
  semester: string;
  fileUrl: string;
  fileName: string;
  createdAt: string;
}

export default function Notes() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true);
        setError("");

        // Backend se sirf Notes category mangao
        const res = await api.get(
          "/api/resources/category/Notes"
        );

        console.log("NOTES API RESPONSE:", res.data);

        // Extra safety filter
        const notesOnly = (res.data.resources || []).filter(
          (resource: Resource) =>
            resource.category?.trim().toLowerCase() === "notes"
        );

        console.log("NOTES ONLY:", notesOnly);

        setResources(notesOnly);

      } catch (err: any) {
        console.error("Notes loading error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load notes"
        );

      } finally {
        setLoading(false);
      }
    };

    loadNotes();
  }, []);


  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">

        <div className="text-center">

          <div className="text-5xl mb-4">
            📚
          </div>

          <p className="text-xl font-semibold text-gray-700">
            Loading Notes...
          </p>

        </div>

      </div>
    );
  }


  // ==============================
  // PAGE
  // ==============================

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-blue-700 mb-2">
            📚 Student Notes
          </h1>

          <p className="text-gray-600">
            Semester-wise study notes and learning materials
          </p>

        </div>


        {/* ================= ERROR ================= */}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6">
            ❌ {error}
          </div>
        )}


        {/* ================= EMPTY ================= */}

        {resources.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <div className="text-6xl mb-4">
              📚
            </div>

            <p className="text-xl font-semibold text-gray-700">
              No Notes uploaded yet.
            </p>

            <p className="text-gray-500 mt-2">
              Notes uploaded by the admin will appear here.
            </p>

          </div>

        ) : (

          /* ================= CARDS ================= */

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {resources.map((resource) => (

              <div
                key={resource._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300"
              >

                {/* TITLE + CATEGORY */}

                <div className="flex justify-between items-start gap-3">

                  <h2 className="text-xl font-bold text-gray-800 break-words">
                    {resource.title}
                  </h2>

                  <span className="shrink-0 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    Notes
                  </span>

                </div>


                {/* SEMESTER */}

                {resource.semester && (
                  <p className="mt-4 text-sm font-semibold text-blue-600">
                    🎓 Semester: {resource.semester}
                  </p>
                )}


                {/* SUBJECT */}

                {resource.subject && (
                  <p className="mt-2 text-sm font-semibold text-gray-500">
                    📖 Subject: {resource.subject}
                  </p>
                )}


                {/* DESCRIPTION */}

                {resource.description && (
                  <p className="mt-3 text-gray-600">
                    {resource.description}
                  </p>
                )}


                {/* FILE NAME */}

                {resource.fileName && (
                  <p className="mt-4 text-sm text-gray-500 truncate">
                    📄 {resource.fileName}
                  </p>
                )}


                {/* BUTTONS */}

                <div className="flex gap-3 mt-6">

                  {/* VIEW */}

                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition"
                  >
                    👁️ View PDF
                  </a>


                  {/* DOWNLOAD */}

                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={resource.fileName || true}
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-lg transition"
                  >
                    ⬇️ Download
                  </a>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}