import React from 'react';
import { Stethoscope, Loader2 } from 'lucide-react';

export default function DoctorHeader({ doctorInfo, hospitalInfo, isAvailable, toggling, onToggle }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50">
          <Stethoscope size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {doctorInfo.name ? `Dr. ${doctorInfo.name}` : 'Doctor'}
          </h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            {doctorInfo.speciality ?? 'General'}
            {hospitalInfo.name ? ` · ${hospitalInfo.name}` : ''}
          </p>
        </div>
      </div>

      <button
        onClick={onToggle}
        disabled={toggling}
        className={`relative flex items-center justify-between w-44 p-1.5 rounded-full transition-colors duration-300 border disabled:opacity-60 disabled:cursor-not-allowed ${
          isAvailable
            ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800'
            : 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
        }`}
      >
        {toggling ? (
          <div className="w-full flex items-center justify-center py-1">
            <Loader2 size={16} className="animate-spin text-slate-400" />
          </div>
        ) : (
          <>
            <div className={`absolute w-1/2 h-8 rounded-full transition-transform duration-300 ${
              isAvailable
                ? 'translate-x-[90%] bg-emerald-500 shadow-md'
                : 'translate-x-0 bg-slate-400 dark:bg-slate-500'
            }`} />
            <span className={`w-1/2 text-center text-[10px] font-black uppercase tracking-widest z-10 transition-colors ${
              isAvailable ? 'text-emerald-700 dark:text-emerald-400' : 'text-white'
            }`}>
              {isAvailable ? 'Live' : 'Off'}
            </span>
            <span className={`w-1/2 text-center text-[10px] font-black uppercase tracking-widest z-10 transition-colors ${
              !isAvailable ? 'text-slate-500 dark:text-slate-400' : 'text-white'
            }`}>
              {isAvailable ? 'On' : 'Away'}
            </span>
          </>
        )}
      </button>
    </div>
  );
}