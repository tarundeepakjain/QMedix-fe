import React from 'react';
import { CheckCircle2, XCircle, UserCircle } from 'lucide-react';

export default function PendingApprovals({ pendingUsers, onApprove, onReject }) {
  return (
    <div className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase flex items-center">
          <UserCircle className="mr-2 text-purple-500" size={20} /> Pending Registrations
        </h3>
        <span className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 py-1 px-3 rounded-full text-xs font-black">
          {pendingUsers.length} Requests
        </span>
      </div>
      
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <tr>
              {['Name & Email', 'Role', 'Department/Specialty', 'Actions'].map(h => (
                <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {pendingUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${
                    user.role === 'Doctor' ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400' : 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">{user.dept}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => onApprove(user.id)} className="flex items-center px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 dark:text-emerald-400 rounded-lg text-xs font-bold transition-colors">
                      <CheckCircle2 size={14} className="mr-1.5" /> Approve
                    </button>
                    <button onClick={() => onReject(user.id)} className="flex items-center px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 rounded-lg text-xs font-bold transition-colors">
                      <XCircle size={14} className="mr-1.5" /> Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {pendingUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 font-bold">
                  No pending approvals.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}