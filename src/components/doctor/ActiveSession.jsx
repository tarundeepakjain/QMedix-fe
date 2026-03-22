import React from 'react';
import { CheckCircle2, Power, Loader2, User, Pill, Stethoscope, FileText } from 'lucide-react';
import dayjs from 'dayjs';

const field = "w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all";

export default function ActiveSession({ currentPatient, remarks, setRemarks, onComplete, completing }) {
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
        <div className="flex-1 flex flex-col gap-5">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20 flex justify-between items-center">
            <div>
              <p className="text-blue-200 font-bold uppercase tracking-widest text-[10px] mb-1">Token</p>
              <p className="text-4xl font-black tracking-tighter mb-1">{currentPatient.token}</p>
              <p className="text-lg font-bold">{currentPatient.name}</p>
              {currentPatient.isEmergency && (
                <span className="mt-1 inline-block bg-red-500 text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">
                  Emergency
                </span>
              )}
            </div>
            <div className="text-right space-y-1">
              {currentPatient.gender && (
                <div className="bg-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 text-xs font-bold text-blue-100">
                  {currentPatient.gender}
                </div>
              )}
              {currentPatient.booked_for && (
                <div className="bg-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-blue-200">
                  {dayjs(currentPatient.booked_for).format('h:mm A')}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">

            <div className="col-span-2">
              <label className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                <Stethoscope size={12} className="mr-1.5" /> Diagnosis
              </label>
              <input
                type="text"
                placeholder="e.g. Hypertension, Type 2 Diabetes"
                value={remarks.diagnosis}
                onChange={e => setRemarks(r => ({ ...r, diagnosis: e.target.value }))}
                className={field}
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                <Pill size={12} className="mr-1.5" /> Prescribed Medicines
              </label>
              <input
                type="text"
                placeholder="e.g. Metformin 500mg, Amlodipine 5mg"
                value={remarks.medicines}
                onChange={e => setRemarks(r => ({ ...r, medicines: e.target.value }))}
                className={field}
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                <FileText size={12} className="mr-1.5" /> Additional Notes
              </label>
              <textarea
                rows={2}
                placeholder="Follow-up instructions, observations..."
                value={remarks.notes}
                onChange={e => setRemarks(r => ({ ...r, notes: e.target.value }))}
                className={field + ' resize-none'}
              />
            </div>
          </div>

          <button
            onClick={onComplete}
            disabled={completing}
            className="w-full flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white p-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-500/20 mt-auto"
          >
            {completing
              ? <Loader2 size={20} className="animate-spin mr-2" />
              : <CheckCircle2 size={20} className="mr-2" />
            }
            {completing ? 'Saving...' : 'Mark Complete'}
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-4">
            <Power size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Ready for Next Patient</h3>
          <p className="text-slate-500 font-medium max-w-sm">Click "Call Next" to bring the first person from your queue into session.</p>
        </div>
      )}
    </div>
  );
}