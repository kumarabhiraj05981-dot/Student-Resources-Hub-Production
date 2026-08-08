import { useEffect, useState } from "react";
import api from "../services/api";

interface Resource {
  _id: string;
  title: string;
  description?: string;
  category: string;
  semester?: string;
  subject?: string;
  fileUrl: string;
  fileName?: string;
  createdAt?: string;
}

export default function PYQ() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPYQ();
  }, []);

  const loadPYQ = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/api/resources/category/PYQ"
      );

      console.log("PYQ API RESPONSE:", response.data);

      const data = response.data;

      if (!data?.success) {
        throw new Error(
          data?.message || "Unable to load PYQs"
        );
      }

      const apiResources = Array.isArray(data.resources)
        ? data.resources
        : [];

      /*
       * Extra safety:
       * Sirf PYQ category ke resources show honge.
       */
      const pyqResources = apiResources.filter(
        (resource: Resource) =>
          String(resource.category || "")
            .trim()
            .toLowerCase() === "pyq"
      );

      console.log(
        "PYQ RESOURCES:",
        pyqResources
      );

      setResources(pyqResources);

    } catch (error: any) {
      console.error(
        "PYQ loading error:",
        error.response?.data || error
      );

      setResources([]);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to load PYQs"
      );

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">

        <div className="text-center">

          <div className="text-6xl mb-4">
            📝
          </div>

          <p className="text-xl font-semibold text-gray-700">
            Loading PYQs...
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Please wait
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            📝 Previous Year Questions
          </h1>

          <p className="text-gray-600">
            Semester-wise previous year question papers
          </p>

          {resources.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              📚 {resources.length} PYQ
              {resources.length !== 1 ? "s" : ""} available
            </p>
          )}

        </div>

        {/* ======================================
            ERROR
        ====================================== */}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6">

            <p className="font-semibold">
              ❌ {error}
            </p>

            <button
              onClick={loadPYQ}
              className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              🔄 Try Again
            </button>

          </div>
        )}

        {/* ======================================
            NO PYQ
        ====================================== */}

        {!error && resources.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <div className="text-6xl mb-4">
              📂
            </div>

            <p className="text-xl font-semibold text-gray-700">
              No PYQs uploaded yet.
            </p>

            <p className="text-gray-500 mt-2">
              Previous year question papers uploaded
              by the admin will appear here.
            </p>

          </div>
        )}

        {/* ======================================
            PYQ CARDS
        ====================================== */}

        {resources.length > 0 && (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {resources.map((resource) => (

              <div
                key={resource._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col"
              >

                {/* TITLE + CATEGORY */}

                <div className="flex justify-between items-start gap-3">

                  <h2 className="text-xl font-bold text-gray-800 break-words">
                    {resource.title}
                  </h2>

                  <span className="shrink-0 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                    PYQ
                  </span>

                </div>

                {/* SEMESTER */}

                {resource.semester && (
                  <div className="mt-4">

                    <p className="text-sm font-semibold text-blue-600">
                      🎓 Semester
                    </p>

                    <p className="text-gray-700 mt-1">
                      {resource.semester}
                    </p>

                  </div>
                )}

                {/* SUBJECT */}

                {resource.subject && (
                  <div className="mt-3">

                    <p className="text-sm font-semibold text-gray-500">
                      📚 Subject
                    </p>

                    <p className="text-gray-700 mt-1">
                      {resource.subject}
                    </p>

                  </div>
                )}

                {/* DESCRIPTION */}

                {resource.description && (
                  <p className="mt-3 text-gray-600 line-clamp-3">
                    {resource.description}
                  </p>
                )}

                {/* FILE */}

                {resource.fileName && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-3">

                    <p className="text-xs text-gray-500 mb-1">
                      PDF FILE
                    </p>

                    <p
                      className="text-sm text-gray-700 truncate"
                      title={resource.fileName}
                    >
                      📄 {resource.fileName}
                    </p>

                  </div>
                )}

                {/* BUTTONS */}

                <div className="flex gap-3 mt-6">

                  {/* OPEN */}

                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 px-3 rounded-lg transition"
                  >
                    👁️ Open
                  </a>

                  {/* DOWNLOAD */}

                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={resource.fileName || undefined}
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-2.5 px-3 rounded-lg transition"
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