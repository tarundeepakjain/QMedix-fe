import React from 'react';
import { Hospital, Trash2, Users, Clock, AlertCircle, CalendarClock, Loader2 } from 'lucide-react';
import dayjs from 'dayjs';

export default function LiveQueueCard({ app, onCancel, cancelling }) {
  const isPending   = app._raw_status === 'pending';
  const isEmergency = app.isEmergency || false;

  const position = (() => {
    if (isPending || app.token_number === 'Pending') return null;
    const num = parseInt(app.token_number?.split('-')[1]);
    return isNaN(num) ? null : num;
  })();

  const waitEstimate = position !== null ? Math.max(0, (position - 1)) * 12 : null;

  return (
    <div className={`relative p-6 rounded-2xl border bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-md overflow-hidden
      ${isEmergency
        ? 'border-red-200 dark:border-red-900/50'
        : isPending
          ? 'border-amber-200 dark:border-amber-900/40'
          : 'border-slate-200 dark:border-slate-800'
      } ${cancelling ? 'opacity-60 pointer-events-none' : ''}`}
    >
      {/* Subtle background icon */}
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
        <Hospital size={100} className="text-slate-900 dark:text-white -rotate-12" />
      </div>

      <div className="relative z-10">

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="flex justify-between items-start mb-5">
          <div className="pr-4">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">
                {app.hospital_name}
              </h3>
              {isEmergency && (
                <span className="bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center shadow-sm whitespace-nowrap">
                  <AlertCircle size={10} className="mr-1" /> Emergency
                </span>
              )}
              {isPending && (
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center whitespace-nowrap">
                  <CalendarClock size={10} className="mr-1" /> Upcoming
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {app.speciality}
              {app.doctor_name ? ` • Dr. ${app.doctor_name}` : ''}
            </p>
          </div>

          {/* Cancel button — shows spinner while cancelling */}
          <button
            onClick={() => onCancel(app.id)}
            disabled={cancelling}
            className="text-slate-400 hover:text-red-500 transition-colors shrink-0 disabled:opacity-50"
            title="Cancel Appointment"
          >
            {cancelling
              ? <Loader2 size={18} className="animate-spin text-red-400" />
              : <Trash2 size={18} />
            }
          </button>
        </div>

        {/* ── Token Display ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Your Token
            </p>
            <p className={`text-2xl font-black ${
              isPending
                ? 'text-amber-500 dark:text-amber-400'
                : 'text-slate-900 dark:text-white'
            }`}>
              {app.token_number}
            </p>
          </div>

          <div className={`p-3 rounded-xl shadow-md text-white flex flex-col items-center justify-center ${
            isPending
              ? 'bg-slate-400 dark:bg-slate-700 shadow-slate-400/20'
              : 'bg-blue-600 dark:bg-blue-500 shadow-blue-500/20'
          }`}>
            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1">
              Now Serving
            </p>
            <p className="text-2xl font-black">{app.serving_token}</p>
          </div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 flex-wrap gap-2">
          <div className="flex gap-4">
            {!isPending && position !== null ? (
              <>
                <div className="flex items-center text-slate-600 dark:text-slate-400">
                  <Users size={14} className="mr-1.5 text-slate-400" />
                  <span className="text-xs font-semibold">
                    Pos: <span className="text-slate-900 dark:text-white">{position}</span>
                  </span>
                </div>
                <div className="flex items-center text-slate-600 dark:text-slate-400">
                  <Clock size={14} className="mr-1.5 text-slate-400" />
                  <span className="text-xs font-semibold">
                    Wait: <span className="text-slate-900 dark:text-white">~{waitEstimate}m</span>
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center text-slate-500 dark:text-slate-400">
                <CalendarClock size={14} className="mr-1.5" />
                <span className="text-xs font-semibold">
                  {app.booked_for
                    ? dayjs(app.booked_for).format('MMM D, h:mm A')
                    : 'Time TBD'}
                </span>
              </div>
            )}
          </div>

          <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
            app._raw_status === 'in_progress'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : app._raw_status === 'waiting'
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
          }`}>
            {app.status}
          </div>
        </div>

        {/* Remarks */}
        {app.remarks && (
          <p className="mt-3 text-[11px] text-slate-400 italic border-t border-slate-100 dark:border-slate-800 pt-3">
            {app.remarks}
          </p>
        )}
      </div>
    </div>
  );
}