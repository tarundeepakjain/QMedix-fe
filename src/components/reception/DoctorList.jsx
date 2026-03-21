import React from 'react';
import { Stethoscope, Activity, AlertTriangle, Clock, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function DoctorList({ doctors, expandedDocId, onToggleAccordion, onToggleEmergency, onCancel }) {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-[2.5rem] p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">Active Doctors & Queues</h2>
      </div>
      
      <div className="flex flex-col space-y-4">
        {doctors.map((doc) => (
          <div key={doc.id} className="rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden bg-white dark:bg-[#0B0F19] shadow-sm transition-all duration-300">
            
            {/* Clickable Header Row */}
            <div 
              onClick={() => onToggleAccordion(doc.id)}
              className="p-4 sm:p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors select-none"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex shrink-0 items-center justify-center border ${
                  doc.status === 'Available' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800' :
                  'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800'
                }`}>
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h2 className="font-black text-base sm:text-lg text-slate-900 dark:text-white leading-tight">{doc.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{doc.dept}</p>
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${doc.status === 'Available' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right hidden sm:block">
                  <p className="text-xl font-black text-slate-900 dark:text-white leading-none">
                    {doc.queue.length}
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Waiting</p>
                </div>
                <div className={`p-2 rounded-full transition-transform duration-300 ${expandedDocId === doc.id ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                  {expandedDocId === doc.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {expandedDocId === doc.id && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col gap-6 animate-in slide-in-from-top-2 duration-300">
                
                {/* Current Patient */}
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center">
                    <Activity size={12} className="mr-1.5 text-blue-500" /> Currently Serving
                  </p>
                  {doc.current ? (
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 p-4 rounded-2xl">
                       <div className="flex items-center gap-3">
                         <span className="text-lg font-black text-blue-600 dark:text-blue-400">{doc.current.token}</span>
                         <span className="font-bold text-slate-700 dark:text-slate-200">{doc.current.name}</span>
                       </div>
                       {doc.current.emergency && <AlertTriangle size={16} className="text-red-500" />}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-400 text-sm font-bold text-center bg-white/50 dark:bg-slate-900/50">
                      Idle - No patient in session
                    </div>
                  )}
                </div>

                {/* Waiting Queue */}
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-3">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
                       <Clock size={12} className="mr-1.5" /> Up Next ({doc.queue.length})
                     </p>
                  </div>

                  <div className="space-y-2">
                    {doc.queue.length === 0 ? (
                      <p className="text-xs text-slate-400 font-semibold italic text-center py-4">No patients waiting in queue.</p>
                    ) : (
                      doc.queue.map((p) => (
                        <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          p.emergency 
                            ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' 
                            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-300'
                        }`}>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-black w-10 ${p.emergency ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}>
                              {p.token}
                            </span>
                            <span className={`font-bold text-sm ${p.emergency ? 'text-red-700 dark:text-red-300' : 'text-slate-700 dark:text-slate-200'}`}>
                              {p.name}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => { e.stopPropagation(); onToggleEmergency(doc.id, p.id); }}
                              title="Toggle Emergency"
                              className={`p-1.5 rounded-lg transition-colors ${p.emergency ? 'bg-red-100 text-red-600 dark:bg-red-500/20' : 'hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-500/20'}`}
                            >
                              <AlertTriangle size={16} />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); onCancel(doc.id, p.id); }}
                              title="Cancel Walk-in"
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-red-500 dark:hover:bg-slate-700 transition-colors"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}