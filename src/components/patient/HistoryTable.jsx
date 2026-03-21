import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, Download, X } from 'lucide-react';
import dayjs from 'dayjs';

export default function HistoryTable({ historyData = [] }) {
  const [search,  setSearch]  = useState('');
  const [sortKey, setSortKey] = useState('booked_for');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = useMemo(() => {
    return historyData
      .filter(h =>
        (h.hospital_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (h.assigned_doctor || '').toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const av = a[sortKey] ?? '';
        const bv = b[sortKey] ?? '';
        if (av < bv) return sortDir === 'asc' ? -1 : 1;
        if (av > bv) return sortDir === 'asc' ?  1 : -1;
        return 0;
      });
  }, [historyData, search, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  // Status badge styling
  const statusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'cancelled':
        return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const statusLabel = (status) => {
    switch (status) {
      case 'completed':  return 'Completed';
      case 'cancelled':  return 'Cancelled';
      case 'in_progress': return 'In Progress';
      case 'waiting':    return 'Waiting';
      case 'pending':    return 'Pending';
      default:           return status;
    }
  };

  const columns = [
    { label: 'Date',     key: 'booked_for'      },
    { label: 'Hospital', key: 'hospital_name'    },
    { label: 'Doctor',   key: 'assigned_doctor'  },
    { label: 'Status',   key: 'status'           },
  ];

  return (
    <section className="bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-3xl sm:rounded-[3rem] overflow-hidden shadow-sm">

      {/* Header */}
      <div className="p-6 sm:p-10 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none mb-2">
            Appointment History
          </h3>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Past appointments — booked before now
          </p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search Hospital or Doctor..."
            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-semibold text-slate-900 dark:text-white transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
              {historyData.length === 0
                ? 'No past appointments yet'
                : 'No results match your search'}
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <tr>
                {columns.map(col => (
                  <th
                    key={col.key}
                    onClick={() => toggleSort(col.key)}
                    className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none"
                  >
                    <div className="flex items-center gap-2">
                      {col.label}
                      {sortKey === col.key && (
                        sortDir === 'asc'
                          ? <ChevronUp size={14} />
                          : <ChevronDown size={14} />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-5 text-right text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 select-none">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(row => (
                <tr
                  key={row.appointment_id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-5 text-sm font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {dayjs(row.booked_for).format('MMM D, YYYY')}
                    <span className="block text-[10px] font-medium text-slate-400 mt-0.5">
                      {dayjs(row.booked_for).format('h:mm A')}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900 dark:text-white text-sm">
                        {row.hospital_name || '—'}
                      </p>
                      {row.isEmergency && (
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="Emergency" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-600 dark:text-slate-300">
                    {row.assigned_doctor ? `Dr. ${row.assigned_doctor}` : '—'}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusStyle(row.status)}`}>
                      {statusLabel(row.status)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right text-xs text-slate-400 italic max-w-[180px] truncate">
                    {row.remarks || <X className="text-slate-300 dark:text-slate-600 ml-auto" size={14} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}