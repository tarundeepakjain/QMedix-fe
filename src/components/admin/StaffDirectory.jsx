import React, { useState } from 'react';
import { Contact2 } from 'lucide-react';

export default function StaffDirectory({ directory }) {
  console.log(directory);
  // --- NEW: Filter State ---
  const [roleFilter, setRoleFilter] = useState('All');

  // Filter the list based on the selected toggle
  const filteredDirectory = roleFilter === 'All' 
    ? directory 
    : directory.filter(staff => staff.role === roleFilter);

  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center">
          <Contact2 className="mr-2 text-blue-500" size={20} /> Active Directory
        </h3>
        
        {/* --- NEW: Segmented Toggle Filter --- */}
        <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl w-fit">
          {['All', 'Doctor', 'Staff'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-1.5 text-xs font-black uppercase tracking-widest rounded-lg transition-all ${
                roleFilter === role 
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-full overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <tr>
              {['Personnel', 'Role', 'Department', 'Status'].map(h => (
                <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredDirectory.map((staff) => (
              <tr key={staff.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{staff.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    staff.role === 'Doctor' 
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' 
                      : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                  }`}>
                    {staff.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">{staff.dept}</td>
                <td className="px-6 py-4">
                   <span className="flex items-center text-xs font-bold text-slate-500">
                     <span className={`w-2 h-2 rounded-full mr-2 ${staff.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                     {staff.status}
                   </span>
                </td>
              </tr>
            ))}
            {filteredDirectory.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 font-bold">
                  No {roleFilter.toLowerCase()}s found in directory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}