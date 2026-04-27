import { useState } from "react";
import "./index.css";

const ROLES = [
  "Software Engineering",
  "Data Science",
  "Web Development",
  "General",
];

export default function App() {
  const [rawText, setRawText] = useState("");
  const [role, setRole] = useState("General");
  const [bullets, setBullets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!rawText.trim()) return;

    setLoading(true);
    setError("");
    setBullets([]);

    try {
      const res = await fetch("/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw_text: rawText, role }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setBullets(data.bullets);
      }
    } catch (err) {
      setError("Something went wrong. Is the backend running?");
    }

    setLoading(false);
  };

  const handleCopy = () => {
    const text = bullets.join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-2xl">

        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            BulletBoost <span className="text-emerald-400">AI</span>
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">
            paste rough experience → get resume-ready bullets
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">
            Your raw experience
          </label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="e.g. I worked on a website and helped with the frontend stuff..."
            rows={5}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 resize-none transition-colors"
          />
        </div>

        <div className="mb-6">
          <label className="block text-xs text-zinc-500 mb-1 uppercase tracking-wider">
            Target role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !rawText.trim()}
          className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-semibold py-3 rounded-lg transition-colors text-sm"
        >
          {loading ? "Generating..." : "Generate Bullets"}
        </button>

        {error && (
          <p className="mt-4 text-red-400 text-sm">{error}</p>
        )}

        {bullets.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-500 uppercase tracking-wider">
                Your bullets
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {copied ? "Copied!" : "Copy all"}
              </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-4 space-y-3">
              {bullets.map((bullet, i) => (
                <p key={i} className="text-sm text-zinc-200 leading-relaxed">
                  {bullet}
                </p>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}