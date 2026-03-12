import React, { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

const Toast = ({ id, type = "info", message, duration = 4000, onClose }) => {
  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    warning: <AlertCircle className="w-5 h-5 text-orange-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  const backgrounds = {
    success: "from-green-50 to-emerald-50 border-green-200",
    error: "from-red-50 to-rose-50 border-red-200",
    warning: "from-orange-50 to-yellow-50 border-orange-200",
    info: "from-blue-50 to-cyan-50 border-blue-200",
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border-2 bg-gradient-to-r ${backgrounds[type]} backdrop-blur-sm animate-slide-in-right min-w-[320px] max-w-md`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <p className="flex-1 text-sm font-bold text-gray-900 leading-relaxed">
        {message}
      </p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-white/50 rounded-lg"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
      <div className="pointer-events-auto space-y-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            message={toast.message}
            duration={toast.duration}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
