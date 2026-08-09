import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ==============================
          HERO SECTION
      ============================== */}

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">

          <div className="text-6xl mb-6">
            📚
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Student Resources Hub
          </h1>

          <p className="text-xl md:text-2xl mb-5 font-semibold">
            One Platform for All Your Study Resources
          </p>

          <p className="text-base md:text-lg text-blue-100 max-w-3xl mx-auto">
            Access Notes, Previous Year Questions, Syllabus and
            E-books semester-wise — anytime, anywhere.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">

            <Link to="/notes">
              <button className="w-full sm:w-auto bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:scale-105 transition">
                🚀 Explore Resources
              </button>
            </Link>

            <Link to="/pyq">
              <button className="w-full sm:w-auto bg-blue-800/50 border border-white/40 px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-800 transition">
                📝 View PYQs
              </button>
            </Link>

          </div>

        </div>
      </section>


      {/* ==============================
          RESOURCE CATEGORIES
      ============================== */}

      <section className="bg-blue-50 py-20">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">

            <h2 className="text-4xl font-bold text-blue-700">
              📚 Study Resources
            </h2>

            <p className="text-gray-600 mt-3">
              Everything you need for your semester preparation.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">


            {/* NOTES */}

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:-translate-y-2 hover:shadow-2xl transition">

              <div className="text-6xl mb-5">
                📄
              </div>

              <h3 className="text-2xl font-bold text-gray-800">
                Notes
              </h3>

              <p className="text-gray-600 mt-3">
                Semester-wise notes for better understanding
                and exam preparation.
              </p>

              <Link to="/notes">
                <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold">
                  View Notes
                </button>
              </Link>

            </div>


            {/* PYQ */}

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:-translate-y-2 hover:shadow-2xl transition">

              <div className="text-6xl mb-5">
                📝
              </div>

              <h3 className="text-2xl font-bold text-gray-800">
                PYQs
              </h3>

              <p className="text-gray-600 mt-3">
                Previous year question papers to practice
                before examinations.
              </p>

              <Link to="/pyq">
                <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg font-semibold">
                  View PYQs
                </button>
              </Link>

            </div>


            {/* SYLLABUS */}

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:-translate-y-2 hover:shadow-2xl transition">

              <div className="text-6xl mb-5">
                📘
              </div>

              <h3 className="text-2xl font-bold text-gray-800">
                Syllabus
              </h3>

              <p className="text-gray-600 mt-3">
                Semester-wise syllabus and course documents
                in one place.
              </p>

              <Link to="/syllabus">
                <button className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-semibold">
                  View Syllabus
                </button>
              </Link>

            </div>


            {/* EBOOKS */}

            <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:-translate-y-2 hover:shadow-2xl transition">

              <div className="text-6xl mb-5">
                📖
              </div>

              <h3 className="text-2xl font-bold text-gray-800">
                E-Books
              </h3>

              <p className="text-gray-600 mt-3">
                Free study books and useful learning
                materials.
              </p>

              <Link to="/ebooks">
                <button className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold">
                  View E-Books
                </button>
              </Link>

            </div>

          </div>

        </div>

      </section>


      {/* ==============================
          WHY CHOOSE US
      ============================== */}

      <section className="py-20 bg-white">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">

            <h2 className="text-4xl font-bold text-blue-700">
              ⭐ Why Choose Student Resources Hub?
            </h2>

            <p className="text-gray-600 mt-3">
              Simple, fast and student-friendly learning platform.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="text-center p-6">
              <div className="text-5xl mb-4">
                ⚡
              </div>

              <h3 className="text-xl font-bold">
                Fast Access
              </h3>

              <p className="text-gray-600 mt-3">
                Quickly find the study material you need.
              </p>
            </div>


            <div className="text-center p-6">
              <div className="text-5xl mb-4">
                📱
              </div>

              <h3 className="text-xl font-bold">
                Mobile Friendly
              </h3>

              <p className="text-gray-600 mt-3">
                Use the platform easily from your phone,
                tablet or laptop.
              </p>
            </div>


            <div className="text-center p-6">
              <div className="text-5xl mb-4">
                🎓
              </div>

              <h3 className="text-xl font-bold">
                Semester Wise
              </h3>

              <p className="text-gray-600 mt-3">
                Resources are organized according to semester.
              </p>
            </div>


            <div className="text-center p-6">
              <div className="text-5xl mb-4">
                📥
              </div>

              <h3 className="text-xl font-bold">
                Easy Download
              </h3>

              <p className="text-gray-600 mt-3">
                Open and download available PDF resources easily.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* ==============================
          PLATFORM STATISTICS
      ============================== */}

      <section className="bg-blue-50 py-20">

        <div className="max-w-7xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center text-blue-700 mb-12">
            📊 Platform
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-4xl md:text-5xl font-bold text-blue-600">
                20+
              </h3>
              <p className="mt-3 text-lg font-semibold">
                Notes
              </p>
            </div>


            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-4xl md:text-5xl font-bold text-orange-500">
                26+
              </h3>
              <p className="mt-3 text-lg font-semibold">
                PYQs
              </p>
            </div>


            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-4xl md:text-5xl font-bold text-green-600">
                11+
              </h3>
              <p className="mt-3 text-lg font-semibold">
                E-Books
              </p>
            </div>


            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <h3 className="text-4xl md:text-5xl font-bold text-purple-600">
                6
              </h3>
              <p className="mt-3 text-lg font-semibold">
                Semesters
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* ==============================
          LATEST RESOURCES
      ============================== */}

      <section className="py-20 bg-white">

        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">

            <h2 className="text-4xl font-bold text-blue-700">
              🔥 Explore Resources
            </h2>

            <p className="text-gray-600 mt-3">
              Start learning with the resources available on the platform.
            </p>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">


            <Link to="/notes">
              <div className="bg-blue-50 rounded-2xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">

                <div className="text-5xl mb-4">
                  📄
                </div>

                <h3 className="text-xl font-bold">
                  Student Notes
                </h3>

                <p className="text-gray-600 mt-2">
                  Read your semester notes.
                </p>

              </div>
            </Link>


            <Link to="/pyq">
              <div className="bg-orange-50 rounded-2xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">

                <div className="text-5xl mb-4">
                  📝
                </div>

                <h3 className="text-xl font-bold">
                  Previous Papers
                </h3>

                <p className="text-gray-600 mt-2">
                  Practice previous year questions.
                </p>

              </div>
            </Link>


            <Link to="/syllabus">
              <div className="bg-purple-50 rounded-2xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">

                <div className="text-5xl mb-4">
                  📘
                </div>

                <h3 className="text-xl font-bold">
                  Syllabus
                </h3>

                <p className="text-gray-600 mt-2">
                  Check your semester syllabus.
                </p>

              </div>
            </Link>


            <Link to="/ebooks">
              <div className="bg-green-50 rounded-2xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition cursor-pointer">

                <div className="text-5xl mb-4">
                  📖
                </div>

                <h3 className="text-xl font-bold">
                  E-Books
                </h3>

                <p className="text-gray-600 mt-2">
                  Explore useful study books.
                </p>

              </div>
            </Link>

          </div>

        </div>

      </section>


      {/* ==============================
          CTA
      ============================== */}

      <section className="bg-gradient-to-r from-blue-700 to-cyan-500 py-20 text-white">

        <div className="max-w-6xl mx-auto text-center px-6">

          <div className="text-5xl mb-5">
            🎓
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Learning?
          </h2>

          <p className="text-lg md:text-xl mb-8 text-blue-50">
            Access Notes, PYQs, Syllabus and E-books
            completely from one platform.
          </p>

          <Link to="/notes">
            <button className="bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:scale-105 transition">
              🚀 Start Learning
            </button>
          </Link>

        </div>

      </section>


      <Footer />
    </>
  );
}
