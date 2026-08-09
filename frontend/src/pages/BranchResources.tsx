import { Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

interface Branch {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  active: boolean;
}

const branches: Branch[] = [
  {
    id: "cse",
    name: "Computer Science Engineering",
    shortName: "CSE",
    icon: "💻",
    description:
      "Notes, PYQs, Syllabus, E-Books and AI Question Paper resources.",
    active: true,
  },
  {
    id: "electrical",
    name: "Electrical Engineering",
    shortName: "Electrical",
    icon: "⚡",
    description:
      "Electrical Engineering resources will be available soon.",
    active: false,
  },
  {
    id: "mechanical",
    name: "Mechanical Engineering",
    shortName: "Mechanical",
    icon: "🔧",
    description:
      "Mechanical Engineering resources will be available soon.",
    active: false,
  },
  {
    id: "civil",
    name: "Civil Engineering / CTM",
    shortName: "Civil / CTM",
    icon: "🏗️",
    description:
      "Civil Engineering and CTM share the same syllabus and resources.",
    active: false,
  },
  {
    id: "leather",
    name: "Leather Technology",
    shortName: "Leather",
    icon: "👞",
    description:
      "Leather Technology resources will be available soon.",
    active: false,
  },
  {
    id: "future",
    name: "More Branches",
    shortName: "Future",
    icon: "🚀",
    description:
      "More engineering branch resources will be added in future.",
    active: false,
  },
];

export default function BranchResources() {
  const [searchParams] = useSearchParams();

  const selectedBranch =
    searchParams.get("branch") || "cse";

  const branch =
    branches.find((item) => item.id === selectedBranch) ||
    branches[0];

  const isCSE = branch.id === "cse";

  return (
    <>
      <Navbar />

      {/* HERO */}

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">

          <div className="text-6xl mb-5">
            {branch.icon}
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold">
            {branch.name}
          </h1>

          <p className="mt-4 text-lg text-blue-100 max-w-3xl mx-auto">
            {branch.description}
          </p>

          {isCSE && (
            <div className="inline-block mt-6 bg-green-500/20 border border-green-300/40 px-5 py-2 rounded-full font-semibold">
              ✅ Resources Available
            </div>
          )}

        </div>
      </section>

      {/* BRANCH SELECTOR */}

      <section className="bg-blue-50 py-12">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-blue-700 text-center mb-8">
            🎓 Select Your Branch
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {branches.map((item) => (

              <Link
                key={item.id}
                to={`/branch-resources?branch=${item.id}`}
                className={`block rounded-2xl p-6 transition transform hover:-translate-y-1 ${
                  item.id === branch.id
                    ? "bg-blue-600 text-white shadow-2xl"
                    : "bg-white text-gray-800 shadow-lg hover:shadow-xl"
                }`}
              >

                <div className="flex items-center gap-4">

                  <div className="text-5xl">
                    {item.icon}
                  </div>

                  <div>

                    <h3 className="text-xl font-bold">
                      {item.shortName}
                    </h3>

                    <p
                      className={`text-sm mt-1 ${
                        item.id === branch.id
                          ? "text-blue-100"
                          : "text-gray-500"
                      }`}
                    >
                      {item.name}
                    </p>

                  </div>

                </div>

                <div className="mt-4">

                  {item.active ? (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        item.id === branch.id
                          ? "bg-white/20"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      🟢 Available
                    </span>
                  ) : (
                    <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                      🔜 Coming Soon
                    </span>
                  )}

                </div>

              </Link>

            ))}

          </div>

        </div>

      </section>

      {/* RESOURCE SECTION */}

      <section className="bg-white py-16">

        <div className="max-w-7xl mx-auto px-6">

          {isCSE ? (

            <>
              <div className="text-center mb-10">

                <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
                  📚 {branch.shortName} Resources
                </h2>

                <p className="text-gray-600 mt-3">
                  Select a resource category to continue.
                </p>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* NOTES */}

                <Link
                  to="/notes"
                  className="bg-blue-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition"
                >

                  <div className="text-6xl mb-5">
                    📄
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800">
                    Notes
                  </h3>

                  <p className="text-gray-600 mt-3">
                    Semester-wise CSE study notes.
                  </p>

                  <div className="mt-5 inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
                    Open Notes →
                  </div>

                </Link>

                {/* PYQ */}

                <Link
                  to="/pyq"
                  className="bg-orange-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition"
                >

                  <div className="text-6xl mb-5">
                    📝
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800">
                    PYQs
                  </h3>

                  <p className="text-gray-600 mt-3">
                    Previous year question papers.
                  </p>

                  <div className="mt-5 inline-block bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold">
                    Open PYQs →
                  </div>

                </Link>

                {/* SYLLABUS */}

                <Link
                  to="/syllabus"
                  className="bg-purple-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition"
                >

                  <div className="text-6xl mb-5">
                    📘
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800">
                    Syllabus
                  </h3>

                  <p className="text-gray-600 mt-3">
                    Semester-wise CSE syllabus.
                  </p>

                  <div className="mt-5 inline-block bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold">
                    Open Syllabus →
                  </div>

                </Link>

                {/* EBOOKS */}

                <Link
                  to="/ebooks"
                  className="bg-green-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition"
                >

                  <div className="text-6xl mb-5">
                    📖
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800">
                    E-Books
                  </h3>

                  <p className="text-gray-600 mt-3">
                    Useful CSE study books.
                  </p>

                  <div className="mt-5 inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-semibold">
                    Open E-Books →
                  </div>

                </Link>

              </div>

              {/* AI */}

              <div className="mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-8 text-center shadow-xl">

                <div className="text-5xl mb-4">
                  🤖
                </div>

                <h3 className="text-2xl font-bold">
                  AI Question Paper Generator
                </h3>

                <p className="mt-2 text-indigo-100">
                  Generate questions from your subject syllabus.
                </p>

                <Link
                  to="/ai-question-paper"
                  className="inline-block mt-5 bg-white text-indigo-700 px-7 py-3 rounded-xl font-bold hover:scale-105 transition"
                >
                  🚀 Generate Question Paper
                </Link>

              </div>
            </>

          ) : (

            /* COMING SOON */

            <div className="max-w-3xl mx-auto text-center bg-blue-50 rounded-3xl p-12 shadow-lg">

              <div className="text-7xl mb-6">
                🚧
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                {branch.name}
              </h2>

              <p className="text-gray-600 text-lg mt-4">
                Resources for this branch are currently being prepared.
              </p>

              <p className="text-gray-500 mt-2">
                Notes, PYQs, Syllabus, E-Books and other study
                materials will be added here in future.
              </p>

              <Link
                to="/"
                className="inline-block mt-7 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-xl font-semibold"
              >
                ← Back to Home
              </Link>

            </div>

          )}

        </div>

      </section>

      <Footer />
    </>
  );
}
