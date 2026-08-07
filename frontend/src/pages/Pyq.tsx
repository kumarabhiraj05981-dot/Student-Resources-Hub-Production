import { useEffect, useState } from "react";
import api from "../services/api";

interface Resource {
  _id: string;
  title: string;
  description: string;
  category: string;
  semester: string;
  subject: string;
  fileUrl: string;
  fileName: string;
  createdAt: string;
}

export default function PYQ() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPYQ = async () => {
      try {
        setLoading(true);
        setError("");

        // Only PYQ resources
        const res = await api.get(
          "/api/resources/category/PYQ"
        );

        console.log("PYQ API RESPONSE:", res.data);

        // Extra safety:
        // Only show resources whose category is actually PYQ
        const pyqOnly = (res.data.resources || []).filter(
          (item: Resource) =>
            item.category?.trim().toLowerCase() === "pyq"
        );

        console.log("PYQ FILTERED:", pyqOnly);

        setResources(pyqOnly);

      } catch (err: any) {
        console.error("PYQ loading error:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load PYQs"
        );

      } finally {
        setLoading(false);
      }
    };

    loadPYQ();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">

          <div className="text-5xl mb-4">
            📝
          </div>

          <p className="text-xl font-semibold text-gray-700">
            Loading PYQs...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            📝 Previous Year Questions
          </h1>

          <p className="text-gray-600">
            Semester-wise previous year question papers
          </p>

        </div>


        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6">
            ❌ {error}
          </div>
        )}


        {/* Empty */}
        {resources.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <div className="text-6xl mb-4">
              📂
            </div>

            <p className="text-xl font-semibold text-gray-700">
              No PYQs uploaded yet.
            </p>

            <p className="text-gray-500 mt-2">
              Previous year question papers will appear here
              after the admin uploads them.
            </p>

          </div>

        ) : (

          /* Resources */
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {resources.map((resource) => (

              <div
                key={resource._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition duration-300"
              >

                {/* Title + Category */}
                <div className="flex justify-between items-start gap-3">

                  <h2 className="text-xl font-bold text-gray-800 break-words">
                    {resource.title}
                  </h2>

                  <span className="shrink-0 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                    PYQ
                  </span>

                </div>


                {/* Semester */}
                {resource.semester && (
                  <p className="mt-4 text-sm font-semibold text-blue-600">
                    🎓 Semester: {resource.semester}
                  </p>
                )}


                {/* Subject */}
                {resource.subject && (
                  <p className="mt-2 text-sm font-semibold text-gray-500">
                    📚 Subject: {resource.subject}
                  </p>
                )}


                {/* Description */}
                {resource.description && (
                  <p className="mt-3 text-gray-600 line-clamp-3">
                    {resource.description}
                  </p>
                )}


                {/* File Name */}
                {resource.fileName && (
                  <p className="mt-4 text-sm text-gray-500 truncate">
                    📄 {resource.fileName}
                  </p>
                )}


                {/* Buttons */}
                <div className="flex gap-3 mt-6">

                  {/* Open */}
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition"
                  >
                    👁️ Open
                  </a>


                  {/* Download */}
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