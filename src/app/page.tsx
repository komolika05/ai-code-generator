"use client";

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard, ClipboardCheck } from "lucide-react";

export default function Home() {
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [pureCode, setPureCode] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSolve = async () => {
    setLoading(true);
    setSolution("");
    setPureCode(""); 
    setCopied(false);

    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });

      if (!res.ok) throw new Error("Failed to fetch solution");

      const data = await res.json();
      const fullResponse = data.solution;

      // Extract only the code part using regex
      const codeBlockMatch = fullResponse.match(/```(?:typescript|javascript|ts|js)?\n([\s\S]*?)```/);
      const extractedCode = codeBlockMatch ? codeBlockMatch[1].trim() : "⚠️ No code found in response";

      setSolution(fullResponse); // Store full response with explanations
      setPureCode(extractedCode); // Store only extracted code
    } catch (error) {
      console.error("Error:", error);
      setSolution("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setProblem("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(pureCode)
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
          <div className="bg-gray-800 p-4 rounded-lg text-gray-300">
            <p className="whitespace-pre-line">{solution.replace(/```[\s\S]*?```/g, "").trim()}</p>
          </div>

          {pureCode !== "⚠️ No code for this question" && (
            <div className="relative mt-4">
              <button
                onClick={copyToClipboard}
                className="absolute top-2 right-2 p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                {copied ? <ClipboardCheck size={18} /> : <Clipboard size={18} />}
              </button>

              <SyntaxHighlighter language="typescript" style={dracula} showLineNumbers>
                {pureCode}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
