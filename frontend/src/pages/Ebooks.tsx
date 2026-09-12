import { useEffect, useState } from "react";
import api from "../services/api";

interface Resource {
  _id: string;
  title: string;
  description?: string;
  category: string;
  semester: string;
  subject?: string;
  fileUrl: string;
  fileName?: string;
  createdAt: string;
}

export default function Ebooks() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEbooks = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(
          "/api/resources/category/Ebooks"
        );

        console.log("E-BOOKS API RESPONSE:", res.data);

        // ==============================
        // SAFETY CHECK
        // ==============================

        const allResources = Array.isArray(
          res.data?.resources
        )
          ? res.data.resources
          : [];

        // ==============================
        // ONLY E-BOOKS
        // ==============================

        const ebooksOnly = allResources.filter(
          (item: Resource) => {
            const category =
              item.category?.trim().toLowerCase();

            return (
              category === "ebooks" ||
              category === "e-books" ||
              category === "e-book"
            );
          }
        );

        console.log("E-BOOKS FILTERED:", ebooksOnly);

        setResources(ebooksOnly);

      } catch (err: any) {
        console.error(
          "E-books loading error:",
          err.response?.data || err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load e-books. Please try again."
        );

      } finally {
        setLoading(false);
      }
    };

    loadEbooks();
  }, []);

  // ==============================
  // LOADING
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center px-4">

        <div className="text-center">

          <div className="text-6xl mb-4">
            
          </div>

          <p className="text-xl font-semibold text-gray-700">
            Loading E-Books...
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Please wait
          </p>

        </div>

      </div>
    );
  }

  // ==============================
  // MAIN PAGE
  // ==============================

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-4">

      <div className="max-w-7xl mx-auto">

        {/* ==============================
            HEADER
        ============================== */}

        <div className="mb-8">

          <h1 className="text-4xl font-bold text-green-700 mb-2">
             Student E-Books
          </h1>

          <p className="text-gray-600">
            Semester-wise books and study materials
          </p>

          {resources.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
               {resources.length} E-Book
              {resources.length !== 1 ? "s" : ""} available
            </p>
          )}

        </div>


        {/* ==============================
            ERROR
        ============================== */}

        {error && (
          <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded-xl mb-6">

            <p className="font-semibold">
               {error}
            </p>

          </div>
        )}


        {/* ==============================
            NO E-BOOKS
        ============================== */}

        {resources.length === 0 ? (

          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

            <div className="text-6xl mb-4">
              
            </div>

            <p className="text-xl font-semibold text-gray-700">
              No E-Books uploaded yet.
            </p>

            <p className="text-gray-500 mt-2">
              E-Books uploaded by the admin will
              appear here.
            </p>

          </div>

        ) : (

          /* ==============================
             E-BOOK CARDS
          ============================== */

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {resources.map((resource) => (

              <div
                key={resource._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition duration-300"
              >

                {/* ==============================
                    TITLE + CATEGORY
                ============================== */}

                <div className="flex justify-between items-start gap-3">

                  <h2 className="text-xl font-bold text-gray-800 break-words">
                    {resource.title}
                  </h2>

                  <span className="shrink-0 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    E-Book
                  </span>

                </div>


                {/* ==============================
                    SEMESTER
                ============================== */}

                {resource.semester && (
                  <div className="mt-4">

                    <p className="text-sm font-semibold text-blue-600">
                       Semester
                    </p>

                    <p className="text-gray-700 mt-1">
                      {resource.semester}
                    </p>

                  </div>
                )}


                {/* ==============================
                    SUBJECT
                ============================== */}

                {resource.subject && (
                  <div className="mt-3">

                    <p className="text-sm font-semibold text-gray-500">
                       Subject
                    </p>

                    <p className="text-gray-700 mt-1">
                      {resource.subject}
                    </p>

                  </div>
                )}


                {/* ==============================
                    DESCRIPTION
                ============================== */}

                {resource.description && (
                  <div className="mt-3">

                    <p className="text-gray-600 line-clamp-3">
                      {resource.description}
                    </p>

                  </div>
                )}


                {/* ==============================
                    FILE NAME
                ============================== */}

                {resource.fileName && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-3">

                    <p
                      className="text-sm text-gray-600 truncate"
                      title={resource.fileName}
                    >
                       {resource.fileName}
                    </p>

                  </div>
                )}


                {/* ==============================
                    BUTTONS
                ============================== */}

                <div className="flex gap-3 mt-6">

                  {/* OPEN */}

                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-lg transition"
                  >
                     Open
                  </a>


                  {/* DOWNLOAD */}

                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={resource.fileName || true}
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold py-2.5 px-4 rounded-lg transition"
                  >
                     Download
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
