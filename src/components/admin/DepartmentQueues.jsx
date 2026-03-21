import React from 'react';
import { Activity, Users, Stethoscope } from 'lucide-react';

export default function DepartmentQueues({ departments }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight uppercase px-2">Global Department Queues</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {departments.map((dept, idx) => (
          <div key={idx} className="bg-white dark:bg-[#111827] rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-between items-center">
              <h3 className="font-black text-slate-900 dark:text-white text-lg">{dept.name}</h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-200 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                {dept.doctors.length} Doctors
              </span>
            </div>
            
            <div className="p-5 flex-1 space-y-4">
              {dept.doctors.map((doc, dIdx) => (
                <div key={dIdx} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Stethoscope size={16} className="text-blue-500" />
                      <p className="font-bold text-slate-900 dark:text-white text-sm">{doc.name}</p>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${doc.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center"><Activity size={14} className="mr-1.5 text-indigo-500" /> Serving: {doc.current || 'None'}</span>
                    <span className="flex items-center"><Users size={14} className="mr-1.5 text-amber-500" /> Wait: {doc.waiting}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}