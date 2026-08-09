import { Link, useParams } from "react-router-dom";
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
    id: "civil-ctm",
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
  // ==========================================
  // GET BRANCH FROM URL
  // Example:
  // /branch/cse
  // /branch/mechanical
  // /branch/civil-ctm
  // ==========================================

  const { branchId } = useParams();

  const selectedBranch = branchId || "cse";

  const branch =
    branches.find((item) => item.id === selectedBranch) ||
    branches[0];

  const isCSE = branch.id === "cse";

  return (
    <>
      <Navbar />

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

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
            <div className="inline-block mt-6 bg-green-500/20 border border-green-300/40 px-6 py-2 rounded-full font-semibold">
              ✅ Resources Available
            </div>
          )}

          {!isCSE && (
            <div className="inline-block mt-6 bg-yellow-400/20 border border-yellow-200/40 px-6 py-2 rounded-full font-semibold">
              🔜 Coming Soon
            </div>
          )}

        </div>

      </section>


      {/* =====================================================
          BRANCH SELECTOR
      ===================================================== */}

      <section className="bg-blue-50 py-14">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-10">

            <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
              🎓 Select Your Branch
            </h2>

            <p className="text-gray-600 mt-3">
              Choose your engineering branch to access study resources.
            </p>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {branches.map((item) => (

              <Link
                key={item.id}
                to={`/branch/${item.id}`}
                className={`block rounded-2xl p-6 transition duration-300 transform hover:-translate-y-2 ${
                  item.id === branch.id
                    ? "bg-blue-600 text-white shadow-2xl"
                    : "bg-white text-gray-800 shadow-lg hover:shadow-2xl"
                }`}
              >

                <div className="flex items-center gap-4">

                  <div className="text-5xl">
                    {item.icon}
                  </div>

                  <div className="flex-1">

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


                <div className="mt-5">

                  {item.active ? (

                    <span
                      className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${
                        item.id === branch.id
                          ? "bg-white/20 text-white"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      🟢 Available
                    </span>

                  ) : (

                    <span className="inline-block bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-semibold">
                      🔜 Coming Soon
                    </span>

                  )}

                </div>

              </Link>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          RESOURCE SECTION
      ===================================================== */}

      <section className="bg-white py-16">

        <div className="max-w-7xl mx-auto px-6">

          {isCSE ? (

            <>
              {/* =================================================
                  CSE HEADER
              ================================================= */}

              <div className="text-center mb-12">

                <div className="text-5xl mb-4">
                  💻
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-blue-700">
                  CSE Study Resources
                </h2>

                <p className="text-gray-600 mt-3">
                  Access Computer Science Engineering study materials
                  semester-wise.
                </p>

              </div>


              {/* =================================================
                  RESOURCE CARDS
              ================================================= */}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


                {/* NOTES */}

                <Link
                  to="/notes"
                  className="group bg-blue-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
                >

                  <div className="text-6xl mb-5 group-hover:scale-110 transition">
                    📄
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800">
                    Notes
                  </h3>

                  <p className="text-gray-600 mt-3">
                    Semester-wise CSE study notes and learning materials.
                  </p>

                  <div className="mt-6 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold">
                    Open Notes →
                  </div>

                </Link>


                {/* PYQ */}

                <Link
                  to="/pyq"
                  className="group bg-orange-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
                >

                  <div className="text-6xl mb-5 group-hover:scale-110 transition">
                    📝
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800">
                    PYQs
                  </h3>

                  <p className="text-gray-600 mt-3">
                    Previous year question papers for CSE students.
                  </p>

                  <div className="mt-6 inline-block bg-orange-500 text-white px-6 py-2.5 rounded-lg font-semibold">
                    Open PYQs →
                  </div>

                </Link>


                {/* SYLLABUS */}

                <Link
                  to="/syllabus"
                  className="group bg-purple-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
                >

                  <div className="text-6xl mb-5 group-hover:scale-110 transition">
                    📘
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800">
                    Syllabus
                  </h3>

                  <p className="text-gray-600 mt-3">
                    Semester-wise CSE syllabus and course documents.
                  </p>

                  <div className="mt-6 inline-block bg-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold">
                    Open Syllabus →
                  </div>

                </Link>


                {/* EBOOKS */}

                <Link
                  to="/ebooks"
                  className="group bg-green-50 rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300"
                >

                  <div className="text-6xl mb-5 group-hover:scale-110 transition">
                    📖
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800">
                    E-Books
                  </h3>

                  <p className="text-gray-600 mt-3">
                    Useful CSE books and learning materials.
                  </p>

                  <div className="mt-6 inline-block bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold">
                    Open E-Books →
                  </div>

                </Link>

              </div>


              {/* =================================================
                  AI QUESTION PAPER
              ================================================= */}

              <div className="mt-10 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-3xl p-8 md:p-10 text-center shadow-2xl">

                <div className="text-6xl mb-5">
                  🤖
                </div>

                <h3 className="text-2xl md:text-3xl font-bold">
                  AI Question Paper Generator
                </h3>

                <p className="mt-3 text-indigo-100 max-w-2xl mx-auto">
                  Enter your subject and syllabus or units.
                  AI will generate a question paper based on
                  the provided syllabus.
                </p>

                <Link
                  to="/ai-question-paper"
                  className="inline-block mt-6 bg-white text-indigo-700 px-8 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition"
                >
                  🚀 Generate Question Paper
                </Link>

              </div>

            </>

          ) : (

            /* =================================================
               COMING SOON
            ================================================= */

            <div className="max-w-3xl mx-auto text-center bg-blue-50 rounded-3xl p-10 md:p-14 shadow-xl">

              <div className="text-7xl mb-6">
                🚧
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                {branch.name}
              </h2>

              <p className="text-gray-600 text-lg mt-5">
                Resources for this branch are currently being prepared.
              </p>

              <p className="text-gray-500 mt-3">
                Notes, PYQs, Syllabus, E-Books and other study
                materials will be added here in future.
              </p>


              <div className="mt-7 bg-white rounded-xl p-5 shadow">

                <p className="text-blue-700 font-semibold">
                  🚀 Planned Resources
                </p>

                <div className="flex flex-wrap justify-center gap-3 mt-4">

                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                    📄 Notes
                  </span>

                  <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-semibold">
                    📝 PYQs
                  </span>

                  <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                    📘 Syllabus
                  </span>

                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                    📖 E-Books
                  </span>

                  <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                    🤖 AI Papers
                  </span>

                </div>

              </div>


              <Link
                to="/branch/cse"
                className="inline-block mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition"
              >
                💻 Go to CSE Resources
              </Link>

            </div>

          )}

        </div>

      </section>


      <Footer />

    </>
  );
}
