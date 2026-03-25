import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

const CustomAlert = ({ message, type = "success", onClose }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // auto close

    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    error: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    warning: "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
  };

  const Icon = type === "success" ? CheckCircle2 : AlertCircle;

  return (
    <div className="fixed top-6 right-6 z-[999] animate-in slide-in-from-top duration-300">
      
      <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl backdrop-blur-xl border 
        border-slate-200 dark:border-slate-700 
        ${styles[type]}`}>

        <Icon size={20} />

        <p className="text-sm font-bold">{message}</p>

        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
          <X size={16} />
        </button>

      </div>
    </div>
  );
};

export default CustomAlert;