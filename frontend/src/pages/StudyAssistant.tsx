import { useEffect, useState, type FormEvent } from "react";

interface ChatMessage {
role: "user" | "assistant";
content: string;
}

interface SavedConversation {
id: string;
question: string;
answer: string;
subject: string;
language: string;
createdAt: string;
}

const API_URL =
import.meta.env.VITE_API_URL || "http://localhost:5000";

const HISTORY_KEY = "student_resources_ai_history";

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
const [history, setHistory] = useState<SavedConversation[]>([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [showHistory, setShowHistory] = useState(false);

// Load saved AI history
useEffect(() => {
try {
const saved = localStorage.getItem(HISTORY_KEY);


  if (saved) {
    const parsed = JSON.parse(saved);

    if (Array.isArray(parsed)) {
      setHistory(parsed);
    }
  }
} catch (err) {
  console.error("AI history load error:", err);
}

}, []);

// Save AI history
useEffect(() => {
try {
localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
} catch (err) {
console.error("AI history save error:", err);
}
}, [history]);

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

  const answer = data.answer;

  setMessages((current) => [
    ...current,
    {
      role: "assistant",
      content: answer,
    },
  ]);

  // Save question + answer to history
  const newConversation: SavedConversation = {
    id: `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`,
    question: text,
    answer,
    subject,
    language,
    createdAt: new Date().toISOString(),
  };

  setHistory((current) => [
    newConversation,
    ...current,
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

const deleteHistoryItem = (id: string) => {
setHistory((current) =>
current.filter((item) => item.id !== id)
);
};

const clearHistory = () => {
const confirmed = window.confirm(
"Are you sure you want to delete all AI history?"
);

if (!confirmed) return;

setHistory([]);


};

const openHistoryItem = (item: SavedConversation) => {
setMessages([
{
role: "user",
content: item.question,
},
{
role: "assistant",
content: item.answer,
},
]);


setSubject(item.subject);
setLanguage(item.language);
setShowHistory(false);
setError("");

window.scrollTo({
  top: 0,
  behavior: "smooth",
});


};

const formatDate = (date: string) => {
try {
return new Date(date).toLocaleString("en-IN", {
day: "2-digit",
month: "short",
year: "numeric",
hour: "2-digit",
minute: "2-digit",
});
} catch {
return "";
}
};

return ( <main className="min-h-screen bg-slate-50 px-4 py-10 md:px-6"> <div className="mx-auto max-w-5xl">


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

      {/* TOP ACTIONS */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => setShowHistory((current) => !current)}
          className="rounded-xl border border-indigo-200 bg-indigo-50 px-5 py-3 font-semibold text-indigo-700 transition hover:bg-indigo-100"
        >
          {showHistory
            ? "Hide History"
            : `AI History${history.length ? ` (${history.length})` : ""}`}
        </button>
      </div>

      {/* HISTORY */}
      {showHistory && (
        <div className="mb-7 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 md:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                AI Answer History
              </h2>

              <p className="mt-1 text-sm text-gray-600">
                Your previous questions and AI answers are saved
                on this device.
              </p>
            </div>

            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                Clear All History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <p className="text-lg font-bold text-gray-700">
                No saved answers yet
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Ask the AI a question and your answer will
                automatically appear here.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap gap-2">
                        {item.subject && (
                          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                            {item.subject}
                          </span>
                        )}

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                          {item.language}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-bold text-gray-900">
                        Question
                      </p>

                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                        {item.question}
                      </p>

                      <p className="mt-4 text-sm font-bold text-gray-900">
                        AI Answer
                      </p>

                      <p className="mt-1 max-h-48 overflow-y-auto whitespace-pre-wrap break-words text-sm leading-6 text-gray-600">
                        {item.answer}
                      </p>

                      <p className="mt-4 text-xs text-gray-400">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
                      <button
                        type="button"
                        onClick={() =>
                          openHistoryItem(item)
                        }
                        className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteHistoryItem(item.id)
                        }
                        className="rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SETTINGS */}
      <div className="grid gap-4 md:grid-cols-[1fr_180px_auto]">

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Subject (optional)
          </label>

          <input
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
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
            onChange={(e) =>
              setLanguage(e.target.value)
            }
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
