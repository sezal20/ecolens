import React, { useState, useEffect } from "react";
import {
  Home as HomeIcon,
  Camera,
  BarChart3,
  LayoutDashboard,
  User,
  Leaf,
  Info,
  LogIn,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import Scanner from "./components/Scanner";
import ImpactResult from "./components/ImpactResult";
import HistoryTable from "./components/HistoryTable";
import Home from "./pages/home";
import Auth from "./components/Auth";
import PublicLanding from "./components/PublicLanding";
import Dash from "./pages/dash";
import About from "./pages/About";
import Footer from "./components/Footer";
import ToastContainer from "./components/Toast";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

import {
  getHistory,
  scanBarcode,
  scanImage,
  scanText,
  deleteHistoryItem,
} from "./api";

function App() {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("landing");
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    itemId: null,
    itemName: "",
  });

  // Load history when user logs in
  useEffect(() => {
    if (user) {
      loadData();
      // Navigate to home after login
      if (activePage === "landing") {
        setActivePage("home");
      }
    }
  }, [user]);

  const loadData = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      console.error("Database connection error:", error);
    }
  };

  const showToast = (type, message, duration = 4000) => {
    const id = crypto.randomUUID();
    const newToast = { id, type, message, duration };
    setToasts((prev) => [...prev, newToast]);
  };

  const closeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleLogin = async (formData) => {
    const isSignup = formData.name && formData.name.trim() !== "";

    const userProfile = {
      id: crypto.randomUUID(),
      email: formData.email,
      name: formData.name || formData.email.split("@")[0],
      created_at: new Date().toISOString(),
      total_scans: 0,
      avg_eco_score: 75,
    };

    setUser(userProfile);
    setShowLoginPrompt(false);

    // Show success toast
    showToast(
      "success",
      isSignup
        ? `Welcome to EcoLens AI, ${userProfile.name}! 🌱`
        : `Welcome back, ${userProfile.name}! 🎉`,
    );
  };

  const handleLogout = () => {
    const userName = user?.name || "User";
    setUser(null);
    setHistory([]);
    setResult(null);
    setActivePage("landing");
    showToast("info", `Goodbye, ${userName}! Come back soon! 👋`);
  };

  const handlePageChange = (page) => {
    // If user is not logged in and tries to access restricted pages
    if (!user && page !== "landing" && page !== "about") {
      setShowLoginPrompt(true);
      showToast("info", "Please sign in to access this feature 🔐");
      return;
    }
    setActivePage(page);
  };

  const handleGetStarted = () => {
    setShowLoginPrompt(true);
  };

  // If showing login prompt
  if (showLoginPrompt) {
    return (
      <Auth onLogin={handleLogin} onBack={() => setShowLoginPrompt(false)} />
    );
  }

  const handleScanRequest = async ({ mode, file, description }) => {
    setLoading(true);

    try {
      let data = null;

      if (mode === "barcode") {
        data = await scanBarcode(file);
      }
      if (mode === "image") {
        data = await scanImage(file);
      }
      if (mode === "description") {
        data = await scanText(description);
      }

      if (!data) throw new Error("No data received");

      const scanWithTimestamp = {
        ...data,
        created_at: data.created_at || new Date().toISOString(),
      };

      setResult(scanWithTimestamp);
      setHistory((prev) => [scanWithTimestamp, ...prev]);
      showToast("success", "Product scanned successfully! ✨");
    } catch (error) {
      console.error("Scan failed:", error);
      // ✅ NO fake demo data — show real error to user
      showToast(
        "error",
        `Scan failed: ${error.message || "Please try again"} ❌`,
      );
      setResult(null); // clear result instead of showing fake data
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistoryItem = (itemId) => {
    const item = history.find((h) => h.id === itemId);
    const itemName = item?.product || item?.name || "this scan";

    setDeleteConfirm({
      isOpen: true,
      itemId,
      itemName,
    });
  };

  const confirmDelete = async () => {
    const { itemId } = deleteConfirm;

    setDeleteConfirm({ isOpen: false, itemId: null, itemName: "" });

    try {
      await deleteHistoryItem(itemId);
      setHistory((prev) => prev.filter((item) => item.id !== itemId));
      showToast("success", "Scan deleted successfully! 🗑️");
    } catch (error) {
      console.error("Delete failed:", error);
      // Still remove from UI even if API fails (optimistic update)
      setHistory((prev) => prev.filter((item) => item.id !== itemId));
      showToast("error", "Failed to delete from server, but removed locally.");
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ isOpen: false, itemId: null, itemName: "" });
  };

  const getIcon = (page) => {
    const icons = {
      landing: <HomeIcon className="w-5 h-5" />,
      home: <HomeIcon className="w-5 h-5" />,
      scanner: <Camera className="w-5 h-5" />,
      history: <BarChart3 className="w-5 h-5" />,
      dashboard: <LayoutDashboard className="w-5 h-5" />,
      about: <Info className="w-5 h-5" />,
    };
    return icons[page];
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const renderPage = () => {
    switch (activePage) {
      case "landing":
        return <PublicLanding onGetStarted={handleGetStarted} />;
      case "home":
        return user ? (
          <Home
            recentScans={history.slice(0, 5)}
            onNavigateToScanner={() => setActivePage("scanner")}
          />
        ) : (
          <PublicLanding onGetStarted={handleGetStarted} />
        );
      case "scanner":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
            <Scanner onScan={handleScanRequest} loading={loading} />
            <div className="glass p-6 lg:p-10 rounded-2xl shadow-2xl border border-green-100/30 min-h-[400px]">
              {result ? (
                <ImpactResult result={result} />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                  <Camera className="w-20 h-20 mb-6 opacity-50" />
                  <h3 className="text-xl font-bold mb-2 text-gray-500">
                    Ready to Analyze
                  </h3>
                  <p>Upload barcode/image or describe product</p>
                </div>
              )}
            </div>
          </div>
        );
      case "history":
        return (
          <HistoryTable history={history} onDelete={handleDeleteHistoryItem} />
        );
      case "dashboard":
        return (
          <Dash
            history={history}
            user={user}
            onNavigateToScanner={() => setActivePage("scanner")}
            onLogout={handleLogout}
          />
        );
      case "about":
        return (
          <About
            user={user}
            onNavigateToScanner={() => handlePageChange("scanner")}
          />
        );
      default:
        return <PublicLanding onGetStarted={handleGetStarted} />;
    }
  };

  const getPageTitle = () => {
    if (activePage === "landing") return "Welcome";
    if (activePage === "home") return "Home";
    return capitalize(activePage);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50">
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={closeToast} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteConfirm.isOpen}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        itemName={deleteConfirm.itemName}
      />

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          activePage={activePage}
          setActivePage={handlePageChange}
          isLoggedIn={!!user}
        />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
        <nav className="flex justify-around py-2">
          {user
            ? // Logged in navigation
              ["home", "scanner", "history", "dashboard", "about"].map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`flex flex-col items-center text-xs ${
                      activePage === page ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {getIcon(page)}
                    <span className="mt-1">{capitalize(page)}</span>
                  </button>
                ),
              )
            : // Non-logged in navigation
              ["landing", "about"]
                .map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`flex flex-col items-center text-xs flex-1 ${
                      activePage === page ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {getIcon(page)}
                    <span className="mt-1">
                      {page === "landing" ? "Home" : capitalize(page)}
                    </span>
                  </button>
                ))
                .concat(
                  <button
                    key="login"
                    onClick={handleGetStarted}
                    className="flex flex-col items-center text-xs flex-1 text-green-600"
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="mt-1">Login</span>
                  </button>,
                )}
        </nav>
      </div>

      {/* Main Content Area - Flex column to push footer down */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8">
          {/* Header - Only show for non-landing pages or logged-in users */}
          {(activePage !== "landing" || user) && (
            <header className="mb-8 glass px-6 py-5 rounded-3xl shadow-xl border border-green-100/50">
              <div className="flex justify-between items-center max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                  {activePage === "home" && (
                    <div className="bg-green-400 p-2 rounded-lg">
                      <HomeIcon className="text-green-900 w-6 h-6" />
                    </div>
                  )}
                  {activePage === "dashboard" && (
                    <div className="bg-green-400 p-2 rounded-lg">
                      <LayoutDashboard className="text-green-900 w-6 h-6" />
                    </div>
                  )}
                  {activePage === "scanner" && (
                    <div className="bg-green-500 p-2 rounded-lg shadow-lg">
                      <Camera className="text-white w-6 h-6" />
                    </div>
                  )}
                  {activePage === "about" && (
                    <div className="bg-green-400 p-2 rounded-lg">
                      <Info className="text-green-900 w-6 h-6" />
                    </div>
                  )}
                  {activePage === "history" && (
                    <div className="bg-green-400 p-2 rounded-lg">
                      <BarChart3 className="text-green-900 w-6 h-6" />
                    </div>
                  )}
                  <h2 className="text-3xl font-black bg-gradient-to-r from-gray-900 to-emerald-900 bg-clip-text text-transparent capitalize">
                    {getPageTitle()}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {user ? (
                    <button
                      onClick={() => setActivePage("dashboard")}
                      className="flex items-center gap-3 text-sm bg-green-50 px-4 py-2 rounded-2xl hover:bg-green-100 transition-all duration-300 hover:shadow-lg cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-gray-900 hidden sm:inline">
                        {user.name}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={handleGetStarted}
                      className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all font-bold"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="hidden sm:inline">Get Started</span>
                    </button>
                  )}
                </div>
              </div>
            </header>
          )}

          <div className="max-w-7xl mx-auto">{renderPage()}</div>
        </main>

        {/* Footer - appears on all pages */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
