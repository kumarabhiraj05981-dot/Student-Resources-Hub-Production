import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const branches = [
  {
    name: "Computer Science",
    short: "CSE",
    description:
      "Programming, DBMS, data structures, networks and software development resources.",
    path: "/branch/cse",
  },
  {
    name: "Electrical Engineering",
    short: "Electrical",
    description:
      "Electrical circuits, machines, power systems and engineering study material.",
    path: "/branch/electrical",
  },
  {
    name: "Mechanical Engineering",
    short: "Mechanical",
    description:
      "Thermodynamics, mechanics, manufacturing and mechanical engineering resources.",
    path: "/branch/mechanical",
  },
  {
    name: "Civil Engineering / CTM",
    short: "Civil / CTM",
    description:
      "Civil engineering and CTM resources organized for semester-wise study.",
    path: "/branch/civil-ctm",
  },
  {
    name: "Electronics Engineering",
    short: "Electronics",
    description:
      "Digital systems, communication, electronics and related study material.",
    path: "/branch/electronics",
  },
  {
    name: "Leather Technology",
    short: "Leather Technology",
    description:
      "Leather processing, chemistry, technology and semester-wise resources.",
    path: "/branch/leather-technology",
  },
];

const resourceTypes = [
  {
    title: "Notes",
    description: "Semester-wise notes for regular study and revision.",
    path: "/notes",
    number: "01",
  },
  {
    title: "Previous Year Questions",
    description: "Practice previous papers and understand exam patterns.",
    path: "/pyq",
    number: "02",
  },
  {
    title: "Syllabus",
    description: "Keep your subjects and semester syllabus organized.",
    path: "/syllabus",
    number: "03",
  },
  {
    title: "E-Books",
    description: "Useful books and reference material in one place.",
    path: "/ebooks",
    number: "04",
  },
];

export default function Home() {
  return (
    <>
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <main className="bg-white text-gray-900">

        <section className="border-b border-gray-200">
          <div className="page-container">

            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-20 items-center py-16 md:py-24 lg:py-28">

              {/* LEFT */}

              <div>

                <div className="inline-flex items-center gap-2 border border-blue-200 bg-blue-50 rounded-full px-4 py-2 mb-7">
                  <span className="h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-sm font-semibold text-blue-700">
                    Built for students
                  </span>
                </div>

                <h1 className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-gray-950">
                  Your study material,
                  <span className="block text-blue-700">
                    all in one place.
                  </span>
                </h1>

                <p className="max-w-2xl mt-6 text-base sm:text-lg leading-8 text-gray-600">
                  Student Resources Hub makes it easier to find notes,
                  previous year questions, syllabus and e-books without
                  searching through different places.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-8">

                  <Link
                    to="/notes"
                    className="primary-button justify-center min-h-[48px] px-6"
                  >
                    Explore Resources
                  </Link>

                  <Link
                    to="/branches"
                    className="secondary-button justify-center min-h-[48px] px-6"
                  >
                    Browse by Branch
                  </Link>

                </div>

                <div className="flex flex-wrap gap-x-8 gap-y-3 mt-9 pt-7 border-t border-gray-200">

                  <div>
                    <p className="text-xl font-bold text-gray-950">
                      6
                    </p>
                    <p className="text-sm text-gray-500">
                      Semesters
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-bold text-gray-950">
                      6+
                    </p>
                    <p className="text-sm text-gray-500">
                      Branches
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-bold text-gray-950">
                      4
                    </p>
                    <p className="text-sm text-gray-500">
                      Resource types
                    </p>
                  </div>

                </div>

              </div>


              {/* RIGHT — CUSTOM UI, NO IMAGE */}

              <div className="relative">

                <div className="rounded-3xl border border-gray-200 bg-gray-50 p-5 sm:p-7">

                  <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

                    {/* WINDOW HEADER */}

                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">

                      <div className="flex items-center gap-2">

                        <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                        <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                        <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />

                      </div>

                      <span className="text-xs font-medium text-gray-400">
                        Student Resources Hub
                      </span>

                    </div>


                    {/* DASHBOARD */}

                    <div className="p-5 sm:p-6">

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Study dashboard
                      </p>

                      <h2 className="text-xl font-bold mt-2 text-gray-900">
                        Find what you need
                      </h2>

                      <div className="grid grid-cols-2 gap-3 mt-5">

                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                          <p className="text-xs font-semibold text-blue-600">
                            NOTES
                          </p>
                          <p className="mt-2 text-lg font-bold text-gray-900">
                            Study
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                          <p className="text-xs font-semibold text-gray-500">
                            PYQ
                          </p>
                          <p className="mt-2 text-lg font-bold text-gray-900">
                            Practice
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                          <p className="text-xs font-semibold text-gray-500">
                            SYLLABUS
                          </p>
                          <p className="mt-2 text-lg font-bold text-gray-900">
                            Plan
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                          <p className="text-xs font-semibold text-gray-500">
                            E-BOOKS
                          </p>
                          <p className="mt-2 text-lg font-bold text-gray-900">
                            Read
                          </p>
                        </div>

                      </div>


                      <div className="mt-5 rounded-xl bg-gray-900 p-4">

                        <div className="flex items-center justify-between">

                          <div>
                            <p className="text-xs text-gray-400">
                              CURRENT SEMESTER
                            </p>

                            <p className="text-sm font-semibold text-white mt-1">
                              Choose resources and start learning
                            </p>
                          </div>

                          <span className="text-blue-400 text-lg">
                            →
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>
        </section>


        {/* =====================================================
            RESOURCE TYPES
        ===================================================== */}

        <section className="py-16 md:py-20">

          <div className="page-container">

            <div className="max-w-2xl mb-10">

              <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
                Resources
              </p>

              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
                Everything you need for your studies.
              </h2>

              <p className="text-gray-600 mt-4 leading-7">
                Choose a resource category and get directly to the
                material you are looking for.
              </p>

            </div>


            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {resourceTypes.map((resource) => (

                <Link
                  key={resource.number}
                  to={resource.path}
                  className="group"
                >

                  <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">

                    <div className="flex items-center justify-between">

                      <span className="text-sm font-bold text-blue-600">
                        {resource.number}
                      </span>

                      <span className="text-gray-300 group-hover:text-blue-600 transition">
                        →
                      </span>

                    </div>

                    <h3 className="text-lg font-bold mt-8">
                      {resource.title}
                    </h3>

                    <p className="text-sm text-gray-600 leading-6 mt-3">
                      {resource.description}
                    </p>

                  </div>

                </Link>

              ))}

            </div>

          </div>

        </section>


        {/* =====================================================
            BRANCHES
        ===================================================== */}

        <section className="bg-gray-50 border-y border-gray-200 py-16 md:py-20">

          <div className="page-container">

            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

              <div className="max-w-2xl">

                <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
                  Branches
                </p>

                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
                  Find resources for your branch.
                </h2>

                <p className="text-gray-600 mt-4 leading-7">
                  Select your engineering branch and explore the
                  available study material.
                </p>

              </div>

              <Link
                to="/branches"
                className="text-sm font-bold text-blue-700 hover:text-blue-800"
              >
                View all branches →
              </Link>

            </div>


            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {branches.map((branch) => (

                <Link
                  key={branch.short}
                  to={branch.path}
                  className="group"
                >

                  <div className="h-full rounded-2xl border border-gray-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg">

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <span className="inline-flex rounded-lg bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                          {branch.short}
                        </span>

                        <h3 className="text-lg font-bold mt-4">
                          {branch.name}
                        </h3>

                      </div>

                      <span className="text-xl text-gray-300 group-hover:text-blue-600 transition">
                        →
                      </span>

                    </div>

                    <p className="text-sm text-gray-600 leading-6 mt-3">
                      {branch.description}
                    </p>

                  </div>

                </Link>

              ))}

            </div>

          </div>

        </section>
        {/* =====================================================
            WHY STUDENT RESOURCES HUB
        ===================================================== */}

        <section className="py-16 md:py-20">

          <div className="page-container">

            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20 items-start">

              {/* LEFT */}

              <div>

                <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
                  Why use the platform?
                </p>

                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
                  Simple tools for everyday study.
                </h2>

                <p className="text-gray-600 leading-7 mt-5">
                  The platform is designed around the things students
                  actually need during a semester — finding material,
                  preparing for exams and keeping study resources organized.
                </p>

              </div>


              {/* RIGHT */}

              <div className="divide-y divide-gray-200 border-y border-gray-200">

                <div className="py-6 flex gap-5">

                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 font-bold">
                    01
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      Easy to navigate
                    </h3>

                    <p className="text-sm text-gray-600 leading-6 mt-1">
                      Resources are separated into clear categories,
                      branches and semesters so you can reach the right
                      material quickly.
                    </p>
                  </div>

                </div>


                <div className="py-6 flex gap-5">

                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 font-bold">
                    02
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      Built for mobile
                    </h3>

                    <p className="text-sm text-gray-600 leading-6 mt-1">
                      The layout adapts to phones, tablets and desktop
                      screens without making the interface difficult to use.
                    </p>
                  </div>

                </div>


                <div className="py-6 flex gap-5">

                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 font-bold">
                    03
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      Semester-wise organization
                    </h3>

                    <p className="text-sm text-gray-600 leading-6 mt-1">
                      Keep notes, PYQs, syllabus and other study material
                      connected to the semester you are preparing for.
                    </p>
                  </div>

                </div>


                <div className="py-6 flex gap-5">

                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 font-bold">
                    04
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">
                      One place for preparation
                    </h3>

                    <p className="text-sm text-gray-600 leading-6 mt-1">
                      Instead of keeping resources scattered across
                      different places, access your study material from
                      one platform.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            AI QUESTION PAPER
        ===================================================== */}

        <section className="bg-gray-950 text-white py-16 md:py-20">

          <div className="page-container">

            <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">

              <div className="max-w-3xl">

                <span className="inline-flex items-center rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                  AI Study Tool
                </span>

                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-5">
                  Create a practice question paper when you need one.
                </h2>

                <p className="text-gray-400 leading-7 mt-4 max-w-2xl">
                  Use the AI Question Paper feature to generate practice
                  papers based on your subject and preparation requirements.
                  It is designed to help you revise more effectively.
                </p>

              </div>

              <Link
                to="/ai-question-paper"
                className="inline-flex items-center justify-center min-h-[48px] rounded-lg bg-white px-6 font-bold text-gray-950 hover:bg-gray-100 transition"
              >
                Try AI Paper →
              </Link>

            </div>

          </div>

        </section>


        {/* =====================================================
            PLATFORM OVERVIEW
        ===================================================== */}

        <section className="py-16 md:py-20">

          <div className="page-container">

            <div className="text-center max-w-2xl mx-auto mb-10">

              <p className="text-sm font-bold uppercase tracking-wider text-blue-700">
                At a glance
              </p>

              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2">
                A growing student resource library.
              </h2>

              <p className="text-gray-600 leading-7 mt-4">
                More resources can be added as the platform grows.
              </p>

            </div>


            <div className="grid grid-cols-2 lg:grid-cols-4 border border-gray-200 rounded-2xl overflow-hidden">

              <div className="p-6 md:p-8 text-center border-b sm:border-b-0 border-r border-gray-200">

                <p className="text-3xl md:text-4xl font-extrabold text-gray-950">
                  20+
                </p>

                <p className="text-sm font-medium text-gray-500 mt-2">
                  Notes
                </p>

              </div>


              <div className="p-6 md:p-8 text-center border-b sm:border-b-0 lg:border-r border-gray-200">

                <p className="text-3xl md:text-4xl font-extrabold text-gray-950">
                  26+
                </p>

                <p className="text-sm font-medium text-gray-500 mt-2">
                  PYQs
                </p>

              </div>


              <div className="p-6 md:p-8 text-center border-r border-gray-200">

                <p className="text-3xl md:text-4xl font-extrabold text-gray-950">
                  11+
                </p>

                <p className="text-sm font-medium text-gray-500 mt-2">
                  E-Books
                </p>

              </div>


              <div className="p-6 md:p-8 text-center">

                <p className="text-3xl md:text-4xl font-extrabold text-gray-950">
                  6
                </p>

                <p className="text-sm font-medium text-gray-500 mt-2">
                  Semesters
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            FINAL CTA
        ===================================================== */}

        <section className="border-t border-gray-200 py-16 md:py-20">

          <div className="page-container">

            <div className="rounded-3xl bg-blue-700 px-6 sm:px-10 md:px-14 py-12 md:py-16 text-center">

              <p className="text-sm font-bold uppercase tracking-wider text-blue-200">
                Start studying
              </p>

              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white mt-3">
                Your next study session starts here.
              </h2>

              <p className="max-w-2xl mx-auto text-blue-100 leading-7 mt-5">
                Browse the available resources, choose your semester
                and start preparing at your own pace.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">

                <Link
                  to="/notes"
                  className="inline-flex items-center justify-center min-h-[48px] rounded-lg bg-white px-7 font-bold text-blue-700 hover:bg-blue-50 transition"
                >
                  Explore Resources
                </Link>

                <Link
                  to="/ai-question-paper"
                  className="inline-flex items-center justify-center min-h-[48px] rounded-lg border border-blue-400 px-7 font-bold text-white hover:bg-blue-600 transition"
                >
                  Generate AI Paper
                </Link>

              </div>

            </div>

          </div>

        </section>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />
    </>
  );
}
