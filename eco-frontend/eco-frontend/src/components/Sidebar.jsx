import React, { useState } from "react";
import {
  Leaf,
  Scan,
  BarChart3,
  Info,
  LayoutDashboard,
  Home,
  Lock,
  LogIn,
} from "lucide-react";

const Sidebar = ({ activePage, setActivePage, isLoggedIn = false }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Menu items for logged-in users
  const loggedInMenuItems = [
    { id: "home", icon: <Home size={20} />, label: "Home" },
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { id: "scanner", icon: <Scan size={20} />, label: "Scanner" },
    { id: "history", icon: <BarChart3 size={20} />, label: "History" },
    { id: "about", icon: <Info size={20} />, label: "About" },
  ];

  // Menu items for non-logged-in users (only landing and about accessible)
  const publicMenuItems = [
    { id: "landing", icon: <Home size={20} />, label: "Home", accessible: true },
    { id: "dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard", accessible: false, locked: true },
    { id: "scanner", icon: <Scan size={20} />, label: "Scanner", accessible: false, locked: true },
    { id: "history", icon: <BarChart3 size={20} />, label: "History", accessible: false, locked: true },
    { id: "about", icon: <Info size={20} />, label: "About", accessible: true },
  ];

  const menuItems = isLoggedIn ? loggedInMenuItems : publicMenuItems;

  return (
    <div className={`bg-green-900 text-white p-6 hidden md:flex flex-col shadow-2xl min-h-screen sticky top-0 transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center gap-2 mb-10 px-2 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="bg-green-400 p-2 rounded-lg hover:bg-green-300 transition-colors">
          <Leaf className="text-green-900" size={24} />
        </div>
        {isExpanded && <span className="text-xl font-bold tracking-tight whitespace-nowrap">EcoLens AI</span>}
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isLocked = item.locked && !isLoggedIn;
          const isActive = activePage === item.id;
          
          return (
            <div
              key={item.id}
              onClick={() => !isLocked && setActivePage(item.id)}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-green-800 text-white shadow-inner border-l-4 border-green-400"
                  : isLocked
                    ? "text-green-300 opacity-50 cursor-not-allowed"
                    : "text-green-100 hover:bg-green-800/50 hover:text-white cursor-pointer"
              } ${!isExpanded ? 'justify-center' : ''}`}
              title={!isExpanded ? item.label : isLocked ? "Login required" : ''}
            >
              <div className="relative">
                {item.icon}
                {isLocked && (
                  <Lock 
                    size={12} 
                    className="absolute -top-1 -right-1 text-green-400" 
                  />
                )}
              </div>
              {isExpanded && (
                <div className="flex items-center justify-between flex-1">
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                  {isLocked && <Lock size={14} className="text-green-400" />}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Login/User Section at Bottom */}
      <div className="border-t border-green-800 pt-6 mt-6">
        {!isLoggedIn && (
          <div
            onClick={() => setActivePage("login")}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 bg-green-700 hover:bg-green-600 text-white ${!isExpanded ? 'justify-center' : ''}`}
            title={!isExpanded ? "Get Started" : ''}
          >
            <LogIn size={20} />
            {isExpanded && <span className="font-bold whitespace-nowrap">Get Started</span>}
          </div>
        )}
      </div>

      {/* Footer Info */}
      {isExpanded && (
        <div className="mt-6 text-xs text-green-300 text-center">
          <p className="font-bold mb-1">© 2026 EcoLens AI</p>
          <p className="text-green-400">Sustainable Choices</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
