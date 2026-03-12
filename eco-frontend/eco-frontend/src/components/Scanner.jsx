import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Zap, 
  Camera, 
  FileText, 
  BarChart2,
  Lightbulb,
  CheckCircle2,
  TrendingUp,
  Leaf,
  Target,
  Info
} from "lucide-react";

function Scanner({ onScan, loading }) {
  const [mode, setMode] = useState("barcode");
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [currentFactIndex, setCurrentFactIndex] = useState(0);

  const sustainabilityFacts = [
    "🌍 Every product scan helps build a greener future",
    "♻️ Recycling 1 ton of plastic saves 5,774 kWh of energy",
    "🌱 Going eco-friendly reduces your carbon footprint by 40%",
    "💧 Sustainable products use 50% less water on average",
    "⚡ AI analysis takes less than 3 seconds per product",
    "🌿 Over 10,000 products analyzed by our community"
  ];

  const scanningTips = [
    { icon: Camera, text: "Clear, well-lit photos work best", color: "from-blue-500 to-cyan-500" },
    { icon: Target, text: "Focus on product labels or barcodes", color: "from-purple-500 to-pink-500" },
    { icon: Lightbulb, text: "Be specific in descriptions", color: "from-orange-500 to-yellow-500" }
  ];

  const exampleProducts = [
    "Plastic water bottle",
    "Organic cotton t-shirt",
    "Bamboo toothbrush",
    "Glass food container"
  ];

  // Rotate facts every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % sustainabilityFacts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sustainabilityFacts.length]);

  const handleSubmit = () => {
    if (mode === "description") {
      if (!description.trim()) return alert("Enter a product description");
      onScan({ mode, description });
    } else {
      if (!file) return alert("Select an image first");
      onScan({ mode, file });
    }
  };

  const getModeIcon = (m) => {
    if (m === "barcode") return <BarChart2 className="w-4 h-4" />;
    if (m === "image") return <Camera className="w-4 h-4" />;
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main Scanner Card */}
      <div className="glass p-4 sm:p-6 lg:p-10 rounded-3xl shadow-2xl border border-green-100/30 space-y-4 sm:space-y-6 bg-gradient-to-br from-white to-green-50/30">
        {/* Header with Icon */}
        <div className="flex items-center gap-3 sm:gap-4 mb-2">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl">
            <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900">Scan Product</h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Choose your scanning method</p>
          </div>
        </div>

        {/* Rotating Sustainability Fact */}
        <div className="glass bg-gradient-to-r from-green-50 to-emerald-50 p-3 sm:p-4 rounded-2xl border border-green-200/50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <p className="text-xs sm:text-sm font-bold text-gray-700 transition-all duration-500">
              {sustainabilityFacts[currentFactIndex]}
            </p>
          </div>
        </div>

        {/* MODE TABS */}
        <div className="flex gap-2">
          {["barcode", "image", "description"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 px-2 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 ${
                mode === m
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-200"
              }`}
            >
              {getModeIcon(m)}
              <span className="hidden sm:inline">
                {m === "barcode"
                  ? "Barcode"
                  : m === "image"
                    ? "Product Image"
                    : "Description"}
              </span>
              <span className="sm:hidden text-xs">
                {m === "barcode"
                  ? "Code"
                  : m === "image"
                    ? "Image"
                    : "Text"}
              </span>
            </button>
          ))}
        </div>

        {/* INPUT AREA */}
        {mode === "description" ? (
          <div className="space-y-3">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the product (e.g. plastic water bottle, 1L, disposable)"
              className="w-full h-32 sm:h-40 text-sm sm:text-base border-2 border-green-200 rounded-2xl p-3 sm:p-4 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
            {/* Example Products */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-bold text-gray-500">Try:</span>
              {exampleProducts.map((product, idx) => (
                <button
                  key={idx}
                  onClick={() => setDescription(product)}
                  className="text-xs bg-green-100 text-green-700 px-2.5 sm:px-3 py-1 rounded-full font-medium hover:bg-green-200 transition-colors"
                >
                  {product}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <label className="border-2 border-dashed border-green-300 rounded-2xl p-6 sm:p-8 lg:p-12 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 hover:bg-green-50/30 transition-all duration-300 group">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
              <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
            </div>
            <p className="text-gray-700 font-bold text-base sm:text-lg mb-1 sm:mb-2 text-center">
              {file ? file.name : "Select Image"}
            </p>
            <p className="text-gray-500 text-xs sm:text-sm text-center">
              {file ? "Click to change" : "Click to upload or drag & drop"}
            </p>
            {file && (
              <div className="mt-3 flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm font-bold">Ready to scan!</span>
              </div>
            )}
          </label>
        )}

        {/* ACTION BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3.5 sm:py-5 rounded-2xl font-black text-base sm:text-lg text-white transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 ${
            loading 
              ? "bg-gray-300 cursor-not-allowed" 
              : "bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-2xl hover:-translate-y-1 shadow-xl"
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm sm:text-base">Analyzing...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base">Launch AI Scan</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Tips Section */}
      <div className="glass p-4 sm:p-6 rounded-3xl shadow-xl border border-green-100/30 bg-gradient-to-br from-white to-blue-50/20">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
          <h4 className="font-black text-sm sm:text-base text-gray-900">Quick Tips for Best Results</h4>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {scanningTips.map((tip, idx) => (
            <div key={idx} className="flex items-center gap-2 sm:gap-3 group">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${tip.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <tip.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-700">{tip.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Mini Card */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="glass p-3 sm:p-4 rounded-2xl text-center border border-green-100/30 hover:shadow-lg transition-shadow">
          <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            &lt;3s
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-gray-600 mt-1">Scan Time</div>
        </div>
        <div className="glass p-3 sm:p-4 rounded-2xl text-center border border-green-100/30 hover:shadow-lg transition-shadow">
          <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            95%
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-gray-600 mt-1">Accuracy</div>
        </div>
        <div className="glass p-3 sm:p-4 rounded-2xl text-center border border-green-100/30 hover:shadow-lg transition-shadow">
          <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI
          </div>
          <div className="text-[10px] sm:text-xs font-bold text-gray-600 mt-1">Powered</div>
        </div>
      </div>
    </div>
  );
}

export default Scanner;
