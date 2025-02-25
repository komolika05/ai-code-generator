"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Clipboard, ClipboardCheck, Edit, Save } from "lucide-react";

export default function Home() {
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [pureCode, setPureCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState("");
  const [firstQuery, setFirstQuery] = useState(false); // Track first response

  const handleSolve = async () => {
    setLoading(true);
    setSolution("");
    setPureCode("");
    setCopied(false);
    setIsEditing(false);

    try {
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });

      if (!res.ok) throw new Error("Failed to fetch solution");

      const data = await res.json();
      const fullResponse = data.solution;

      const codeBlockMatch = fullResponse.match(/```(?:typescript|javascript|ts|js)?\n([\s\S]*?)```/);
      const extractedCode = codeBlockMatch ? codeBlockMatch[1].trim() : "⚠️ No code found in response";

      setSolution(fullResponse);
      setPureCode(extractedCode);
      setEditedCode(extractedCode);
      setFirstQuery(true); // Set to true when first response is received
    } catch (error) {
      console.error("Error:", error);
      setSolution("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setProblem("");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editedCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => console.error("Failed to copy: ", err));
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const saveEditedCode = () => {
    setPureCode(editedCode);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      
      {/* ✨ Animated Heading (Disappears After First Solution) */}
      {!firstQuery && (
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          exit={{ opacity: 0, y: -20 }}
        >
          Hello Coder! 🚀 I am Your Coding AI Assistant - <span className="text-yellow-500">&lt;/DevMate&gt;</span>
        </motion.h1>
      )}

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

          {pureCode !== "⚠️ No code found in response" && (
            <div className="relative mt-4 bg-gray-900 p-2 rounded-lg border border-gray-700">
              
              <div className="absolute top-2 right-2 flex space-x-2">
                {isEditing ? (
                  <button onClick={saveEditedCode} className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg">
                    <Save size={18} />
                  </button>
                ) : (
                  <button onClick={toggleEditMode} className="p-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg">
                    <Edit size={18} />
                  </button>
                )}

                <button onClick={copyToClipboard} className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
                  {copied ? <ClipboardCheck size={18} /> : <Clipboard size={18} />}
                </button>
              </div>

              {isEditing ? (
                <textarea
                  value={editedCode}
                  onChange={(e) => setEditedCode(e.target.value)}
                  className="w-full p-3 font-mono text-sm bg-gray-800 text-white border border-yellow-400 rounded"
                  rows={Math.max(editedCode.split("\n").length, 5)}
                />
              ) : (
                <SyntaxHighlighter language="typescript" style={dracula} showLineNumbers>
                  {pureCode}
                </SyntaxHighlighter>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
