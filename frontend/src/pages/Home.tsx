import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* =========================================
          HERO SECTION
      ========================================= */}

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-600 to-cyan-500 text-white">

        {/* Decorative shapes */}
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-cyan-300/10" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-6 py-20 md:py-28">

          <div className="max-w-4xl mx-auto text-center">

            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold backdrop-blur mb-7">
              <span>🎓</span>
              <span>Study Smarter • Learn Better</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
              Student Resources
              <span className="block text-cyan-200">
                Hub
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl md:text-2xl font-semibold text-blue-50">
              Everything you need for your college preparation.
            </p>

            <p className="max-w-2xl mx-auto mt-5 text-sm sm:text-base md:text-lg leading-7 text-blue-100">
              Access Notes, Previous Year Questions, Syllabus,
              E-Books and AI-powered question papers from one
              simple platform.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-9">

              <Link
                to="/notes"
                className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                📚 Explore Resources
              </Link>

              <Link
                to="/ai-question-paper"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20 hover:-translate-y-1"
              >
                🤖 Generate AI Paper
              </Link>

            </div>

          </div>

        </div>
      </section>


      {/* =========================================
          QUICK ACCESS
      ========================================= */}

      <section className="bg-slate-50 py-14">

        <div className="max-w-7xl mx-auto px-5 sm:px-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">

            <Link
              to="/notes"
              className="group rounded-2xl border border-blue-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-2xl group-hover:bg-blue-600 transition">
                📄
              </div>

              <h3 className="font-bold text-gray-900">
                Notes
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Semester notes
              </p>
            </Link>


            <Link
              to="/pyq"
              className="group rounded-2xl border border-orange-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-2xl group-hover:bg-orange-500 transition">
                📝
              </div>

              <h3 className="font-bold text-gray-900">
                PYQ
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Previous papers
              </p>
            </Link>


            <Link
              to="/syllabus"
              className="group rounded-2xl border border-purple-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-2xl group-hover:bg-purple-600 transition">
                📘
              </div>

              <h3 className="font-bold text-gray-900">
                Syllabus
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Course syllabus
              </p>
            </Link>


            <Link
              to="/ebooks"
              className="group rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-2xl group-hover:bg-emerald-600 transition">
                📖
              </div>

              <h3 className="font-bold text-gray-900">
                E-Books
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Useful study books
              </p>
            </Link>

          </div>

        </div>

      </section>


      {/* =========================================
          CHOOSE YOUR BRANCH
      ========================================= */}

      <section className="bg-white py-20">

        <div className="max-w-7xl mx-auto px-5 sm:px-6">

          <div className="max-w-2xl mx-auto text-center mb-12">

            <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
              🎓 College Branches
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
              Choose Your Branch
            </h2>

            <p className="mt-4 text-gray-600 leading-7">
              Find study materials according to your branch,
              semester and subjects.
            </p>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">


            {/* CSE */}

            <Link to="/branch/cse" className="group">

              <div className="h-full rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-xl">

                <div className="flex items-center justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-600 text-3xl shadow-md">
                    💻
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                    CSE
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-extrabold text-gray-900">
                  Computer Science
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Programming, DBMS, Data Structures,
                  Networks, Operating Systems and more.
                </p>

                <div className="mt-6 font-bold text-blue-700 group-hover:text-blue-800">
                  Explore CSE →
                </div>

              </div>

            </Link>


            {/* ELECTRICAL */}

            <Link to="/branch/electrical" className="group">

              <div className="h-full rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-amber-300 hover:shadow-xl">

                <div className="flex items-center justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-amber-500 text-3xl shadow-md">
                    ⚡
                  </div>

                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    Electrical
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-extrabold text-gray-900">
                  Electrical Engineering
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Electrical circuits, machines, power systems
                  and engineering resources.
                </p>

                <div className="mt-6 font-bold text-amber-600 group-hover:text-amber-700">
                  Explore Electrical →
                </div>

              </div>

            </Link>


            {/* MECHANICAL */}

            <Link to="/branch/mechanical" className="group">

              <div className="h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-gray-100 p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl">

                <div className="flex items-center justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-700 text-3xl shadow-md">
                    🔧
                  </div>

                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                    Mechanical
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-extrabold text-gray-900">
                  Mechanical Engineering
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Manufacturing, thermodynamics, mechanics
                  and mechanical engineering resources.
                </p>

                <div className="mt-6 font-bold text-slate-700 group-hover:text-slate-900">
                  Explore Mechanical →
                </div>

              </div>

            </Link>


            {/* CIVIL */}

            <Link to="/branch/civil-ctm" className="group">

              <div className="h-full rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl">

                <div className="flex items-center justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-600 text-3xl shadow-md">
                    🏗️
                  </div>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    Civil / CTM
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-extrabold text-gray-900">
                  Civil Engineering / CTM
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Civil and CTM resources organized in
                  one common study section.
                </p>

                <div className="mt-6 font-bold text-emerald-700 group-hover:text-emerald-800">
                  Explore Civil / CTM →
                </div>

              </div>

            </Link>


            {/* ELECTRONICS */}

            <Link to="/branch/electronics" className="group">

              <div className="h-full rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-violet-300 hover:shadow-xl">

                <div className="flex items-center justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-violet-600 text-3xl shadow-md">
                    📡
                  </div>

                  <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700">
                    Electronics
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-extrabold text-gray-900">
                  Electronics Engineering
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Electronics, communication, digital systems
                  and related study resources.
                </p>

                <div className="mt-6 font-bold text-violet-700 group-hover:text-violet-800">
                  Explore Electronics →
                </div>

              </div>

            </Link>


            {/* LEATHER */}

            <Link to="/branch/leather-technology" className="group">

              <div className="h-full rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-pink-50 p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-rose-300 hover:shadow-xl">

                <div className="flex items-center justify-between">

                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-rose-600 text-3xl shadow-md">
                    🧪
                  </div>

                  <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-700">
                    Leather
                  </span>

                </div>

                <h3 className="mt-6 text-xl font-extrabold text-gray-900">
                  Leather Technology
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Leather processing, technology, chemistry
                  and semester-wise study resources.
                </p>

                <div className="mt-6 font-bold text-rose-700 group-hover:text-rose-800">
                  Explore Leather →
                </div>

              </div>

            </Link>

          </div>

        </div>

      </section>
      {/* =========================================
          WHY CHOOSE US
      ========================================= */}

      <section className="bg-slate-50 py-20">

        <div className="max-w-7xl mx-auto px-5 sm:px-6">

          <div className="max-w-2xl mx-auto text-center mb-12">

            <span className="inline-block rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700">
              ✨ Why Student Resources Hub?
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900">
              Made for Students
            </h2>

            <p className="mt-4 text-gray-600 leading-7">
              Everything is organized in a simple way so you can
              spend less time searching and more time studying.
            </p>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* CARD 1 */}

            <div className="group rounded-2xl border border-blue-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-3xl transition group-hover:bg-blue-600">
                ⚡
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Fast Access
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Quickly find the study material you need
                without wasting time.
              </p>

            </div>


            {/* CARD 2 */}

            <div className="group rounded-2xl border border-emerald-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-3xl transition group-hover:bg-emerald-600">
                📱
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Mobile Friendly
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Access your resources comfortably from mobile,
                tablet or laptop.
              </p>

            </div>


            {/* CARD 3 */}

            <div className="group rounded-2xl border border-purple-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-3xl transition group-hover:bg-purple-600">
                🎓
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Semester Wise
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Resources are organized according to your
                semester and branch.
              </p>

            </div>


            {/* CARD 4 */}

            <div className="group rounded-2xl border border-orange-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-3xl transition group-hover:bg-orange-500">
                📥
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                Easy Access
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Open available PDF resources and study
                whenever you need them.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          PLATFORM STATISTICS
      ========================================= */}

      <section className="bg-white py-20">

        <div className="max-w-7xl mx-auto px-5 sm:px-6">

          <div className="text-center mb-12">

            <span className="inline-block rounded-full bg-cyan-100 px-4 py-2 text-sm font-bold text-cyan-700">
              📊 Platform Overview
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900">
              Resources at a Glance
            </h2>

            <p className="mt-4 text-gray-600">
              A growing collection of study material for students.
            </p>

          </div>


          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

            {/* NOTES */}

            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 md:p-8 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl text-white">
                📄
              </div>

              <h3 className="mt-5 text-3xl md:text-4xl font-extrabold text-blue-700">
                20+
              </h3>

              <p className="mt-2 font-semibold text-gray-700">
                Notes
              </p>

            </div>


            {/* PYQ */}

            <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 md:p-8 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-xl text-white">
                📝
              </div>

              <h3 className="mt-5 text-3xl md:text-4xl font-extrabold text-orange-600">
                26+
              </h3>

              <p className="mt-2 font-semibold text-gray-700">
                PYQs
              </p>

            </div>


            {/* EBOOK */}

            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 md:p-8 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-xl text-white">
                📖
              </div>

              <h3 className="mt-5 text-3xl md:text-4xl font-extrabold text-emerald-700">
                11+
              </h3>

              <p className="mt-2 font-semibold text-gray-700">
                E-Books
              </p>

            </div>


            {/* SEMESTERS */}

            <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 md:p-8 text-center shadow-sm">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-xl text-white">
                🎓
              </div>

              <h3 className="mt-5 text-3xl md:text-4xl font-extrabold text-purple-700">
                6
              </h3>

              <p className="mt-2 font-semibold text-gray-700">
                Semesters
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          EXPLORE RESOURCES
      ========================================= */}

      <section className="bg-slate-50 py-20">

        <div className="max-w-7xl mx-auto px-5 sm:px-6">

          <div className="max-w-2xl mx-auto text-center mb-12">

            <span className="inline-block rounded-full bg-pink-100 px-4 py-2 text-sm font-bold text-pink-700">
              🔥 Study Resources
            </span>

            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-gray-900">
              Explore What You Need
            </h2>

            <p className="mt-4 text-gray-600 leading-7">
              Choose a section and start studying with the
              available resources.
            </p>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* NOTES */}

            <Link to="/notes" className="group">

              <div className="h-full rounded-2xl border border-blue-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-blue-300 hover:shadow-xl">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 text-3xl group-hover:bg-blue-600 transition">
                  📄
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  Student Notes
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Read and revise important semester notes.
                </p>

                <div className="mt-5 font-bold text-blue-700">
                  View Notes →
                </div>

              </div>

            </Link>


            {/* PYQ */}

            <Link to="/pyq" className="group">

              <div className="h-full rounded-2xl border border-orange-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-3xl group-hover:bg-orange-500 transition">
                  📝
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  Previous Papers
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Practice previous year questions before exams.
                </p>

                <div className="mt-5 font-bold text-orange-600">
                  View PYQs →
                </div>

              </div>

            </Link>


            {/* SYLLABUS */}

            <Link to="/syllabus" className="group">

              <div className="h-full rounded-2xl border border-purple-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-purple-300 hover:shadow-xl">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 text-3xl group-hover:bg-purple-600 transition">
                  📘
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  Syllabus
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Check your subjects and semester syllabus.
                </p>

                <div className="mt-5 font-bold text-purple-700">
                  View Syllabus →
                </div>

              </div>

            </Link>


            {/* EBOOKS */}

            <Link to="/ebooks" className="group">

              <div className="h-full rounded-2xl border border-emerald-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-xl">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100 text-3xl group-hover:bg-emerald-600 transition">
                  📖
                </div>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  E-Books
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Explore useful books for your studies.
                </p>

                <div className="mt-5 font-bold text-emerald-700">
                  View E-Books →
                </div>

              </div>

            </Link>

          </div>

        </div>

      </section>
      {/* =========================================
          AI QUESTION PAPER SECTION
      ========================================= */}

      <section className="bg-white py-20">

        <div className="max-w-7xl mx-auto px-5 sm:px-6">

          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-700 text-white shadow-xl">

            <div className="grid lg:grid-cols-2 gap-10 items-center p-8 sm:p-12 lg:p-14">

              {/* LEFT */}

              <div>

                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold">
                  🤖 AI Study Assistant
                </span>

                <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight">
                  Prepare Your Own
                  <span className="block text-cyan-200">
                    AI Question Paper
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-blue-100 leading-7">
                  Select your branch, semester, subject and
                  difficulty level to generate a practice
                  question paper for your preparation.
                </p>

                <Link
                  to="/ai-question-paper"
                  className="mt-7 inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 font-bold text-indigo-700 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
                >
                  🤖 Create AI Paper →
                </Link>

              </div>


              {/* RIGHT */}

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">

                  <div className="text-3xl">
                    🎯
                  </div>

                  <h3 className="mt-3 font-bold">
                    Practice
                  </h3>

                  <p className="mt-2 text-sm text-blue-100">
                    Practice according to your subject.
                  </p>

                </div>


                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">

                  <div className="text-3xl">
                    🧠
                  </div>

                  <h3 className="mt-3 font-bold">
                    Smart Questions
                  </h3>

                  <p className="mt-2 text-sm text-blue-100">
                    Generate useful practice questions.
                  </p>

                </div>


                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">

                  <div className="text-3xl">
                    📚
                  </div>

                  <h3 className="mt-3 font-bold">
                    Subject Based
                  </h3>

                  <p className="mt-2 text-sm text-blue-100">
                    Focus on the subject you choose.
                  </p>

                </div>


                <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">

                  <div className="text-3xl">
                    ⏱️
                  </div>

                  <h3 className="mt-3 font-bold">
                    Exam Practice
                  </h3>

                  <p className="mt-2 text-sm text-blue-100">
                    Prepare before your actual exam.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          FINAL CTA
      ========================================= */}

      <section className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-20 text-white">

        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10" />

        <div className="absolute -bottom-28 -left-24 h-72 w-72 rounded-full bg-cyan-300/10" />


        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl backdrop-blur">
            🎓
          </div>

          <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-extrabold">
            Ready to Start Learning?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-blue-100 text-base sm:text-lg leading-7">
            Explore your study resources, practice previous
            year questions and prepare smarter for your exams.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">

            <Link
              to="/notes"
              className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
            >
              📚 Start Learning
            </Link>

            <Link
              to="/branches"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-bold text-white backdrop-blur transition hover:bg-white/20 hover:-translate-y-1"
            >
              🎓 Explore Branches
            </Link>

          </div>

        </div>

      </section>


      {/* =========================================
          FOOTER
      ========================================= */}

      <Footer />

    </>
  );
}
