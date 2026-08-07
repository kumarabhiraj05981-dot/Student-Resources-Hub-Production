import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Notes() {
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/api/resources");

        const onlyNotes = res.data.filter(
          (item: any) => item.type === "notes"
        );

        setNotes(onlyNotes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchNotes();
  }, []);

  return (
    <>
      <Navbar />

      <section className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold">📄 Notes</h1>
          <p className="mt-4 text-xl">
            Download Semester-wise Notes
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {notes.map((note: any) => (
            <div
              key={note._id}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-blue-700">
                {note.title}
              </h2>

              <p className="mt-3">📚 {note.subject}</p>

              <p>🎓 Semester {note.semester}</p>

              <a
                href={note.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-5 bg-blue-600 text-white px-5 py-2 rounded"
              >
                View PDF
              </a>
            </div>
          ))}

        </div>
      </section>

      <Footer />
    </>
  );
}