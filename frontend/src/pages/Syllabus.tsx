import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Syllabus() {
  const [syllabus, setSyllabus] = useState<any[]>([]);

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        const res = await api.get("/api/resources");

        const onlySyllabus = res.data.filter(
          (item: any) => item.type === "syllabus"
        );

        setSyllabus(onlySyllabus);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSyllabus();
  }, []);

  return (
    <>
      <Navbar />

      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold">📚 Syllabus</h1>
          <p className="mt-4 text-xl">
            Download Semester-wise Syllabus
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {syllabus.length > 0 ? (
            syllabus.map((item: any) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
              >
                <h2 className="text-2xl font-bold text-blue-700">
                  {item.title}
                </h2>

                <p className="mt-3 text-gray-600">
                  📚 {item.subject}
                </p>

                <p className="text-gray-600">
                  🎓 Semester {item.semester}
                </p>

                <a
                  href={item.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                    📄 View Syllabus
                  </button>
                </a>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-xl text-gray-500">
              No Syllabus Available
            </div>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}