import React from 'react';

export default function QueueTable({ queue }) {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">Your Queue</h3>
      </div>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <tr>
              {['Token', 'Patient Name', 'Age/Gen', 'Appt Time'].map(h => (
                <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {queue.map((patient, index) => (
              <tr key={patient.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center">
                    {index === 0 && <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>}
                    <span className="text-sm font-black text-slate-900 dark:text-white">{patient.token}</span>
                  </div>
                </td>
                <td className="px-6 py-5 font-bold text-slate-700 dark:text-slate-200">{patient.name}</td>
                <td className="px-6 py-5 text-sm font-semibold text-slate-500">{patient.age} / {patient.gender}</td>
                <td className="px-6 py-5 text-sm font-semibold text-slate-500">{patient.time}</td>
              </tr>
            ))}
            {queue.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-bold">
                  Queue is currently empty.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}