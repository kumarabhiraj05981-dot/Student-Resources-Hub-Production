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
  // ======================================
  // FORM STATES
  // ======================================

  const [subject, setSubject] = useState("");

  const [syllabus, setSyllabus] = useState("");

  const [difficulty, setDifficulty] =
    useState("Medium");

  const [questionCount, setQuestionCount] =
    useState("20");

  const [questionType, setQuestionType] =
    useState("Mixed");

  // ======================================
  // UI STATES
  // ======================================

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState<ApiResponse | null>(null);

  const [error, setError] =
    useState("");

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
      // VALIDATE SUBJECT
      // ======================================

      if (!subject.trim()) {
        throw new Error(
          "Please enter a subject name."
        );
      }

      // ======================================
      // VALIDATE SYLLABUS
      // ======================================

      if (!syllabus.trim()) {
        throw new Error(
          "Please enter or paste your syllabus / topics."
        );
      }

      // ======================================
      // GET LOGIN TOKEN
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

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            subject:
              subject.trim(),

            syllabus:
              syllabus.trim(),

            unit:
              syllabus.trim(),

            difficulty,

            questionCount:
              Number(questionCount),

            questionType,
          }),
        }
      );

      // ======================================
      // READ SERVER RESPONSE
      // ======================================

      let data: ApiResponse;

      try {
        data =
          await response.json();
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

      if (
        response.status === 401
      ) {
        localStorage.removeItem(
          "token"
        );

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
      // SUCCESS CHECK
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

      // ======================================
      // SAVE RESULT
      // ======================================

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

  // ======================================
  // CLEAR FORM
  // ======================================

  const handleClear = () => {
    setSubject("");

    setSyllabus("");

    setDifficulty("Medium");

    setQuestionCount("20");

    setQuestionType("Mixed");

    setResult(null);

    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">

      <div className="max-w-5xl mx-auto">

        {/* ======================================
            HEADER
        ====================================== */}

        <div className="text-center mb-10">

          <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4 font-semibold">
             AI Powered
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-blue-700">
            AI Question Paper Generator
          </h1>

          <p className="text-gray-600 mt-4">
            Enter any subject and paste your syllabus.
            AI will generate questions according to your topics.
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

            {/* ======================================
                SUBJECT
            ====================================== */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                📚 Subject Name
              </label>

              <input
                type="text"
                value={subject}
                onChange={(e) =>
                  setSubject(
                    e.target.value
                  )
                }
                placeholder="Example: DBMS, Java, Python, Computer Networks..."
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <p className="text-sm text-gray-500 mt-2">
                You can enter any subject name.
              </p>

            </div>

            {/* ======================================
                SYLLABUS
            ====================================== */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                 Syllabus / Units / Topics
              </label>

              <textarea
                value={syllabus}
                onChange={(e) =>
                  setSyllabus(
                    e.target.value
                  )
                }
                placeholder={`Paste your syllabus here...

Example:

Unit 1: Introduction to DBMS
- Database concepts
- DBMS architecture
- Data models

Unit 2: Relational Model
- Relations
- Keys
- Constraints

Unit 3: SQL
- DDL
- DML
- SELECT queries
- Joins

Unit 4: Normalization
- Functional dependency
- 1NF
- 2NF
- 3NF`}
                required
                rows={12}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />

              <p className="text-sm text-gray-500 mt-2">
                 Copy and paste your complete syllabus,
                units, topics, or study material here.
              </p>

            </div>

            {/* ======================================
                DIFFICULTY
            ====================================== */}

            <div>

              <label className="block font-semibold text-gray-700 mb-2">
                 Difficulty Level
              </label>

              <select
                value={difficulty}
                onChange={(e) =>
                  setDifficulty(
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >

                <option value="Easy">
                  Easy
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Hard">
                  Hard
                </option>

              </select>

            </div>

            {/* ======================================
                QUESTION COUNT
            ====================================== */}

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

            {/* ======================================
                QUESTION TYPE
            ====================================== */}

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

                <option value="Mixed">
                  Mixed
                </option>

                <option value="MCQ">
                  MCQ
                </option>

                <option value="Short Answer">
                  Short Answer
                </option>

                <option value="Long Answer">
                  Long Answer
                </option>

              </select>

            </div>

            {/* ======================================
                BUTTONS
            ====================================== */}

            <div className="flex flex-col md:flex-row gap-4">

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-4 rounded-lg transition"
              >

                {loading
                  ? " Generating Question Paper..."
                  : " Generate Question Paper"}

              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="md:w-32 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-bold py-4 rounded-lg transition"
              >
                Clear
              </button>

            </div>

          </form>{/* ======================================
              ERROR MESSAGE
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

              {/* ======================================
                  PAPER HEADER
              ====================================== */}

              <div className="bg-blue-700 text-white rounded-t-2xl p-6">

                <div className="flex flex-col md:flex-row justify-between gap-4">

                  <div>

                    <h2 className="text-2xl md:text-3xl font-bold">
                      {result.paper.title}
                    </h2>

                    <p className="mt-2 text-blue-100">
                      Subject:{" "}
                      {result.paper.subject}
                    </p>

                  </div>

                  <div className="text-left md:text-right">

                    <p>
                      Difficulty:{" "}
                      {result.paper.difficulty}
                    </p>

                    <p>
                      Questions:{" "}
                      {result.paper.questions.length}
                    </p>

                    {result.paper.questionType && (
                      <p>
                        Type:{" "}
                        {result.paper.questionType}
                      </p>
                    )}

                  </div>

                </div>

              </div>

              {/* ======================================
                  QUESTIONS
              ====================================== */}

              <div className="bg-white border border-gray-200 rounded-b-2xl">

                {result.paper.questions.map(
                  (q, index) => (

                  <div
                    key={`${q.number}-${index}`}
                    className="p-6 border-b border-gray-200 last:border-b-0"
                  >

                    <div className="flex gap-3">

                      {/* QUESTION NUMBER */}

                      <span className="flex-shrink-0 bg-blue-100 text-blue-700 font-bold w-9 h-9 rounded-full flex items-center justify-center">

                        {q.number ||
                          index + 1}

                      </span>

                      <div className="flex-1">

                        {/* QUESTION TYPE */}

                        <span className="inline-block text-xs font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full mb-3">

                          {q.type}

                        </span>

                        {/* QUESTION */}

                        <h3 className="text-lg font-semibold text-gray-800 leading-relaxed">

                          {q.question}

                        </h3>

                        {/* ======================================
                            MCQ OPTIONS
                        ====================================== */}

                        {q.options &&
                          q.options.length > 0 && (

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

                        {/* ======================================
                            ANSWER
                        ====================================== */}

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

              {/* ======================================
                  PAPER ACTIONS
              ====================================== */}

              <div className="mt-6 flex flex-col md:flex-row gap-4">

                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-lg"
                >

                   Print / Save as PDF

                </button>

                <button
                  type="button"
                  onClick={() =>
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    })
                  }
                  className="md:w-48 bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-3 rounded-lg"
                >

                   Generate Another

                </button>

              </div>

              {/* ======================================
                  SUCCESS MESSAGE
              ====================================== */}

              <div className="mt-6 bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center font-semibold">

                ✅ Question paper generated and saved successfully!

              </div>

            </div>

          )}{/* ======================================
              AI FEATURES
          ====================================== */}

          <div className="grid md:grid-cols-3 gap-6 mt-8">

            {/* FEATURE 1 */}

            <div className="bg-white p-6 rounded-xl shadow text-center">

              <div className="text-3xl mb-2">
                
              </div>

              <h3 className="font-bold text-gray-800">
                Instant Generation
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Generate customized question papers
                quickly using AI.
              </p>

            </div>

            {/* FEATURE 2 */}

            <div className="bg-white p-6 rounded-xl shadow text-center">

              <div className="text-3xl mb-2">
                
              </div>

              <h3 className="font-bold text-gray-800">
                Syllabus Based
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Paste your syllabus or topics and
                generate relevant questions.
              </p>

            </div>

            {/* FEATURE 3 */}

            <div className="bg-white p-6 rounded-xl shadow text-center">

              <div className="text-3xl mb-2">
                
              </div>

              <h3 className="font-bold text-gray-800">
                Automatically Saved
              </h3>

              <p className="text-sm text-gray-500 mt-2">
                Generated papers are automatically
                saved to your account.
              </p>

            </div>

          </div>

          {/* ======================================
              HOW TO USE
          ====================================== */}

          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold text-gray-800 text-center">
               How to Use AI Question Generator
            </h2>

            <div className="grid md:grid-cols-4 gap-6 mt-8">

              <div className="text-center">

                <div className="mx-auto bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                  1
                </div>

                <h3 className="font-bold mt-3">
                  Enter Subject
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Type any subject name.
                </p>

              </div>

              <div className="text-center">

                <div className="mx-auto bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                  2
                </div>

                <h3 className="font-bold mt-3">
                  Paste Syllabus
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Paste units, topics or complete syllabus.
                </p>

              </div>

              <div className="text-center">

                <div className="mx-auto bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                  3
                </div>

                <h3 className="font-bold mt-3">
                  Choose Settings
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Select difficulty, number and type.
                </p>

              </div>

              <div className="text-center">

                <div className="mx-auto bg-blue-100 text-blue-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                  4
                </div>

                <h3 className="font-bold mt-3">
                  Generate
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  AI generates your question paper.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
