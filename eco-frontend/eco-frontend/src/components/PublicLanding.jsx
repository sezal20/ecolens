// src/components/PublicLanding.jsx - RENAMED FROM Landing.jsx
import { Zap, Camera, Leaf, BarChart3, Shield } from "lucide-react";

const PublicLanding = ({ onGetStarted }) => {
  const features = [
    {
      icon: Zap,
      title: "AI Analysis",
      desc: "Instant ingredient scanning with GPT-4o",
    },
    {
      icon: Camera,
      title: "Multi-Modal",
      desc: "Barcode, image, or text input",
    },
    {
      icon: Leaf,
      title: "Eco Scores",
      desc: "Carbon footprint & sustainability rating",
    },
    {
      icon: BarChart3,
      title: "Track Progress",
      desc: "Personal sustainability dashboard",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      <section className="pt-20 pb-32 max-w-6xl mx-auto px-6">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-green-900 via-emerald-800 to-teal-900 bg-clip-text text-transparent mb-8 leading-tight">
            EcoLens AI
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 font-light mb-12 max-w-4xl mx-auto leading-relaxed">
            Scan any product to unlock{" "}
            <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              instant environmental insights
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20">
            <button
              onClick={onGetStarted}
              className="glass bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-6 rounded-3xl text-xl font-black shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300 flex items-center gap-3"
            >
              <Zap className="w-6 h-6" />
              Get Started Free
            </button>
            <button className="glass px-12 py-6 rounded-3xl text-xl font-bold border-2 border-green-200 hover:bg-green-50 transition-all duration-300 flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-600" />
              How it works
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 glass p-8 rounded-4xl backdrop-blur-xl border border-green-100/30 shadow-2xl max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-black text-green-600 mb-2">1M+</div>
              <div className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                Products Scanned
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-emerald-600 mb-2">
                95%
              </div>
              <div className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                Accuracy
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-blue-600 mb-2">50K+</div>
              <div className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                Active Users
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-purple-600 mb-2">
                24/7
              </div>
              <div className="text-sm font-bold text-gray-600 uppercase tracking-wider">
                Live Analysis
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-5xl font-black text-center text-gray-900 mb-20 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
          Everything you need
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="glass p-8 rounded-3xl hover:-translate-y-3 hover:shadow-2xl transition-all duration-500 border border-green-100/30 group"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform mx-auto">
                <feature.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white/50 backdrop-blur-xl border-t border-green-100/30 py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-black text-gray-900 mb-6">
            Ready to scan smarter?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands making sustainable choices every day.
          </p>
          <button
            onClick={onGetStarted}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-6 rounded-3xl text-xl font-black shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300"
          >
            Start Scanning Free
          </button>
        </div>
      </section>
    </div>
  );
};

export default PublicLanding;
