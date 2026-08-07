import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

import Footer from "../components/layout/Footer";


export default function Home() {
  return (
    <>
      <Navbar />

      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 text-white py-24">
  <div className="max-w-7xl mx-auto px-6 text-center">

    <h1 className="text-6xl font-extrabold mb-6">
      📚 Student Resources Hub
    </h1>

    <p className="text-2xl mb-4">
      One Platform for Notes, PYQ, Syllabus & E-books
    </p>

    <p className="text-lg text-blue-100 max-w-3xl mx-auto">
      Access all your semester study materials anytime, anywhere.
      Free, fast and easy to use for every student.
    </p>

    <Link to="/notes">
  <button className="mt-10 bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:scale-105 transition">
    🚀 Explore Resources
  </button>
</Link>

  </div>
</section>

      <section className="bg-blue-50 py-20">
  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-4xl font-bold text-center text-blue-700 mb-12">
      Why Choose Student Resources Hub?
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <div className="text-5xl mb-4">📄</div>
        <h3 className="text-xl font-bold">Quality Notes</h3>
        <p className="text-gray-600 mt-3">
          Well-organized semester-wise study notes.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <div className="text-5xl mb-4">📝</div>
        <h3 className="text-xl font-bold">Latest PYQs</h3>
        <p className="text-gray-600 mt-3">
          Previous year question papers in one place.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <div className="text-5xl mb-4">📚</div>
        <h3 className="text-xl font-bold">Updated Syllabus</h3>
        <p className="text-gray-600 mt-3">
          Latest syllabus for every semester.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
        <div className="text-5xl mb-4">📖</div>
        <h3 className="text-xl font-bold">Free E-books</h3>
        <p className="text-gray-600 mt-3">
          Download free study books anytime.
        </p>
      </div>

    </div>

  </div>
</section>
<section className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-4xl font-bold text-center mb-12 text-blue-700">
      Platform Statistics
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

      <div className="text-center">
        <h3 className="text-5xl font-bold text-blue-600">30+</h3>
        <p className="mt-3 text-lg">Notes</p>
      </div>

      <div className="text-center">
        <h3 className="text-5xl font-bold text-blue-600">30+</h3>
        <p className="mt-3 text-lg">PYQs</p>
      </div>

      <div className="text-center">
        <h3 className="text-5xl font-bold text-blue-600">25+</h3>
        <p className="mt-3 text-lg">E-books</p>
      </div>

      <div className="text-center">
        <h3 className="text-5xl font-bold text-blue-600">6</h3>
        <p className="mt-3 text-lg">Semesters</p>
      </div>

    </div>

  </div>
</section>
<section className="bg-gradient-to-r from-blue-700 to-cyan-500 py-20 text-white">
  <div className="max-w-6xl mx-auto text-center px-6">

    <h2 className="text-5xl font-bold mb-6">
      Ready to Start Learning?
    </h2>

    <p className="text-xl mb-8">
      Download Notes, PYQs, Syllabus and E-books absolutely free.
    </p>

    <button className="bg-white text-blue-700 px-8 py-4 rounded-xl text-lg font-bold hover:scale-105 transition">
      📚 Explore Resources
    </button>

  </div>
</section>
<section className="py-20 bg-gray-100">
  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-4xl font-bold text-center text-blue-700 mb-12">
      📚 Latest Resources
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
        <h3 className="text-2xl font-bold">📄 Java Notes</h3>
        <p className="text-gray-600 mt-2">
          Semester 3 • PDF Notes
        </p>

        <button className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
          View PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
        <h3 className="text-2xl font-bold">📝 DBMS PYQ</h3>
        <p className="text-gray-600 mt-2">
          Previous Year Questions
        </p>

        <button className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
          View PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition">
        <h3 className="text-2xl font-bold">📖 Operating System E-book</h3>
        <p className="text-gray-600 mt-2">
          Free PDF Book
        </p>

        <button className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
          View PDF
        </button>
      </div>

    </div>

  </div>
</section>
<Footer />

    </>
    
  );
}