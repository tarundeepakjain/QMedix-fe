import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/apiWrapper';

// ─── Icons ────────────────────────────────────────────────────────────────────

const AlertIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
  </svg>
);

const XIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

// ─── Single Request Card ───────────────────────────────────────────────────────

function RequestCard({ request, onApprove, onReject }) {
  const [loading, setLoading] = useState(null); // 'approve' | 'reject' | null

  const handleApprove = async () => {
    setLoading('approve');
    await onApprove(request.appointment_id);
    setLoading(null);
  };

  const handleReject = async () => {
    setLoading('reject');
    await onReject(request.appointment_id);
    setLoading(null);
  };

  return (
    <div className="
      group relative
      bg-white dark:bg-[#131929]
      border border-red-100 dark:border-red-900/30
      rounded-xl p-3.5
      shadow-sm hover:shadow-md
      transition-all duration-200
      hover:border-red-200 dark:hover:border-red-800/50
    ">
      {/* Accent bar */}
      <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-red-400 rounded-full" />

      {/* Patient + status */}
      <div className="flex items-start justify-between gap-2 mb-2 pl-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate leading-tight">
            {request.patient_name}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {request.doctor_name}
          </p>
        </div>
        <span className="
          shrink-0
          text-[10px] font-bold tracking-wider uppercase
          px-2 py-0.5 rounded-full
          bg-amber-50 dark:bg-amber-900/20
          text-amber-600 dark:text-amber-400
          border border-amber-200 dark:border-amber-700/40
        ">
          Pending
        </span>
      </div>

      {/* Department badge */}
      <div className="pl-2 mb-3">
        <span className="
          inline-flex items-center gap-1
          text-[11px] text-slate-500 dark:text-slate-400
          bg-slate-100 dark:bg-slate-800/60
          px-2 py-0.5 rounded-md
        ">
          {request.department}
        </span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pl-2">
        <button
          onClick={handleApprove}
          disabled={!!loading}
          className="
            flex-1 flex items-center justify-center gap-1.5
            text-xs font-medium
            py-1.5 px-3 rounded-lg
            bg-emerald-50 dark:bg-emerald-900/20
            text-emerald-700 dark:text-emerald-400
            border border-emerald-200 dark:border-emerald-700/40
            hover:bg-emerald-100 dark:hover:bg-emerald-900/40
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-150
          "
        >
          {loading === 'approve' ? (
            <span className="w-3.5 h-3.5 border-2 border-emerald-400/40 border-t-emerald-500 rounded-full animate-spin" />
          ) : (
            <CheckIcon />
          )}
          Approve
        </button>

        <button
          onClick={handleReject}
          disabled={!!loading}
          className="
            flex-1 flex items-center justify-center gap-1.5
            text-xs font-medium
            py-1.5 px-3 rounded-lg
            bg-red-50 dark:bg-red-900/20
            text-red-600 dark:text-red-400
            border border-red-200 dark:border-red-800/40
            hover:bg-red-100 dark:hover:bg-red-900/40
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors duration-150
          "
        >
          {loading === 'reject' ? (
            <span className="w-3.5 h-3.5 border-2 border-red-400/40 border-t-red-500 rounded-full animate-spin" />
          ) : (
            <XIcon />
          )}
          Reject
        </button>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="
        w-12 h-12 rounded-full
        bg-slate-100 dark:bg-slate-800
        flex items-center justify-center mb-3
      ">
        <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No pending requests</p>
      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">All clear right now</p>
    </div>
  );
}

// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="
        w-12 h-12 rounded-full
        bg-red-50 dark:bg-red-900/20
        flex items-center justify-center mb-3
      ">
        <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Failed to load</p>
      <button
        onClick={onRetry}
        className="mt-2 text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2"
      >
        Try again
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EmergencyRequests({ hospitalId }) {
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);

  const fetchRequests = useCallback(async () => {
    if (!hospitalId) return;
    setError(false);
    try {
      const res = await api('GET', `staff/emergency-requests/${hospitalId}`);
      if (res.status === 200) {
        setRequests(res.data ?? []);
      }
    } catch (err) {
      console.error('Failed to fetch emergency requests:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [hospitalId]);

  // Initial fetch
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Poll every 20 seconds for new requests
  useEffect(() => {
    const interval = setInterval(fetchRequests, 20_000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const handleApprove = async (appointmentId) => {
    try {
      await api('POST', `staff/approve-emergency/${appointmentId}`);
      // Remove from list optimistically; realtime will update the queue
      setRequests(prev => prev.filter(r => r.appointment_id !== appointmentId));
    } catch (err) {
      console.error('Approve emergency failed:', err);
      alert(err?.response?.data?.message ?? 'Failed to approve. Please try again.');
    }
  };

  const handleReject = async (appointmentId) => {
    try {
      await api('POST', `staff/reject-emergency/${appointmentId}`);
      setRequests(prev => prev.filter(r => r.appointment_id !== appointmentId));
    } catch (err) {
      console.error('Reject emergency failed:', err);
      alert(err?.response?.data?.message ?? 'Failed to reject. Please try again.');
    }
  };

  return (
    <div className="
      bg-white dark:bg-[#0F1623]
      border border-slate-200 dark:border-slate-700/50
      rounded-2xl overflow-hidden
      flex flex-col
      h-full
    ">
      {/* Header */}
      <div className="
        flex items-center justify-between
        px-4 py-3.5
        border-b border-slate-100 dark:border-slate-700/50
        bg-red-50/50 dark:bg-red-950/20
      ">
        <div className="flex items-center gap-2">
          <span className="text-red-500 dark:text-red-400">
            <AlertIcon />
          </span>
          <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Emergency Requests
          </h2>
          {requests.length > 0 && (
            <span className="
              text-[11px] font-bold
              px-1.5 py-0.5 rounded-full
              bg-red-500 text-white
              leading-none
            ">
              {requests.length}
            </span>
          )}
        </div>

        <button
          onClick={() => { setLoading(true); fetchRequests(); }}
          className="
            p-1.5 rounded-lg
            text-slate-400 hover:text-slate-600 dark:hover:text-slate-300
            hover:bg-slate-100 dark:hover:bg-slate-800
            transition-colors duration-150
          "
          title="Refresh"
        >
          <RefreshIcon />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {loading ? (
          <div className="flex flex-col gap-2.5">
            {[1, 2].map(i => (
              <div key={i} className="
                h-[110px] rounded-xl
                bg-slate-100 dark:bg-slate-800/60
                animate-pulse
              " />
            ))}
          </div>
        ) : error ? (
          <ErrorState onRetry={() => { setLoading(true); fetchRequests(); }} />
        ) : requests.length === 0 ? (
          <EmptyState />
        ) : (
          requests.map(request => (
            <RequestCard
              key={request.appointment_id}
              request={request}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ))
        )}
      </div>
    </div>
  );
}