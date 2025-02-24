'use client';

import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula , a11yDark} from "react-syntax-highlighter/dist/esm/styles/prism";


export default function Home() {
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [loading, setLoading] = useState(false);
  

  const handleSolve = async () => {
    setLoading(true);
    setSolution("");
  
    try {
      console.log("Request Method: POST");
      console.log("Problem Value:", problem);
      const res = await fetch("/api/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem }),
      });
    
      const text = await res.text(); 
      console.log("Raw response:", text);
  
      const data = JSON.parse(text);
      setSolution(data.solution);
    } catch (error) {
      console.error("Error:", error);
      setSolution("An error occurred. Please try again.");
    }
  
    setLoading(false);
    setProblem("");
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
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSolve();
          }
        }}
      />
      <button
        className="mt-4 bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSolve}
        disabled={loading}
      >
        {loading ? "Writing the code for you..." : "Generate Solution"}
      </button>
      <div className="w-75 mt-2">
      {solution && (
        <SyntaxHighlighter language="javascript" style={a11yDark}>
          {solution}
        </SyntaxHighlighter>
      )}
      </div>
    </div>
  );
}
