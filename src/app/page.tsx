"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula, a11yDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard, ClipboardCheck } from "lucide-react";

export default function Home() {
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSolve = async () => {
    setLoading(true);
    setSolution("");
    setCopied(false);

    try {
      console.log("Request Method: POST");
      console.log("Problem Value:", problem);
      
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });

      if (!res.ok) throw new Error("Failed to fetch solution");

      const data = await res.json(); 
      setSolution(data.solution);
    } catch (error) {
      console.error("Error:", error);
      setSolution("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setProblem("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(solution)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
      })
      .catch(err => console.error("Failed to copy: ", err));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">AI Code Assistant</h1>

      <textarea
        className="w-full max-w-2xl p-3 border rounded bg-gray-800 text-white"
        rows={4}
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        placeholder="Enter your coding problem..."
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSolve();
        }}
      />

      <button
        className="mt-4 bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSolve}
        disabled={loading}
      >
        {loading ? "Writing the code for you..." : "Generate Solution"}
      </button>

      {solution && (
        <div className="relative mt-6 w-full max-w-6xl">
          <div className="group relative">
            <button
              onClick={copyToClipboard}
              className="absolute top-4 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              {copied ? <ClipboardCheck size={18} /> : <Clipboard size={18} />}
            </button>

            <span className="absolute top-[-30px] right-0 w-auto px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Copy Code
            </span>
          </div>

          <SyntaxHighlighter language="javascript" style={a11yDark}>
            {solution}
          </SyntaxHighlighter>
        </div>
      )}

    </div>
  );
}
