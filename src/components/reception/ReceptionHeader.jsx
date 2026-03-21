import React from 'react';
import { Building2, Filter, UserPlus } from 'lucide-react';

export default function ReceptionHeader({ departments, selectedDept, setSelectedDept, onOpenModal }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-800/50">
          <Building2 size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Staff Console</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Queue Management</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-56">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select 
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-bold text-slate-700 dark:text-slate-300 appearance-none cursor-pointer"
          >
            {departments.map(d => <option key={d} value={d}>{d} Dept</option>)}
          </select>
        </div>
        <button 
          onClick={onOpenModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center shrink-0"
        >
          <UserPlus size={18} className="mr-2" /> Register Patient
        </button>
      </div>
    </div>
  );
}