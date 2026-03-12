import React, { useState, useMemo } from "react";
import { 
  User, BarChart3, TrendingUp, Award, Activity, 
  Leaf, Target, Calendar, Zap, Star, Trophy, 
  Clock, TrendingDown, ChevronRight, Lightbulb, LogOut
} from "lucide-react";

const Dash = ({ history = [], user = null, onNavigateToScanner, onLogout }) => {
  const [view, setView] = useState("week");

  const formatDate = (createdAt) => {
    if (!createdAt) return "No Date";
    return new Date(createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ✅ Compute chart data WITHOUT useEffect
  const chartData = useMemo(() => {
    const now = new Date();
    let data = [];

    if (view === "day") {
      for (let i = 23; i >= 0; i--) {
        const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
        const startOfHour = new Date(hour);
        startOfHour.setMinutes(0, 0, 0);
        const endOfHour = new Date(hour);
        endOfHour.setMinutes(59, 59, 999);

        const scansThisHour = history.filter((h) => {
          if (!h.created_at) return false;
          const scanTime = new Date(h.created_at);
          return scanTime >= startOfHour && scanTime <= endOfHour;
        });

        data.push({
          label: `${hour.getHours()}:00`,
          total: scansThisHour.length,
          ecoFriendly: scansThisHour.filter((s) => (s.impact_score || 0) >= 80)
            .length,
          notEco: scansThisHour.filter((s) => (s.impact_score || 0) < 80)
            .length,
        });
      }
    } else if (view === "week") {
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      for (let i = 6; i >= 0; i--) {
        const targetDay = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);

        const scansThisDay = history.filter((h) => {
          if (!h.created_at) return false;
          const scanTime = new Date(h.created_at);

          return (
            scanTime.getDate() === targetDay.getDate() &&
            scanTime.getMonth() === targetDay.getMonth() &&
            scanTime.getFullYear() === targetDay.getFullYear()
          );
        });

        data.push({
          label: dayNames[targetDay.getDay()],
          total: scansThisDay.length,
          ecoFriendly: scansThisDay.filter((s) => (s.impact_score || 0) >= 80)
            .length,
          notEco: scansThisDay.filter((s) => (s.impact_score || 0) < 80).length,
        });
      }
    } else {
      for (let i = 0; i < 6; i++) {
        const scansThisWeek = history.slice(i * 7, (i + 1) * 7);

        data.push({
          label: `Week ${i + 1}`,
          total: scansThisWeek.length,
          ecoFriendly: scansThisWeek.filter((s) => (s.impact_score || 0) >= 80)
            .length,
          notEco: scansThisWeek.filter((s) => (s.impact_score || 0) < 80)
            .length,
        });
      }
    }

    return data;
  }, [history, view]);

  const totalEco = chartData.reduce((sum, d) => sum + d.ecoFriendly, 0);
  const totalNotEco = chartData.reduce((sum, d) => sum + d.notEco, 0);
  const totalScans = chartData.reduce((sum, d) => sum + d.total, 0);

  const ecoPercentage =
    totalScans > 0 ? Math.round((totalEco / totalScans) * 100) : 0;

  // Calculate additional metrics
  const avgEcoScore = history.length > 0
    ? Math.round(history.reduce((sum, item) => sum + (item.impact_score || 0), 0) / history.length)
    : 0;

  const totalCO2Impact = history.reduce((sum, item) => sum + (item.co2_footprint || 0), 0).toFixed(2);

  const recentTrend = useMemo(() => {
    if (history.length < 2) return "stable";
    const recent = history.slice(0, 5);
    const older = history.slice(5, 10);
    const recentAvg = recent.reduce((sum, item) => sum + (item.impact_score || 0), 0) / recent.length;
    const olderAvg = older.length > 0 ? older.reduce((sum, item) => sum + (item.impact_score || 0), 0) / older.length : recentAvg;
    return recentAvg > olderAvg ? "improving" : recentAvg < olderAvg ? "declining" : "stable";
  }, [history]);

  // Achievements calculation
  const achievements = [
    { 
      id: 1, 
      title: "First Scan", 
      icon: Zap, 
      unlocked: history.length >= 1,
      description: "Complete your first product scan"
    },
    { 
      id: 2, 
      title: "Eco Warrior", 
      icon: Leaf, 
      unlocked: totalEco >= 10,
      description: "Scan 10 eco-friendly products"
    },
    { 
      id: 3, 
      title: "Century Club", 
      icon: Trophy, 
      unlocked: history.length >= 100,
      description: "Complete 100 scans"
    },
    { 
      id: 4, 
      title: "Green Champion", 
      icon: Award, 
      unlocked: ecoPercentage >= 80,
      description: "Maintain 80%+ eco-friendly choices"
    },
  ];

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* User Profile Section */}
      {user && (
        <div className="glass p-4 sm:p-6 lg:p-8 rounded-3xl lg:rounded-4xl shadow-2xl border border-green-100/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-xl">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-1 truncate">{user.name}</h2>
              <p className="text-base sm:text-lg text-gray-600 mb-2 truncate">{user.email}</p>
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                <span className="px-2.5 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                  {user.total_scans || history.length} Total Scans
                </span>
                <span className="px-2.5 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold">
                  Avg Score: {user.avg_eco_score || ecoPercentage}%
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl transition-all duration-300 hover:shadow-lg font-bold group text-sm sm:text-base w-full sm:w-auto justify-center"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Toggle */}
      <div className="flex gap-2 sm:gap-3">
        {["day", "week", "month"].map((period) => (
          <button
            key={period}
            onClick={() => setView(period)}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-bold transition-all ${
              view === period ? "bg-green-600 text-white shadow-lg" : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {period.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard icon={<BarChart3 />} title="Total" value={history.length} />
        <StatCard icon={<TrendingUp />} title="Eco" value={totalEco} color="green" />
        <StatCard icon={<Activity />} title="Not Eco" value={totalNotEco} color="red" />
        <StatCard icon={<Award />} title="Score" value={`${ecoPercentage}%`} color="blue" />
      </div>

      {/* Environmental Impact Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="glass p-4 sm:p-6 rounded-3xl shadow-xl border border-green-100/30 hover:shadow-2xl transition-all">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
              recentTrend === "improving" ? "bg-green-100 text-green-700" :
              recentTrend === "declining" ? "bg-red-100 text-red-700" :
              "bg-gray-100 text-gray-700"
            }`}>
              {recentTrend === "improving" ? "↑ Improving" : recentTrend === "declining" ? "↓ Declining" : "→ Stable"}
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">{avgEcoScore}%</div>
          <div className="text-xs sm:text-sm text-gray-600 font-bold">Average Eco Score</div>
          <div className="mt-3 sm:mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
              style={{ width: `${avgEcoScore}%` }}
            ></div>
          </div>
        </div>

        <div className="glass p-4 sm:p-6 rounded-3xl shadow-xl border border-blue-100/30 hover:shadow-2xl transition-all">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-blue-600 bg-blue-50 px-2.5 sm:px-3 py-1 rounded-full">Lifetime</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">{totalCO2Impact} kg</div>
          <div className="text-xs sm:text-sm text-gray-600 font-bold">Total CO₂ Impact Analyzed</div>
          <div className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500">
            Equivalent to {(totalCO2Impact / 0.4).toFixed(0)} miles driven
          </div>
        </div>

        <div className="glass p-4 sm:p-6 rounded-3xl shadow-xl border border-purple-100/30 hover:shadow-2xl transition-all sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-purple-600 bg-purple-50 px-2.5 sm:px-3 py-1 rounded-full">This {view}</span>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">{totalScans}</div>
          <div className="text-xs sm:text-sm text-gray-600 font-bold">Scans Completed</div>
          <div className="mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-500">
            {totalEco} eco-friendly • {totalNotEco} not eco-friendly
          </div>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="glass p-4 sm:p-6 lg:p-8 rounded-3xl lg:rounded-4xl shadow-2xl border border-amber-100/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-1 sm:mb-2">Achievements</h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600">You've unlocked {unlockedCount} out of {achievements.length} badges</p>
          </div>
          <div className="flex items-center gap-2 bg-amber-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600" />
            <span className="font-black text-sm sm:text-base text-amber-700">{unlockedCount}/{achievements.length}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id}
              className={`p-3 sm:p-4 lg:p-6 rounded-2xl border-2 transition-all duration-300 ${
                achievement.unlocked 
                  ? "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 shadow-lg hover:shadow-xl hover:-translate-y-1" 
                  : "bg-gray-50 border-gray-200 opacity-60 grayscale"
              }`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center mb-2 sm:mb-3 ${
                achievement.unlocked ? "bg-gradient-to-br from-amber-500 to-yellow-600" : "bg-gray-300"
              }`}>
                <achievement.icon className={`w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 ${achievement.unlocked ? "text-white" : "text-gray-500"}`} />
              </div>
              <h4 className="font-black text-xs sm:text-sm lg:text-base text-gray-900 mb-1">{achievement.title}</h4>
              <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">{achievement.description}</p>
              {achievement.unlocked && (
                <div className="mt-2 sm:mt-3 flex items-center gap-1 text-[10px] sm:text-xs font-bold text-amber-700">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  Unlocked
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        <QuickActionCard 
          icon={<Zap className="w-6 h-6" />}
          title="Scan New Product"
          description="Start analyzing another product"
          color="green"
          onClick={onNavigateToScanner}
        />
        <QuickActionCard 
          icon={<Target className="w-6 h-6" />}
          title="Set Eco Goal"
          description="Target 90% eco-friendly choices"
          color="blue"
        />
        <QuickActionCard 
          icon={<Lightbulb className="w-6 h-6" />}
          title="View Insights"
          description="Get personalized recommendations"
          color="purple"
        />
      </div>

      {/* Chart Section */}
      <div className="glass p-4 sm:p-6 lg:p-8 rounded-3xl lg:rounded-4xl shadow-2xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-1 sm:mb-2">Search Analytics</h3>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600">Track your product scanning patterns over time</p>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-6 items-center text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded"></div>
              <span className="font-bold text-gray-700">Eco-Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded"></div>
              <span className="font-bold text-gray-700">Not Eco</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="relative">
          {totalScans === 0 ? (
            <div className="h-80 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl">
              <div className="text-center text-gray-400">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-bold mb-2">No data yet</p>
                <p className="text-sm">Start scanning products to see analytics</p>
              </div>
            </div>
          ) : (
            <div className="h-80 flex items-end gap-2 sm:gap-3 lg:gap-4 border-l-2 border-b-2 border-gray-300 pl-4 pb-4 pr-2 relative">
              {/* Y-axis scale markers */}
              <div className="absolute left-0 top-0 bottom-12 flex flex-col justify-between text-xs text-gray-500 -ml-8">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-right">{Math.round((4 - i) * 25)}%</span>
                ))}
              </div>
              
              {chartData.map((item, idx) => {
                const maxValue = Math.max(...chartData.map(d => d.total), 1);
                // Calculate percentage heights based on actual values
                const ecoHeight = maxValue > 0 ? (item.ecoFriendly / maxValue) * 100 : 0;
                const notEcoHeight = maxValue > 0 ? (item.notEco / maxValue) * 100 : 0;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center group min-w-0">
                    {/* Bar Container */}
                    <div className="w-full flex flex-col justify-end h-64 mb-3 relative">
                      {item.total > 0 ? (
                        <>
                          {/* Not eco-friendly section (bottom) */}
                          {item.notEco > 0 && (
                            <div 
                              className="w-full bg-gradient-to-t from-red-500 to-red-400 transition-all duration-500 hover:from-red-600 hover:to-red-500 relative group/bar rounded-b-lg"
                              style={{ height: `${notEcoHeight}%`, minHeight: item.notEco > 0 ? '8px' : '0' }}
                            >
                              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-red-700/80 px-2 py-1 rounded">
                                {item.notEco}
                              </span>
                            </div>
                          )}
                          {/* Eco-friendly section (top) */}
                          {item.ecoFriendly > 0 && (
                            <div 
                              className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg transition-all duration-500 hover:from-green-600 hover:to-green-500 relative group/bar"
                              style={{ height: `${ecoHeight}%`, minHeight: item.ecoFriendly > 0 ? '8px' : '0' }}
                            >
                              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap bg-green-700/80 px-2 py-1 rounded">
                                {item.ecoFriendly}
                              </span>
                            </div>
                          )}
                          {/* Total count badge */}
                          <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-lg z-10">
                            {item.total}
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-1 bg-gray-200 rounded"></div>
                      )}
                    </div>
                    {/* Label */}
                    <span className="text-xs font-bold text-gray-600 text-center truncate w-full px-1">{item.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-8 pt-6 border-t border-gray-200 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-black text-gray-900">{totalScans}</div>
            <div className="text-sm text-gray-600 font-bold mt-1">Total Scans</div>
          </div>
          <div>
            <div className="text-3xl font-black text-green-600">{totalEco}</div>
            <div className="text-sm text-gray-600 font-bold mt-1">Eco-Friendly</div>
          </div>
          <div>
            <div className="text-3xl font-black text-red-600">{totalNotEco}</div>
            <div className="text-sm text-gray-600 font-bold mt-1">Not Eco-Friendly</div>
          </div>
        </div>
      </div>

      {/* Top Products & Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Top Rated Products */}
        <div className="glass p-6 lg:p-8 rounded-4xl shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl lg:text-2xl font-black text-gray-900">Top Rated Products</h3>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <div className="space-y-3">
            {history
              .sort((a, b) => (b.impact_score || 0) - (a.impact_score || 0))
              .slice(0, 5)
              .map((scan, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between p-4 bg-white/50 rounded-2xl hover:bg-white/80 transition-all group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-sm ${
                      (scan.impact_score || 0) >= 80 ? "bg-green-500" : 
                      (scan.impact_score || 0) >= 50 ? "bg-yellow-500" : "bg-red-500"
                    }`}>
                      {scan.rating || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 text-sm truncate">
                        {scan.product || `Product ${i + 1}`}
                      </div>
                      <div className="text-xs text-gray-500">{formatDate(scan.created_at)}</div>
                    </div>
                  </div>
                  <div className="text-xl font-black text-gray-900 ml-2">
                    {scan.impact_score || 0}%
                  </div>
                </div>
              ))}
            {history.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No products scanned yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass p-6 lg:p-8 rounded-4xl shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl lg:text-2xl font-black text-gray-900">Recent Activity</h3>
            <Clock className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            {history.slice(0, 5).map((scan, i) => (
              <div 
                key={i} 
                className="flex items-start gap-3 p-4 bg-white/50 rounded-2xl hover:bg-white/80 transition-all"
              >
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  (scan.impact_score || 0) >= 80 ? "bg-green-500" : "bg-red-500"
                }`}></div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <p className="font-bold text-sm text-gray-900 truncate">
                      Scanned {scan.product || "a product"}
                    </p>
                    <span className={`text-xs font-black px-2 py-1 rounded-full whitespace-nowrap ${
                      (scan.impact_score || 0) >= 80 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {scan.impact_score || 0}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{formatDate(scan.created_at)}</p>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, color = "green" }) => {
  const colorClasses = {
    green: "bg-green-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
  };

  return (
    <div className="glass p-4 lg:p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4">
        <div className={`w-8 h-8 lg:w-10 lg:h-10 ${colorClasses[color]} rounded-xl flex items-center justify-center text-white`}>
          {icon}
        </div>
        <p className="text-xs lg:text-sm font-bold uppercase">{title}</p>
      </div>
      <div className="text-2xl lg:text-3xl font-black">{value}</div>
    </div>
  );
};

const QuickActionCard = ({ icon, title, description, color, onClick }) => {
  const colorClasses = {
    green: "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
    blue: "from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700",
    purple: "from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700",
  };

  return (
    <div 
      onClick={onClick}
      className="glass p-6 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border border-gray-100/50"
    >
      <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <div className="text-white">{icon}</div>
      </div>
      <h4 className="text-lg font-black text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <div className="flex items-center text-sm font-bold text-gray-700 group-hover:text-gray-900">
        <span>Learn more</span>
        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default Dash;
