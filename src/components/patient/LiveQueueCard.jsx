import React from 'react';
import { Hospital, Trash2, Users, Clock } from 'lucide-react';

export default function LiveQueueCard({ app, onCancel }) {
  const servingNum = parseInt(app.serving_token?.split('-')[1]) || 0;
  const myNum = parseInt(app.token_number?.split('-')[1]) || 0;
  const position = myNum - servingNum;
  const waitEstimate = position * 12; // 12min average wait

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 p-8 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group animate-in slide-in-from-bottom-4 duration-500">
      <div className="absolute top-0 right-0 p-8 opacity-5"><Hospital size={80} className="text-slate-900 dark:text-white -rotate-12" /></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-black text-slate-900 dark:text-white text-xl tracking-tight leading-none">{app.hospital_name}</h3>
              {app.isEmergency && (
                <div className="bg-red-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full animate-pulse shadow-lg shadow-red-500/20">Emergency Flag</div>
              )}
            </div>
            <p className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest">{app.speciality} • {app.doctor_name}</p>
          </div>
          <button onClick={() => onCancel(app.id)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><Trash2 size={18} /></button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-inner">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-center">Your Token</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white text-center">{app.token_number}</p>
          </div>
          <div className="bg-blue-600 p-5 rounded-3xl shadow-lg shadow-blue-500/20 text-white">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1 text-center">Serving</p>
            <p className="text-4xl font-black text-center">{app.serving_token}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-700">
          <div className="flex flex-col gap-3">
             <div className="flex items-center text-slate-500 dark:text-slate-400">
                <Users size={16} className="mr-2 text-blue-500" />
                <span className="text-xs font-black uppercase">Queue Pos: <span className="text-blue-600 dark:text-blue-400 font-black">#{position > 0 ? position : '0'}</span></span>
             </div>
             <div className="flex items-center text-slate-500 dark:text-slate-400">
                <Clock size={16} className="mr-2 text-blue-500" />
                <span className="text-xs font-black uppercase">Est. Wait: <span className="text-blue-600 dark:text-blue-400 font-black">{waitEstimate}m</span></span>
             </div>
          </div>
          <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
            app.status === 'in-progress' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400'
          }`}>
            {app.status}
          </div>
        </div>
      </div>
    </div>
  );
}