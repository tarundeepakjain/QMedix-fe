import React from 'react';
import { Play, Users, Clock } from 'lucide-react';

export default function QueueControls({ onCallNext, isAvailable, queueLength, completedCount }) {
  return (
    <div className="flex flex-col gap-6">
      <button
        onClick={onCallNext}
        disabled={!isAvailable || queueLength === 0}
        className="w-full flex flex-col items-center justify-center bg-blue-600 disabled:bg-slate-300 disabled:dark:bg-slate-800 hover:bg-blue-700 text-white p-8 rounded-[2.5rem] font-black transition-all active:scale-[0.98] shadow-xl shadow-blue-500/25 disabled:shadow-none group h-48"
      >
        <div className="bg-white/20 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
          <Play size={32} className="fill-current" />
        </div>
        <span className="text-xl tracking-wide uppercase">Call Next</span>
        {queueLength > 0 && (
          <span className="text-blue-200 text-xs font-bold mt-1">{queueLength} in queue</span>
        )}
      </button>

      <div className="bg-white dark:bg-[#111827] rounded-[2.5rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex-1">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Today's Stats</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <div className="flex items-center text-slate-600 dark:text-slate-400 font-bold">
              <Users size={18} className="mr-3 text-blue-500" /> Waiting
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">{queueLength}</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
            <div className="flex items-center text-slate-600 dark:text-slate-400 font-bold">
              <Clock size={18} className="mr-3 text-emerald-500" /> Completed
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">{completedCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}