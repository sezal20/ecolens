import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  Package,
  Leaf,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Clock,
  Target,
  ArrowUpDown,
  Trash2,
} from "lucide-react";

const HistoryTable = ({ history = [], onDelete }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [sortBy, setSortBy] = useState("date"); // date, score, co2
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  const [viewMode, setViewMode] = useState("table"); // table, cards

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get rating letter based on score
  const getRating = (score) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  // Get rating color
  const getRatingColor = (score) => {
    if (score >= 80) return "from-green-500 to-emerald-600";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-rose-600";
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (history.length === 0) return null;

    const totalScans = history.length;
    const avgScore = Math.round(
      history.reduce((sum, item) => sum + (item.impact_score || 0), 0) / totalScans
    );
    const totalCO2 = history
      .reduce((sum, item) => sum + (item.co2_footprint || 0), 0)
      .toFixed(2);
    const ecoFriendly = history.filter((item) => (item.impact_score || 0) >= 80).length;
    const ecoPercentage = Math.round((ecoFriendly / totalScans) * 100);

    return { totalScans, avgScore, totalCO2, ecoFriendly, ecoPercentage };
  }, [history]);

  // Filter and sort history
  const filteredHistory = useMemo(() => {
    let filtered = [...history];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter((item) =>
        (item.product || item.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    // Rating filter
    if (filterRating !== "all") {
      if (filterRating === "eco") {
        filtered = filtered.filter((item) => (item.impact_score || 0) >= 80);
      } else if (filterRating === "moderate") {
        filtered = filtered.filter(
          (item) => (item.impact_score || 0) >= 50 && (item.impact_score || 0) < 80
        );
      } else if (filterRating === "poor") {
        filtered = filtered.filter((item) => (item.impact_score || 0) < 50);
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "score") {
        comparison = (a.impact_score || 0) - (b.impact_score || 0);
      } else if (sortBy === "co2") {
        comparison = (a.co2_footprint || 0) - (b.co2_footprint || 0);
      } else {
        // date
        const dateA = new Date(a.created_at || 0);
        const dateB = new Date(b.created_at || 0);
        comparison = dateA - dateB;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [history, searchQuery, filterRating, sortBy, sortOrder]);

  // Toggle sort
  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  // Export data
  const handleExport = () => {
    const csvContent =
      "Product,Impact Score,CO2 Footprint,Rating,Date\n" +
      history
        .map(
          (item) =>
            `"${item.product || item.name || "Unknown"}",${item.impact_score || 0},${item.co2_footprint || 0},"${getRating(item.impact_score || 0)}","${formatDate(item.created_at)}"`
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ecolens-history-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Statistics Summary */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass p-4 sm:p-6 rounded-3xl shadow-xl border border-green-100/30 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-600">Total Scans</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">{stats.totalScans}</div>
          </div>

          <div className="glass p-4 sm:p-6 rounded-3xl shadow-xl border border-green-100/30 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-600">Avg Score</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">{stats.avgScore}%</div>
          </div>

          <div className="glass p-4 sm:p-6 rounded-3xl shadow-xl border border-green-100/30 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-600">Eco-Friendly</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-gray-900">{stats.ecoPercentage}%</div>
          </div>

          <div className="glass p-4 sm:p-6 rounded-3xl shadow-xl border border-green-100/30 hover:shadow-2xl transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-gray-600">Total CO₂</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-gray-900">{stats.totalCO2} kg</div>
          </div>
        </div>
      )}

      {/* Main History Section */}
      <div className="glass p-4 sm:p-6 lg:p-8 rounded-3xl sm:rounded-4xl shadow-2xl border border-green-100/30">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-1 sm:mb-2">
              Scan History
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              {filteredHistory.length} of {history.length} scans
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={() => setViewMode(viewMode === "table" ? "cards" : "table")}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">
                {viewMode === "table" ? "Card View" : "Table View"}
              </span>
              <span className="sm:hidden">
                {viewMode === "table" ? "Cards" : "Table"}
              </span>
            </button>
            <button
              onClick={handleExport}
              disabled={history.length === 0}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Filter by Rating */}
          <div className="relative sm:w-48">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer font-bold"
            >
              <option value="all">All Products</option>
              <option value="eco">Eco-Friendly (80+)</option>
              <option value="moderate">Moderate (50-79)</option>
              <option value="poor">Poor (&lt;50)</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {filteredHistory.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h4 className="text-xl font-black text-gray-900 mb-2">
              {history.length === 0 ? "No Scans Yet" : "No Results Found"}
            </h4>
            <p className="text-gray-600 mb-6">
              {history.length === 0
                ? "Start scanning products to build your history"
                : "Try adjusting your search or filters"}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterRating("all");
                }}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : viewMode === "table" ? (
          // Table View (Desktop)
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="pb-4 text-left">
                    <button
                      onClick={() => toggleSort("name")}
                      className="flex items-center gap-2 font-bold text-gray-700 hover:text-green-600 transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      Product Name
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="pb-4 text-center">
                    <button
                      onClick={() => toggleSort("score")}
                      className="flex items-center gap-2 font-bold text-gray-700 hover:text-green-600 transition-colors mx-auto"
                    >
                      <Target className="w-4 h-4" />
                      Eco Score
                      {sortBy === "score" &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </button>
                  </th>
                  <th className="pb-4 text-center">
                    <span className="flex items-center gap-2 font-bold text-gray-700 justify-center">
                      Rating
                    </span>
                  </th>
                  <th className="pb-4 text-center">
                    <button
                      onClick={() => toggleSort("co2")}
                      className="flex items-center gap-2 font-bold text-gray-700 hover:text-green-600 transition-colors mx-auto"
                    >
                      <TrendingDown className="w-4 h-4" />
                      CO₂ Impact
                      {sortBy === "co2" &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </button>
                  </th>
                  <th className="pb-4 text-right">
                    <button
                      onClick={() => toggleSort("date")}
                      className="flex items-center gap-2 font-bold text-gray-700 hover:text-green-600 transition-colors ml-auto"
                    >
                      <Clock className="w-4 h-4" />
                      Date
                      {sortBy === "date" &&
                        (sortOrder === "asc" ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </button>
                  </th>
                  <th className="pb-4 text-center">
                    <span className="font-bold text-gray-700">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredHistory.map((item, index) => {
                  const score = item.impact_score || 0;
                  const rating = getRating(score);
                  const ratingColor = getRatingColor(score);

                  return (
                    <tr
                      key={item.id || index}
                      className="hover:bg-green-50/50 transition-colors group"
                    >
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 bg-gradient-to-r ${ratingColor} rounded-xl flex items-center justify-center`}
                          >
                            <Package className="w-5 h-5 text-white" />
                          </div>
                          <span className="font-bold text-gray-900">
                            {item.product || item.name || "Unknown Product"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="text-2xl font-black text-gray-900">
                            {score}
                          </div>
                          <span className="text-sm text-gray-500">/100</span>
                        </div>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden max-w-[100px] mx-auto">
                          <div
                            className={`h-full bg-gradient-to-r ${ratingColor} transition-all duration-500`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${ratingColor} rounded-xl text-white font-black text-lg shadow-lg`}
                        >
                          {rating}
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <span className="font-mono font-bold text-gray-700">
                          {(item.co2_footprint || 0).toFixed(2)} kg
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(item.created_at)}
                        </div>
                      </td>
                      <td className="py-4 text-center">
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors group-hover:opacity-100 opacity-60"
                          title="Delete scan"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* Card View (Mobile & Optional Desktop) */}
        <div
          className={`${viewMode === "cards" ? "block" : "block lg:hidden"} space-y-4`}
        >
          {filteredHistory.map((item, index) => {
            const score = item.impact_score || 0;
            const rating = getRating(score);
            const ratingColor = getRatingColor(score);

            return (
              <div
                key={item.id || index}
                className="glass p-4 sm:p-6 rounded-3xl shadow-lg hover:shadow-xl transition-all border border-gray-100 relative"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${ratingColor} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                    >
                      <span className="text-white font-black text-lg sm:text-xl">{rating}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-base sm:text-lg text-gray-900 mb-1 truncate">
                        {item.product || item.name || "Unknown Product"}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {score >= 80 ? (
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    )}
                    <button
                      onClick={() => onDelete(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete scan"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 font-bold mb-1">
                      Eco Score
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl sm:text-2xl font-black text-gray-900">{score}</span>
                      <span className="text-sm text-gray-500">/100</span>
                    </div>
                    <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${ratingColor} transition-all duration-500`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-600 font-bold mb-1">
                      CO₂ Impact
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-gray-900 font-mono">
                      {(item.co2_footprint || 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 font-bold">kg CO₂</div>
                  </div>
                </div>

                {item.recommendation && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {item.recommendation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
