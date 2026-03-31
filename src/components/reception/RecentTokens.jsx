import React from 'react';
import { Clock } from 'lucide-react';

export default function RecentTokens({ recentRegistrations }) {
  return (
    <div className="bg-white dark:bg-[#111827] rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-fit">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Walk-In Tokens</h2>
      </div>
      
      <div className="flex-1 space-y-4">
        {recentRegistrations.map((reg, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black text-sm border border-blue-100 dark:border-blue-800/50">
                {reg.token}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">{reg.name}</p>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center">
                  <Clock size={10} className="mr-1" /> {reg.time}
                </p>
              </div>
            </div>
            <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
              reg.type === 'Walk-in' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            }`}>
              {reg.type}
            </span>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-3 text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors border border-blue-100 dark:border-blue-900/30">
        View Log History
      </button>
    </div>
  );
}