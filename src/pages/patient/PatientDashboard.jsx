import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCcw, Plus, Activity, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import LiveQueueCard from '../../components/patient/LiveQueueCard';
import HistoryTable from '../../components/patient/HistoryTable';
import api from '../../services/apiWrapper.js';
import queueEngine from '../../services/queueEngine.js';
import { createAppointmentChannel, removeChannel } from '../../services/realtimeService.js';

// ---------------------------------------------------------------------------
// normalise: converts a raw appointment (from API or engine) into UI shape.
// Token is ALWAYS derived from queueEngine.getPatientPosition so it matches
// Doctor and Reception dashboards.
// ---------------------------------------------------------------------------
function normalise(appointment) {
  const status   = appointment.status; // 'waiting' | 'in_progress' | 'pending' | 'completed'
  const isActive = status === 'waiting' || status === 'in_progress';

  // Position comes ONLY from the engine – never from the raw API object
  const position = isActive
    ? queueEngine.getPatientPosition(appointment.appointment_id)
    : null;

  return {
    id:             appointment.appointment_id,
    appointment_id: appointment.appointment_id,
    created_at:     appointment.created_at,
    hospital_name:  appointment.hospital_name   || 'Unknown Hospital',
    speciality:     appointment.department      || 'General',
    doctor_name:    appointment.assigned_doctor || 'Not Assigned',
    isEmergency:    appointment.isEmergency     || false,
    remarks:        appointment.remarks         || '',
    booked_for:     appointment.booked_for,
    completed_at:   appointment.completed_at,
    _raw_status:    status,
    _position:      position,

    // Token: Q-N for active, "Pending" for upcoming, nothing for history
    token_number: position ? `Q-${position}` : 'Pending',
    serving_token: 'N/A', // patched in second pass below

    status:
      status === 'waiting'       ? 'Waiting'
      : status === 'in_progress' ? 'In-Progress'
      : status === 'pending'     ? 'Pending'
      : status,
  };
}

// ---------------------------------------------------------------------------
// deriveFromEngine:
//   1. Populate the engine with the fresh API response.
//   2. Walk every hospital → every doctor queue in the engine to get the
//      CANONICAL active list (waiting + in_progress).
//   3. The engine is now the single source of truth for queue order & tokens.
// ---------------------------------------------------------------------------
function deriveFromEngine(raw, userId) {
  // Step 1 – feed the engine
  queueEngine.buildQueues(raw);

  const now = new Date();

  // Step 2 – history: past appointments from the raw API list
  // (engine only tracks today's active queues; historical data lives in API)
  const history = raw.filter(a => new Date(a.booked_for) < now);

  // Step 3 – build the canonical active list from the engine.
  // We iterate the engine's internal queues and collect every appointment
  // that belongs to this patient (matched by patient_id === userId).
  const engineActive = [];

  queueEngine.queues.forEach((hospitalMap) => {
    hospitalMap.forEach((doctorQueue) => {
      [...doctorQueue.in_progress, ...doctorQueue.waiting].forEach(app => {
        if (app.patient_id === userId) {
          engineActive.push(app);
        }
      });
    });
  });

  // Step 4 – also include "pending" (future-booked, not yet in engine queue)
  // These come from the raw API list since the engine only holds today's slots.
  const engineActivIds = new Set(engineActive.map(a => a.appointment_id));
  const pendingFromApi = raw.filter(
    a =>
      a.status === 'pending' &&
      new Date(a.booked_for) >= now &&
      !engineActivIds.has(a.appointment_id)
  );

  // Step 5 – normalise (tokens from engine positions)
  const normalisedActive  = engineActive.map(normalise);
  const normalisedPending = pendingFromApi.map(normalise);

  // Step 6 – patch "serving_token" (the currently-in-progress token for the
  // same doctor queue, so the patient can see who is being served right now)
  const patchServingToken = (list) => {
    return list.map(a => {
      if (a._raw_status !== 'waiting' && a._raw_status !== 'in_progress') {
        return a;
      }
      // Find the in_progress appointment in the same doctor's queue
      let servingLabel = 'N/A';
      queueEngine.queues.forEach((hospitalMap) => {
        hospitalMap.forEach((doctorQueue) => {
          const inProg = doctorQueue.in_progress[0];
          if (inProg) {
            const pos = queueEngine.getPatientPosition(inProg.appointment_id);
            // in_progress patients don't have a waiting position; label them Q-0
            // to indicate they're being served
            servingLabel = pos ? `Q-${pos}` : 'Q-1';
          }
        });
      });
      return { ...a, serving_token: servingLabel };
    });
  };

  const liveData    = patchServingToken(normalisedActive);
  const pendingData = normalisedPending;

  return { liveData, pendingData, history };
}

export default function PatientDashboard({ user }) {
  const [liveData,    setLiveData]    = useState([]);
  const [pendingData, setPendingData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [cancelling,  setCancelling]  = useState(null);

  const pollingRef = useRef(null);
  const channelRef = useRef(null);
  const navigate   = useNavigate();

  const fetchPatientAppointments = useCallback(async () => {
    try {
      const res = await api('GET', 'patient/get-appointments');
      const raw = res.data?.data ?? [];

      // Derive EVERYTHING from the engine after feeding it the raw data
      const { liveData, pendingData, history } = deriveFromEngine(raw, user?.id);

      setLiveData(liveData);
      setPendingData(pendingData);
      setHistoryData(history);
    } catch (err) {
      console.error('Failed to fetch patient appointments:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    queueEngine.init().then(() => {
      console.log('Queue engine initialized');
      fetchPatientAppointments();
    });

    channelRef.current = createAppointmentChannel({
      filter:  undefined,
      onEvent: fetchPatientAppointments,
    });

    pollingRef.current = setInterval(fetchPatientAppointments, 2000);

    return () => {
      if (channelRef.current) removeChannel(channelRef.current);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [user, fetchPatientAppointments]);

  const handleCancel = async (appointmentId) => {
    setCancelling(appointmentId);
    try {
      await api('DELETE', `patient/cancel-appointment/${appointmentId}`);
      setLiveData(prev    => prev.filter(a => a.id !== appointmentId));
      setPendingData(prev => prev.filter(a => a.id !== appointmentId));
    } catch (err) {
      console.error('Cancel failed:', err);
      alert(err?.response?.data?.message || 'Failed to cancel appointment.');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-bold text-xs uppercase tracking-widest text-slate-400 animate-pulse">
          Syncing Portal...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] p-4 sm:p-6 lg:p-8 w-full max-w-[100vw] overflow-x-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── LIVE QUEUE ──────────────────────────────────────────────── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-1 uppercase">
                  Upcoming Sessions
                </h1>
                <p className="text-slate-500 font-semibold uppercase text-xs tracking-wider">
                  Medical Sessions
                </p>
              </div>
              {liveData.length > 0 && (
                <div className="inline-flex items-center bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800/50 sm:ml-2">
                  <Activity size={12} className="mr-1.5 animate-pulse" />
                  {liveData.length} In Queue
                </div>
              )}
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={fetchPatientAppointments}
                className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-slate-500 hover:text-blue-600 transition-all flex-shrink-0"
                title="Refresh"
              >
                <RefreshCcw size={18} />
              </button>
              <button
                onClick={() => navigate('/patient/book')}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center justify-center w-full group"
              >
                <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" />
                New Booking
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveData.length === 0 ? (
              <div className="col-span-full bg-white dark:bg-[#111827] rounded-[2rem] p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                  No Active Sessions
                </h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                  You're not currently in any live queue. Book a new appointment to join.
                </p>
              </div>
            ) : (
              liveData.map(app => (
                <LiveQueueCard
                  key={app.id}
                  app={app}
                  onCancel={handleCancel}
                  cancelling={cancelling === app.id}
                />
              ))
            )}
          </div>
        </section>

        {/* ── UPCOMING / PENDING ──────────────────────────────────────── */}
        {pendingData.length > 0 && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
                Upcoming Bookings
              </h2>
              <p className="text-slate-500 font-semibold uppercase text-xs tracking-wider mt-1">
                Scheduled — not yet in queue
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingData.map(app => (
                <LiveQueueCard
                  key={app.id}
                  app={app}
                  onCancel={handleCancel}
                  cancelling={cancelling === app.id}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── HISTORY ─────────────────────────────────────────────────── */}
        <HistoryTable historyData={historyData} />

      </div>
    </div>
  );
}