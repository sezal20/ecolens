import React, { useState } from "react";

const DescriptionScanner = ({ onResult }) => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeText = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/analyze-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: text,
        }),
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      onResult(data); // send result to parent
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold mb-4 text-gray-700">Describe Product</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Example: I use bamboo toothbrush"
        className="w-full h-32 p-4 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
      />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button
        onClick={analyzeText}
        disabled={loading}
        className="mt-4 w-full bg-green-600 text-white py-3 rounded-2xl font-bold hover:bg-green-700 disabled:bg-gray-300"
      >
        {loading ? "Analyzing..." : "Analyze Description"}
      </button>
    </div>
  );
};

export default DescriptionScanner;
