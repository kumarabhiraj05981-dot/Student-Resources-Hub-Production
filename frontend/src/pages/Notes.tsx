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

    const loadResources = async () => {

      try {

        const res = await api.get("/api/resources");

        console.log("Resources:", res.data);

        setResources(res.data.resources || []);


      } catch (err:any) {

        console.error("Resource loading error:", err);

        setError(
          err.response?.data?.message ||
          "Unable to load resources"
        );


      } finally {

        setLoading(false);

      }

    };


    loadResources();

  }, []);



  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <p className="text-xl font-semibold">
          Loading resources...
        </p>

      </div>

    );

  }



  return (

    <div className="min-h-screen bg-blue-50 py-10 px-4">

      <div className="max-w-7xl mx-auto">


        <h1 className="text-4xl font-bold text-blue-700 mb-2">
          📚 Student Notes
        </h1>


        <p className="text-gray-600 mb-8">
          Semester wise Notes, PYQ, Syllabus and E-books
        </p>



        {error && (

          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">

            {error}

          </div>

        )}




        {resources.length === 0 ? (

          <div className="bg-white rounded-xl shadow p-8 text-center">

            <p className="text-xl text-gray-600">
              No resources uploaded yet.
            </p>

          </div>


        ) : (


          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">


            {resources.map((resource)=>(


              <div
                key={resource._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
              >



                <div className="flex justify-between gap-3">


                  <h2 className="text-xl font-bold text-gray-800">

                    {resource.title}

                  </h2>



                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

                    {resource.category}

                  </span>


                </div>




                {resource.semester && (

                  <p className="mt-3 text-sm font-semibold text-gray-600">

                    Semester: {resource.semester}

                  </p>

                )}




                {resource.subject && (

                  <p className="mt-2 text-sm font-semibold text-gray-500">

                    Subject: {resource.subject}

                  </p>

                )}





                {resource.description && (

                  <p className="mt-3 text-gray-600">

                    {resource.description}

                  </p>

                )}




                {resource.fileName && (

                  <p className="mt-4 text-sm text-gray-500 truncate">

                    📄 {resource.fileName}

                  </p>

                )}






                <div className="flex gap-3 mt-6">


                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
                  >

                    👁️ View PDF

                  </a>





                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
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