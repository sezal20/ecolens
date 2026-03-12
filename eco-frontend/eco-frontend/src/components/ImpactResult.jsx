import React, { useMemo } from "react";
import { Leaf, Sparkles, Lightbulb } from "lucide-react";

// Static eco facts (kept outside component)
const ECO_FACTS = [
  "Recycling one glass bottle saves enough energy to light a bulb for four hours!",
  "It takes about 450 years for a single plastic bottle to break down in a landfill.",
  "Using a reusable bag can save over 22,000 plastic bags over a lifetime.",
  "Producing recycled paper uses 60% less energy than making paper from fresh trees.",
];

const ImpactResult = ({ result }) => {
  // Theme selection based on impact score
  const theme = useMemo(() => {
    if (!result) return null;

    const score = result?.impact_score ?? 0;

    if (score >= 80) {
      return {
        color: "text-green-600",
        bg: "bg-green-50",
        border: "border-green-200",
        bar: "bg-green-500",
      };
    }

    if (score >= 50) {
      return {
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-100",
        bar: "bg-amber-500",
      };
    }

    return {
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100",
      bar: "bg-red-500",
    };
  }, [result]);

  if (!result) return null;

  // Deterministic eco-fact selection
  const seed = result?.barcode ? String(result.barcode).length : 0;
  const factIndex = seed % ECO_FACTS.length;
  const randomFact = ECO_FACTS[factIndex];

  return (
    <div className="space-y-4 sm:space-y-6 text-left animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="border-b pb-3 sm:pb-4">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={12} className="text-purple-500 sm:w-3.5 sm:h-3.5" />
          <p className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-widest">
            AI Environmental Insights
          </p>
        </div>
        <h2 className="text-lg sm:text-2xl font-black text-gray-800 leading-tight">
          {result?.name || "Unknown Product"}
        </h2>
      </div>

      {/* Score Card */}
      <div
        className={`${theme.bg} p-6 sm:p-8 rounded-3xl border ${theme.border} border-2 flex flex-col items-center shadow-sm relative overflow-hidden`}
      >
        <Leaf
          size={100}
          className="absolute -right-4 -bottom-4 opacity-10 rotate-12 sm:w-[120px] sm:h-[120px]"
        />
        <span className={`text-5xl sm:text-6xl font-black ${theme.color} relative z-10`}>
          {result?.impact_score ?? 0}
        </span>
        <p className="text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-widest mt-1 relative z-10">
          Sustainability Grade
        </p>
      </div>

      {/* AI Analysis */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1.5 h-full ${theme.bar}`} />
        <h4 className="font-bold text-gray-400 text-[9px] sm:text-[10px] uppercase mb-2 sm:mb-3 flex items-center gap-2 tracking-widest">
          <span className={`w-2 h-2 ${theme.bar} rounded-full animate-pulse`} />
          AI Expert Analysis
        </h4>
        <p className="text-gray-700 text-sm sm:text-lg leading-relaxed italic font-medium">
          "
          {result?.ai_description ||
            "Analyzing the ingredients to provide a human-friendly story..."}
          "
        </p>
      </div>

      {/* Eco Fact */}
      <div className="bg-blue-50/50 p-4 sm:p-5 rounded-3xl border border-blue-100 flex gap-3 sm:gap-4 items-start">
        <div className="bg-blue-500 p-1.5 sm:p-2 rounded-xl text-white flex-shrink-0">
          <Lightbulb size={16} className="sm:w-5 sm:h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-bold text-blue-900 text-xs sm:text-sm">Did you know?</h5>
          <p className="text-blue-800/80 text-xs sm:text-sm leading-snug mt-1 font-medium">
            {randomFact}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImpactResult;
