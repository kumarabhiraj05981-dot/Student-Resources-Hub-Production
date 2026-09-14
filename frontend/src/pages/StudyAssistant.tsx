import { useState, type FormEvent } from "react";
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const starterPrompts = [
  "Explain this topic in simple language",
  "Give me an exam-focused revision summary",
  "Explain with a practical example",
];

export default function StudyAssistant() {
  const [subject, setSubject] = useState("");
  const [language, setLanguage] = useState("English");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (event?: FormEvent) => {
    event?.preventDefault();

    const text = message.trim();

    if (!text || loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login first to use the AI Study Assistant.");
      return;
    }

    setError("");
    setMessage("");

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: text,
      },
    ]);

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/ai/study-assistant`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            message: text,
            subject,
            language,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem("token");

        throw new Error(
          "Your login session has expired. Please login again."
        );
      }

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to get an AI response."
        );
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.answer,
        },
      ]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the AI assistant."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError("");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-6">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <header className="mb-8 text-center">
          <p className="mb-3 inline-flex rounded-full bg-indigo-100 px-4 py-2 text-sm font-bold text-indigo-700">
            AI Powered Learning
          </p>

          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
            AI Study Assistant
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Ask doubts, simplify difficult topics, create quick
            revision notes, and prepare smarter for exams.
          </p>
        </header>

        {/* MAIN CARD */}
        <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">

          {/* SETTINGS */}
          <div className="grid gap-4 md:grid-cols-[1fr_180px_auto]">

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Subject (optional)
              </label>

              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. DBMS, Java, Electrical Machines"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Language
              </label>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Hinglish</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearChat}
                disabled={!messages.length && !error}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear Chat
              </button>
            </div>

          </div>

          {/* STARTER PROMPTS */}
          {messages.length === 0 && (
            <div className="mt-7 rounded-2xl bg-slate-50 p-5">

              <p className="font-bold text-gray-800">
                Try asking:
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() =>
                      setMessage(`${prompt}: `)
                    }
                    className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {prompt}
                  </button>
                ))}

              </div>
            </div>
          )}

          {/* CHAT */}
          <div className="mt-7 space-y-4">

            {messages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`flex ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-5 py-4 text-sm leading-6 md:max-w-[80%] ${
                    item.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-200 bg-gray-50 text-gray-800"
                  }`}
                >
                  {item.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm font-semibold text-gray-500">
                AI is thinking...
              </div>
            )}

          </div>

          {/* ERROR */}
          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* INPUT */}
          <form
            onSubmit={sendMessage}
            className="mt-7"
          >

            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Your question
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">

              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Ask anything about your subject..."
                rows={3}
                maxLength={4000}
                className="min-h-24 flex-1 resize-y rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />

              <button
                type="submit"
                disabled={loading || !message.trim()}
                className="rounded-2xl bg-indigo-600 px-7 py-3 font-bold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 sm:self-end"
              >
                {loading ? "Thinking..." : "Ask AI"}
              </button>

            </div>

            <p className="mt-2 text-xs text-gray-500">
              AI can make mistakes. Verify important academic
              answers with your course material.
            </p>

          </form>

        </section>
      </div>
    </main>
  );
}