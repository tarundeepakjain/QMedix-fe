import { Activity } from "lucide-react";

export default function Loading({text="Loading..."}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#0B0F19] relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-500 opacity-20 blur-[100px] animate-pulse rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Logo / Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 animate-bounce">
          <Activity size={36} />
        </div>

        {/* App Name */}
        <h1 className="mt-6 text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          QMedix
        </h1>

        {/* Loading Text */}
        <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-500 animate-pulse">
        {text}
        </p>

        {/* Progress bar */}
        <div className="mt-6 w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 animate-[shimmer_1.5s_infinite] w-1/2"></div>
        </div>
      </div>

      {/* shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}