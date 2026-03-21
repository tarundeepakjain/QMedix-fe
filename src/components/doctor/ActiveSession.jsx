import React from 'react';
import { FileText, SkipForward, XCircle, CheckCircle2, Power } from 'lucide-react';

export default function ActiveSession({ currentPatient, remarks, setRemarks, onComplete, onNoShow, onSkip }) {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Active Consultation</h2>
        {currentPatient && (
          <span className="px-3 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse border border-blue-100 dark:border-blue-800/50">
            In Progress
          </span>
        )}
      </div>

      {currentPatient ? (
        <div className="flex-1 flex flex-col">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white mb-6 shadow-lg shadow-blue-500/20 flex justify-between items-center">
            <div>
              <p className="text-blue-200 font-bold uppercase tracking-widest text-[10px] mb-1">Token Number</p>
              <p className="text-4xl sm:text-5xl font-black tracking-tighter mb-2">{currentPatient.token}</p>
              <p className="text-lg font-bold">{currentPatient.name}</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 inline-block">
                <p className="text-xs font-bold text-blue-100">{currentPatient.age} Yrs • {currentPatient.gender}</p>
              </div>
            </div>
          </div>

          <div className="mb-6 flex-1">
            <label className="flex items-center text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">
              <FileText size={14} className="mr-2" /> Clinical Remarks
            </label>
            <textarea 
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter diagnosis, prescriptions, or notes here..."
              className="w-full h-32 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 resize-none transition-all"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button onClick={onSkip} className="flex flex-col items-center justify-center bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-2xl font-bold text-xs sm:text-sm transition-all border border-amber-200 dark:border-amber-900/30">
              <SkipForward size={20} className="mb-1.5" /> Skip
            </button>
            <button onClick={onNoShow} className="flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 p-4 rounded-2xl font-bold text-xs sm:text-sm transition-all border border-slate-200 dark:border-slate-700">
              <XCircle size={20} className="mb-1.5" /> No Show
            </button>
            <button onClick={onComplete} className="flex flex-col items-center justify-center bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/20">
              <CheckCircle2 size={20} className="mb-1.5" /> Complete
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
            <Power size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Ready for Next Patient</h3>
          <p className="text-slate-500 font-medium max-w-sm">Click the "Call Next" button to bring the first person from your queue into the active session.</p>
        </div>
      )}
    </div>
  );
}