import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Download, X } from 'lucide-react';

export default function HistoryTable() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');

  // Simulated History Data with Filtering/Sorting
  const history = [
    { id: 'h1', date: '2024-10-15', hospital: 'Apollo Central', doctor: 'Dr. Smith', dept: 'ENT', token: 'A-12', status: 'Completed', emergency: false },
    { id: 'h2', date: '2024-10-10', hospital: 'Metro Clinic', doctor: 'Dr. Mike', dept: 'General', token: 'G-05', status: 'Completed', emergency: true },
    { id: 'h3', date: '2024-09-28', hospital: 'St. Marys', doctor: 'Dr. Ross', dept: 'Neurology', token: 'N-22', status: 'Cancelled', emergency: false }
  ];

  const filteredHistory = useMemo(() => {
    return history
      .filter(h => h.hospital.toLowerCase().includes(search.toLowerCase()) || h.doctor.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        if (a[sortKey] < b[sortKey]) return sortDir === 'asc' ? -1 : 1;
        if (a[sortKey] > b[sortKey]) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });
  }, [search, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] overflow-hidden shadow-sm">
      <div className="p-10 border-b border-slate-50 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h3 className="text-2xl font-black dark:text-white tracking-tight leading-none mb-1">Appointment History</h3>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Archive of Participating Centers</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Hospital or Specialist..." 
            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-500/10 text-sm font-bold dark:text-white transition-all shadow-inner" 
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <tr>
              {['Date', 'Hospital', 'Doctor', 'Dept', 'Token', 'Status'].map(h => (
                 <th key={h} onClick={() => toggleSort(h.toLowerCase())} className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-blue-600 group transition-colors">
                   <div className="flex items-center gap-2">
                      {h} {sortKey === h.toLowerCase() && (sortDir === 'asc' ? <ChevronUp size={12}/> : <ChevronDown size={12}/>)}
                   </div>
                 </th>
              ))}
              <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
            {filteredHistory.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-10 py-8 text-sm font-bold text-slate-500 dark:text-slate-400">{row.date}</td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-2">
                     <p className="font-black text-slate-900 dark:text-white text-sm">{row.hospital}</p>
                     {row.emergency && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Emergency Intake"></span>}
                  </div>
                </td>
                <td className="px-10 py-8 text-sm font-bold text-slate-600 dark:text-slate-300">{row.doctor}</td>
                <td className="px-10 py-8 text-[10px] font-black uppercase text-blue-500">{row.dept}</td>
                <td className="px-10 py-8 text-sm font-black text-slate-900 dark:text-white uppercase">{row.token}</td>
                <td className="px-10 py-8">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    row.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-400'
                  }`}>{row.status}</span>
                </td>
                <td className="px-10 py-8 text-right">
                  {row.status === 'Completed' ? (
                    <button className="text-blue-600 hover:text-blue-800 transition-colors flex items-center font-black uppercase text-[10px] tracking-widest justify-end w-full">
                      <Download size={14} className="mr-2" /> PDF
                    </button>
                  ) : <X className="text-slate-200 ml-auto" size={16} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}