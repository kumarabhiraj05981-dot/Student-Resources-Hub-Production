
import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Admin() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("notes");
  const [semester, setSemester] = useState(1);
  const [subject, setSubject] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");


  const [resources, setResources] = useState<any[]>([]);

  const fetchResources = async () => {
    try {
      const res = await api.get("/api/resources");
      setResources(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/api/resources", {
        title,
        type,
        semester,
        subject,
        pdfUrl,
      });

      alert("✅ Resource Added Successfully");

      setTitle("");
      setType("notes");
      setSemester(1);
      setSubject("");
      setPdfUrl("");

      fetchResources();
    } catch (err) {
      alert("❌ Failed to Add Resource");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this resource?")) return;

    try {
      await api.delete(`/api/resources/${id}`);

      alert("✅ Resource Deleted");

      fetchResources();
    } catch (err) {
      alert("❌ Delete Failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-2xl mx-auto py-10 px-6">
        <h1 className="text-4xl font-bold text-blue-700 mb-8">
          Admin Panel
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            className="w-full border p-3 rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <select
            className="w-full border p-3 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="notes">Notes</option>
            <option value="pyq">PYQ</option>
            <option value="syllabus">Syllabus</option>
            <option value="ebooks">E-books</option>
          </select>

          <input
            className="w-full border p-3 rounded"
            type="number"
            placeholder="Semester"
            value={semester}
            onChange={(e) => setSemester(Number(e.target.value))}
            required
          />

          <input
            className="w-full border p-3 rounded"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <input
            className="w-full border p-3 rounded"
            placeholder="PDF URL"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
          >
            ➕ Add Resource
          </button>

        </form>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-10">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          All Resources
        </h2>

        {resources.length === 0 ? (
          <p className="text-gray-500">No Resources Found</p>
        ) : (
          <div className="grid gap-4">
            {resources.map((item: any) => (
              <div
                key={item._id}
                className="bg-white shadow-lg rounded-xl p-5 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-bold">
                    {item.title}
                  </h3>

                  <p className="text-gray-600">
                    📚 {item.subject}
                  </p>

                  <p className="text-gray-600">
                    🎓 Semester {item.semester}
                  </p>

                  <p className="text-blue-600 font-semibold">
                    {item.type.toUpperCase()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <a
                    href={item.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    View
                  </a>

                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}