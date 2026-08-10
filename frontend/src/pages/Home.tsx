import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">

        <section className="bg-gradient-to-r from-blue-700 via-indigo-600 to-cyan-500 px-5 py-24 text-center text-white">
          <div className="mx-auto max-w-4xl">

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/15 text-4xl shadow-lg">
              📚
            </div>

            <p className="mb-4 inline-block rounded-full bg-white/10 px-4 py-2 text-sm font-semibold">
              Student Learning Platform
            </p>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Student Resources
              <span className="block text-cyan-200">
                Hub
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Notes, PYQs, Syllabus, E-Books and AI-powered
              question papers — everything in one place.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

              <a
                href="/notes"
                className="rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
              >
                Explore Resources
              </a>

              <a
                href="/ai-question-paper"
                className="rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-bold text-white transition hover:bg-white/20"
              >
                Generate AI Paper
              </a>

            </div>

          </div>
        </section>

        

          </div>

       

        <section className="bg-slate-50 px-5 py-16">

          <div className="mx-auto max-w-7xl">

            <div className="mb-10 text-center">

              <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">
                Browse By Branch
              </p>

              <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                Choose Your Branch
              </h2>

            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <a
                href="/branch/cse"
                className="rounded-2xl border border-blue-100 bg-blue-50 p-7 transition hover:-translate-y-2 hover:bg-blue-100 hover:shadow-xl"
              >
                <div className="text-4xl">💻</div>

                <h3 className="mt-5 text-xl font-extrabold text-gray-900">
                  Computer Science
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Programming, DBMS, DSA, Networks and more.
                </p>

                <div className="mt-5 font-bold text-blue-700">
                  Explore CSE →
                </div>
              </a>

              <a
                href="/branch/electrical"
                className="rounded-2xl border border-amber-100 bg-amber-50 p-7 transition hover:-translate-y-2 hover:bg-amber-100 hover:shadow-xl"
              >
                <div className="text-4xl">⚡</div>

                <h3 className="mt-5 text-xl font-extrabold text-gray-900">
                  Electrical Engineering
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Circuits, machines and power systems.
                </p>

                <div className="mt-5 font-bold text-amber-700">
                  Explore Electrical →
                </div>
              </a>

              <a
                href="/branch/mechanical"
                className="rounded-2xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-2 hover:bg-slate-100 hover:shadow-xl"
              >
                <div className="text-4xl">🔧</div>

                <h3 className="mt-5 text-xl font-extrabold text-gray-900">
                  Mechanical Engineering
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Manufacturing, mechanics and thermodynamics.
                </p>

                <div className="mt-5 font-bold text-slate-700">
                  Explore Mechanical →
                </div>
              </a>

              <a
                href="/branch/civil-ctm"
                className="rounded-2xl border border-emerald-100 bg-emerald-50 p-7 transition hover:-translate-y-2 hover:bg-emerald-100 hover:shadow-xl"
              >
                <div className="text-4xl">🏗️</div>

                <h3 className="mt-5 text-xl font-extrabold text-gray-900">
                  Civil / CTM
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Civil and CTM semester resources.
                </p>

                <div className="mt-5 font-bold text-emerald-700">
                  Explore Civil →
                </div>
              </a>

              <a
                href="/branch/electronics"
                className="rounded-2xl border border-violet-100 bg-violet-50 p-7 transition hover:-translate-y-2 hover:bg-violet-100 hover:shadow-xl"
              >
                <div className="text-4xl">📡</div>

                <h3 className="mt-5 text-xl font-extrabold text-gray-900">
                  Electronics
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Communication and digital systems.
                </p>

                <div className="mt-5 font-bold text-violet-700">
                  Explore Electronics →
                </div>
              </a>

              <a
                href="/branch/leather-technology"
                className="rounded-2xl border border-rose-100 bg-rose-50 p-7 transition hover:-translate-y-2 hover:bg-rose-100 hover:shadow-xl"
              >
                <div className="text-4xl">🧪</div>

                <h3 className="mt-5 text-xl font-extrabold text-gray-900">
                  Leather Technology
                </h3>

                <p className="mt-2 text-sm text-gray-600">
                  Processing, chemistry and technology resources.
                </p>

                <div className="mt-5 font-bold text-rose-700">
                  Explore Leather →
                </div>
              </a>

            </div>

          </div>
        </section>

        <section className="px-5 py-16">

          <div className="mx-auto max-w-7xl">

            <div className="rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 px-6 py-14 text-center text-white shadow-xl">

              <p className="text-sm font-bold uppercase tracking-wider text-cyan-200">
                Student Resources Hub
              </p>

              <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                Ready to Start Learning?
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-blue-100">
                Find your notes, practice PYQs and generate
                question papers whenever you need them.
              </p>

              <a
                href="/notes"
                className="mt-7 inline-block rounded-xl bg-white px-7 py-3.5 font-bold text-blue-700 shadow-lg transition hover:-translate-y-1"
              >
                Start Learning →
              </a>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}
