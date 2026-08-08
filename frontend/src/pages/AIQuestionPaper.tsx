import { useState } from "react";

interface Question {
  number: number;
  type: string;
  question: string;
  options?: string[];
  answer: string;
}

interface Paper {
  _id?: string;
  title: string;
  subject: string;
  unit: string;
  difficulty: string;
  questionType?: string;
  questionCount?: number;
  questions: Question[];
  createdAt?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  paper?: Paper;
}

// ======================================
// API BASE URL
// ======================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export default function AIQuestionPaper() {
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("Full Syllabus");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState("20");
  const [questionType, setQuestionType] = useState("Mixed");

  const [loading, setLoading] = useState(false);
  const [result, setResult] =
    useState<ApiResponse | null>(null);

  const [error, setError] = useState("");

  // ======================================
  // GENERATE QUESTION PAPER
  // ======================================

  const handleGenerate = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setResult(null);
    setError("");

    try {
      // ======================================
      // GET ONLY CURRENT LOGIN TOKEN
      // ======================================

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Please login first to generate and save question papers."
        );
      }

      // ======================================
      // API URL CHECK
      // ======================================

      if (!API_URL) {
        throw new Error(
          "Backend API URL is not configured."
        );
      }

      console.log(
        "AI API URL:",
        `${API_URL}/api/ai/generate-paper`
      );

      // ======================================
      // API REQUEST
      // ======================================

      const response = await fetch(
        `${API_URL}/api/ai/generate-paper`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            subject,
            unit,
            difficulty,
            questionCount:
              Number(questionCount),
            questionType,
          }),
        }
      );

      // ======================================
      // READ RESPONSE
      // ======================================

      let data: ApiResponse;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          `Server returned an invalid response. Status: ${response.status}`
        );
      }

      console.log(
        "AI PAPER RESPONSE:",
        data
      );

      // ======================================
      // AUTH ERROR
      // ======================================

      if (response.status === 401) {
        // Remove invalid/expired token
        localStorage.removeItem("token");

        throw new Error(
          data.message ||
            "Your login session has expired. Please login again."
        );
      }

      // ======================================
      // OTHER API ERRORS
      // ======================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to generate question paper. Server status: ${response.status}`
        );
      }

      // ======================================
      // SUCCESS
      // ======================================

      if (!data.success) {
        throw new Error(
          data.message ||
            "Question paper generation failed."
        );
      }

      if (!data.paper) {
        throw new Error(
          "Question paper was not returned by the server."
        );
      }

      setResult(data);

    } catch (err) {
      console.error(
        "AI Paper Error:",
        err
      );

      if (
        err instanceof TypeError
      ) {
        setError(
          "Unable to connect to the backend server. Please check the backend URL and CORS settings."
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to connect to server."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // ======================================
  // PRINT / SAVE PDF
  // ======================================

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">

      <div className="max-w-5xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="text-center mb-10">

          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4 font-semibold">
            🤖 AI Powered
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-blue-700">
            AI Question Paper Generator
          </h1>

          <p className="text-gray-600 mt-4">
            Generate practice question papers instantly using AI.
          </p>

        </div>

        {/* ======================================
            FORM CARD
        ====================================== */}

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <form
            onSubmit={handleGenerate}
            className="space-y-6"
          >

            {/* SUBJECT */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Select Subject
              </label>

              <select
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="">
                  Choose Subject
                </option>

                <option value="DBMS">
                  DBMS
                </option>

                <option value="Java">
                  Java
                </option>

                <option value="Data Structures">
                  Data Structures
                </option>

                <option value="Computer Networks">
                  Computer Networks
                </option>

                <option value="Operating System">
                  Operating System
                </option>

              </select>

            </div>

            {/* UNIT */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Select Unit
              </label>

              <select
                value={unit}
                onChange={(e) =>
                  setUnit(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option>
                  Full Syllabus
                </option>

                <option>
                  Unit 1
                </option>

                <option>
                  Unit 2
                </option>

                <option>
                  Unit 3
                </option>

                <option>
                  Unit 4
                </option>

                <option>
                  Unit 5
                </option>

              </select>

            </div>

            {/* DIFFICULTY */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Difficulty Level
              </label>

              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option>
                  Easy
                </option>

                <option>
                  Medium
                </option>

                <option>
                  Hard
                </option>

              </select>

            </div>

            {/* QUESTION COUNT */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Number of Questions
              </label>

              <select
                value={questionCount}
                onChange={(e) =>
                  setQuestionCount(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="10">
                  10 Questions
                </option>

                <option value="20">
                  20 Questions
                </option>

                <option value="30">
                  30 Questions
                </option>

                <option value="50">
                  50 Questions
                </option>

              </select>

            </div>

            {/* QUESTION TYPE */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                Question Type
              </label>

              <select
                value={questionType}
                onChange={(e) =>
                  setQuestionType(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option>
                  Mixed
                </option>

                <option>
                  MCQ
                </option>

                <option>
                  Short Answer
                </option>

                <option>
                  Long Answer
                </option>

              </select>

            </div>

            {/* GENERATE BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-lg transition"
            >

              {loading
                ? "🤖 Generating Question Paper..."
                : "🤖 Generate Question Paper"}

            </button>

          </form>

          {/* ======================================
              ERROR
          ====================================== */}

          {error && (

            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">

              ❌ {error}

            </div>

          )}

          {/* ======================================
              GENERATED PAPER
          ====================================== */}

          {result?.success &&
            result.paper && (

            <div
              id="generated-paper"
              className="mt-10"
            >

              {/* PAPER HEADER */}

              <div className="bg-blue-700 text-white rounded-t-2xl p-6">

                <div className="flex flex-col md:flex-row justify-between gap-4">

                  <div>

                    <h2 className="text-2xl md:text-3xl font-bold">
                      📚 {result.paper.title}
                    </h2>

                    <p className="mt-2 text-blue-100">
                      Subject: {result.paper.subject}
                    </p>

                  </div>

                  <div className="text-left md:text-right">

                    <p>
                      Unit:{" "}
                      {result.paper.unit}
                    </p>

                    <p>
                      Difficulty:{" "}
                      {result.paper.difficulty}
                    </p>

                    <p>
                      Questions:{" "}
                      {result.paper.questions.length}
                    </p>

                  </div>

                </div>

              </div>

              {/* QUESTIONS */}

              <div className="bg-white border border-gray-200 rounded-b-2xl">

                {result.paper.questions.map(
                  (q, index) => (

                  <div
                    key={`${q.number}-${index}`}
                    className="p-6 border-b border-gray-200 last:border-b-0"
                  >

                    <div className="flex gap-3">

                      <span className="flex-shrink-0 bg-blue-100 text-blue-700 font-bold w-9 h-9 rounded-full flex items-center justify-center">

                        {q.number ||
                          index + 1}

                      </span>

                      <div className="flex-1">

                        {/* TYPE */}

                        <span className="inline-block text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full mb-3">

                          {q.type}

                        </span>

                        {/* QUESTION */}

                        <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">

                          {q.question}

                        </h3>

                        {/* OPTIONS */}

                        {q.options &&
                          q.options.length >
                            0 && (

                          <div className="grid md:grid-cols-2 gap-3 mt-4">

                            {q.options.map(
                              (
                                option,
                                optionIndex
                              ) => (

                              <div
                                key={
                                  optionIndex
                                }
                                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                              >

                                <span className="font-bold text-blue-600 mr-2">

                                  {String.fromCharCode(
                                    65 +
                                      optionIndex
                                  )}

                                  .

                                </span>

                                {option}

                              </div>

                            )
                            )}

                          </div>

                        )}

                        {/* ANSWER */}

                        <details className="mt-5">

                          <summary className="cursor-pointer inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">

                            ✅ Show Answer

                          </summary>

                          <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">

                            <strong>
                              Answer:
                            </strong>{" "}

                            {q.answer}

                          </div>

                        </details>

                      </div>

                    </div>

                  </div>

                )
                )}

              </div>

              {/* PAPER ACTIONS */}

              <div className="mt-6 flex flex-col md:flex-row gap-4">

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-lg"
                >

                  🖨️ Print / Save as PDF

                </button>

              </div>

              {/* SUCCESS */}

              <div className="mt-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center font-semibold">

                ✅ Question paper generated and saved successfully!

              </div>

            </div>

          )}

        </div>

        {/* ======================================
            FEATURES
        ====================================== */}

        <div className="grid md:grid-cols-3 gap-6 mt-8">

          <div className="bg-white p-6 rounded-xl shadow text-center">

            <div className="text-3xl mb-2">
              ⚡
            </div>

            <h3 className="font-bold">
              Instant Generation
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Generate papers quickly.
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">

            <div className="text-3xl mb-2">
              🎯
            </div>

            <h3 className="font-bold">
              Custom Difficulty
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Choose your preferred difficulty.
            </p>

          </div>

          <div className="bg-white p-6 rounded-xl shadow text-center">

            <div className="text-3xl mb-2">
              💾
            </div>

            <h3 className="font-bold">
              Saved Automatically
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Generated papers are saved to your account.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}