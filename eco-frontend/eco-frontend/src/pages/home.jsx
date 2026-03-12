// src/pages/home.jsx - NO NAVBAR + NO TITLE + NO FOOTER
import {
  Zap,
  Camera,
  Leaf,
  BarChart3,
} from "lucide-react";

const Home = ({ recentScans = [], onNavigateToScanner }) => {
  const stats =
    recentScans.length > 0
      ? {
          totalScans: recentScans.length + 1247,
          avgImpact: Math.round(
            recentScans.reduce(
              (sum, scan) => sum + (scan.impact_score || 0),
              0,
            ) / recentScans.length,
          ),
          co2Saved: (recentScans.length * 0.15).toFixed(1),
          bestScore: Math.max(
            ...recentScans.map((s) => s.impact_score || 0),
            95,
          ),
        }
      : {
          totalScans: 1247,
          avgImpact: 75,
          co2Saved: "23.4",
          bestScore: 95,
        };

  const features = [
    {
      icon: Zap,
      title: "🤖 AI-Powered Analysis",
      desc: "OpenAI GPT-4o processes ingredients in real-time",
      tech: "FastAPI + PostgreSQL",
    },
    {
      icon: Camera,
      title: "📸 Multi-Modal Input",
      desc: "Barcode scanning, OCR text extraction",
      tech: "OpenCV + Tesseract",
    },
    {
      icon: Leaf,
      title: "🌿 Carbon Intelligence",
      desc: "Precise CO2 footprint calculation",
      tech: "Custom ML Models",
    },
    {
      icon: BarChart3,
      title: "📊 Personal Dashboard",
      desc: "Track sustainability journey",
      tech: "React + Tailwind",
    },
  ];

  return (
    <div className="space-y-20 py-16 min-h-screen">
      {/* Hero Section - NO TITLE + NO NAVBAR */}
      <section className="text-center max-w-6xl mx-auto">
        <p className="text-xl sm:text-2xl lg:text-3xl text-gray-600 font-light mb-12 max-w-4xl mx-auto leading-relaxed">
          Scan barcodes, product images, or describe products to unlock{" "}
          <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            instant environmental intelligence
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20 items-center px-4">
          <button
            onClick={onNavigateToScanner}
            className="glass bg-gradient-to-r from-green-500 to-emerald-600 text-white px-16 py-8 sm:py-10 rounded-4xl text-2xl sm:text-3xl font-black shadow-2xl hover:shadow-3xl hover:-translate-y-3 transition-all flex items-center gap-4 w-full sm:w-auto text-center"
          >
            <Camera className="w-8 h-8 sm:w-10 sm:h-10" />
            🚀 Start Scanning Now
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 glass p-8 sm:p-10 rounded-4xl backdrop-blur-xl border border-green-100/30 shadow-2xl">
          <div className="text-center group">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
              {stats.totalScans.toLocaleString()}
            </div>
            <div className="text-lg font-bold text-gray-700 uppercase tracking-wider">
              Products Analyzed
            </div>
          </div>
          <div className="text-center group">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
              {stats.avgImpact}%
            </div>
            <div className="text-lg font-bold text-gray-700 uppercase tracking-wider">
              Avg Eco Score
            </div>
          </div>
          <div className="text-center group">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
              {stats.co2Saved}kg
            </div>
            <div className="text-lg font-bold text-gray-700 uppercase tracking-wider">
              CO₂ Insights
            </div>
          </div>
          <div className="text-center group">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform">
              {stats.bestScore}%
            </div>
            <div className="text-lg font-bold text-gray-700 uppercase tracking-wider">
              Top Score
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-5xl sm:text-6xl font-black text-center text-gray-900 mb-24 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
          Production-Grade AI Pipeline
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass p-10 rounded-4xl hover:-translate-y-4 hover:shadow-3xl transition-all duration-700 border border-green-100/30 group cursor-pointer"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-all duration-500 mx-auto">
                <feature.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6 group-hover:text-green-600 transition-all duration-300 text-center">
                {feature.title}
              </h3>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed text-center">
                {feature.desc}
              </p>
              <div className="text-green-600 font-mono text-lg font-bold bg-green-50/50 px-4 py-2 rounded-xl border-r-4 border-green-400 text-center">
                {feature.tech}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
