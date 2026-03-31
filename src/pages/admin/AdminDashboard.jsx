/**
 * AdminDashboard.jsx
 *
 * ─── DATA SOURCES ────────────────────────────────────────────────────────────
 *
 *  1. STATS  (live, from queueEngine)
 *     queueEngine.init() fetches GET /global/appointments/today once.
 *     The engine builds an in-memory Map:
 *       queues → hospitalId → doctorId → { waiting[], in_progress[], completed[] }
 *     getHospitalQueues(hospitalId) returns { [doctorId]: [...active] }
 *     We derive:
 *       total     = waiting + in_progress + completed counts
 *       waiting   = sum of waiting[] lengths across all doctors
 *       completed = sum of completed[] lengths
 *       doctors   = unique doctorId keys in the hospital's map
 *
 *  2. PENDING APPROVALS  GET /hospital/approvals
 *     Normalised by normaliseApproval().
 *     Approve  → POST /auth/approve/:role/:id   (role = "doctor" | "staff", optimistic UI)
 *     Reject   → POST /auth/reject/:id           (optimistic UI)
 *
 *  3. STAFF DIRECTORY  GET /hospital/get-all-staff
 *     Returns combined staff + doctors, normalised by normaliseStaff().
 *     role field from backend is already "staff" | "doctor".
 *
 *  4. SAVE OPD DATA  POST /hospital/save-opd
 *     Sends current snapshot: { total, waiting, completed, doctorCount, pendingCount }
 *
 *  5. REALTIME (Supabase)
 *     createAppointmentChannel({ filter: `hospital_id=eq.${hospitalId}`, onEvent })
 *     Every INSERT / UPDATE / DELETE on Appointment table:
 *       → queueEngine handles it (same as PatientDashboard)
 *       → onEvent triggers recomputeStats() to re-derive stats from engine
 *     Polling fallback every 30 s to recomputeStats.
 *
 * ─── TOKEN LOGIC NOTE ────────────────────────────────────────────────────────
 *  Mirroring PatientDashboard's approach:
 *    getDoctorQueue(hospitalId, doctorId) → [...in_progress, ...waiting]
 *    position = index + 1 in that array (engine rebuilds positions after every event)
 *    "Now Serving" for a doctor = the in_progress[0] appointment (position 1)
 *    "Waiting"  count = waiting[].length for that doctor
 *  DepartmentQueues component receives already-computed doctor cards with this info.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Save, Loader2 } from 'lucide-react';

import AdminHeader        from '../../components/admin/AdminHeader';
import PendingApprovals   from '../../components/admin/PendingApprovals';
import DepartmentQueues   from '../../components/admin/DepartmentQueues';
import StaffDirectory     from '../../components/admin/StaffDirectory';

import api                from '../../services/apiWrapper';
import queueEngine        from '../../services/queueEngine';
import { createAppointmentChannel, removeChannel } from '../../services/realtimeService';

function normaliseApproval(raw) {
  return {
    id:         raw.id,
    name:       raw.name       || 'Unknown',
    email:      raw.email      || '—',
    role:       raw.role === 'doctor' ? 'Doctor' : 'Staff',   // capitalise for display
    dept:       raw.speciality || raw.department || '—',       // doctors have speciality, staff have department
    phone:      raw.phone      || '—',
    address:    raw.address    || '—',
    status:     raw.status,    // "PENDING"
    created_at: raw.created_at,
  };
}

function normaliseStaff(raw) {
  const isDoctor = raw.role === 'doctor';
  return {
    id:     raw.id,
    name:   raw.name  || 'Unknown',
    email:  raw.email || '—',
    phone:  raw.phone || '—',
    role:   isDoctor ? 'Doctor' : 'Staff',          // capitalised for display
    dept:   isDoctor
              ? (raw.speciality  || 'General')
              : (raw.department  || 'General'),
    status: raw.status
              ? (raw.status.toLowerCase() === 'active' ? 'Active' : 'Offline')
              : 'Active',                             // default to Active if backend omits it
  };
}

function normaliseStats(hospitalId, pendingCount) {
  const hospitalMap = queueEngine.queues.get(hospitalId);

  if (!hospitalMap) {
    return { total: 0, waiting: 0, completed: 0, doctorCount: 0, pendingUsers: pendingCount };
  }

  let waiting   = 0;
  let completed = 0;
  let inProgress = 0;

  hospitalMap.forEach((doctorQueue) => {
    waiting    += doctorQueue.waiting.length;
    completed  += doctorQueue.completed.length;
    inProgress += doctorQueue.in_progress.length;
  });

  const total      = waiting + completed + inProgress;
  const doctorCount = hospitalMap.size;

  return {
    total,
    waiting,
    completed,
    doctorCount,
    pendingUsers: pendingCount,
  };
}

function normaliseDepartmentQueues(hospitalId, staffDirectory) {
  const hospitalMap = queueEngine.queues.get(hospitalId);
  if (!hospitalMap) return [];

  const deptMap = {}; 

  hospitalMap.forEach((doctorQueue, doctorId) => {
    const docInfo = staffDirectory.find(s => s.id === doctorId && s.role === 'Doctor');
    const docName = docInfo?.name  || `Doctor ${doctorId.slice(0, 6)}`;
    const dept    = docInfo?.dept  || 'General';

    const activeQueue = queueEngine.getDoctorQueue(hospitalId, doctorId);
    const servingApp  = doctorQueue.in_progress[0] || null;

    const servingToken = servingApp
      ? `Q-${queueEngine.getPatientPosition(servingApp.appointment_id) ?? 1}`
      : null;

    const doctorCard = {
      name:    docName,
      status:  doctorQueue.in_progress.length > 0 ? 'Busy' : 'Available',
      current: servingToken,
      waiting: doctorQueue.waiting.length,
    };

    if (!deptMap[dept]) deptMap[dept] = [];
    deptMap[dept].push(doctorCard);
  });

  return Object.entries(deptMap).map(([name, doctors]) => ({ name, doctors }));
}


export default function AdminDashboard({ user }) {
  const hospitalId = user?.id;

  const [stats,          setStats]          = useState({ total: 0, waiting: 0, completed: 0, doctorCount: 0, pendingUsers: 0 });
  const [pendingUsers,   setPendingUsers]   = useState([]);
  const [directory,      setDirectory]      = useState([]);
  const [deptQueues,     setDeptQueues]     = useState([]);

  const [loadingApprovals, setLoadingApprovals] = useState(true);
  const [loadingStaff,     setLoadingStaff]     = useState(true);
  const [saving,           setSaving]           = useState(false);

  const channelRef  = useRef(null);
  const pollingRef  = useRef(null);

  const recomputeFromEngine = useCallback(() => {
    const s = normaliseStats(hospitalId, pendingUsers.length);
    setStats(s);

  }, [hospitalId, pendingUsers.length]);

  const directoryRef = useRef([]);

  const recomputeDeptQueues = useCallback(() => {
    const dq = normaliseDepartmentQueues(hospitalId, directoryRef.current);
    setDeptQueues(dq);
    console.log(dq);
  }, [hospitalId]);

  const recomputeAll = useCallback(() => {
    recomputeFromEngine();
    recomputeDeptQueues();
  }, [recomputeFromEngine, recomputeDeptQueues]);

  const fetchApprovals = useCallback(async () => {
    setLoadingApprovals(true);
    try {
      const res  = await api('GET', 'hospital/approvals');
      const raw  = res.data?.data ?? [];
      const norm = raw.map(normaliseApproval);
      setPendingUsers(norm);
    } catch (err) {
      console.error('Failed to fetch approvals:', err);
    } finally {
      setLoadingApprovals(false);
    }
  }, []);

  const fetchStaff = useCallback(async () => {
    setLoadingStaff(true);
    try {
      const res  = await api('GET', 'hospital/get-all-staff');
      const raw  = res.data?.data ?? [];
      const norm = raw.map(normaliseStaff);
      setDirectory(norm);
      directoryRef.current = norm;       
      recomputeDeptQueues();             
    } catch (err) {
      console.error('Failed to fetch staff:', err);
    } finally {
      setLoadingStaff(false);
    }
  }, [recomputeDeptQueues]);

  useEffect(() => {
    if (!hospitalId) return;

    queueEngine.init().then(() => {
      recomputeAll();
    });
    channelRef.current = createAppointmentChannel({
      filter:  `hospital_id=eq.${hospitalId}`,
      onEvent: recomputeAll,
    });

    pollingRef.current = setInterval(recomputeAll, 30000);

    fetchApprovals();
    fetchStaff();

    return () => {
      if (channelRef.current) removeChannel(channelRef.current);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [hospitalId]);  

  useEffect(() => {
    recomputeFromEngine();
  }, [pendingUsers.length]);   

  const handleApprove = async (id) => {
    const approved = pendingUsers.find(u => u.id === id);
    const roleForUrl = approved?.role?.toLowerCase() ?? 'hospital-staff';
    setPendingUsers(prev => prev.filter(u => u.id !== id));

    try {
      await api('POST', `auth/approve/${roleForUrl}/${id}`);
      await fetchStaff();
    } catch (err) {
      console.error('Approve failed:', err);
      if (approved) setPendingUsers(prev => [...prev, approved]);
      alert(err?.response?.data?.message || 'Failed to approve. Please try again.');
    }
  };


  const handleReject = async (id) => {
    const rejected = pendingUsers.find(u => u.id === id);
    setPendingUsers(prev => prev.filter(u => u.id !== id));

    try {
      await api('POST', `auth/reject/${id}`);
    } catch (err) {
      console.error('Reject failed:', err);
      if (rejected) setPendingUsers(prev => [...prev, rejected]);
      alert(err?.response?.data?.message || 'Failed to reject. Please try again.');
    }
  };

  const handleSaveOPD = async () => {
    setSaving(true);
    try {
      const payload = {
        total_patients: stats.total,
        total_doctors:   stats.doctorCount,
        pending_staff:  stats.pendingUsers,
      };
      await api('POST', 'hospital/save-opd', payload);
      alert('OPD data saved successfully!');
    } catch (err) {
      console.error('Save OPD failed:', err);
      alert(err?.response?.data?.message || 'Failed to save OPD data.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] p-4 sm:p-6 lg:p-8 w-full max-w-[100vw] overflow-x-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* ── HEADER: live stats from queueEngine ── */}
        <div className="space-y-4">
          <AdminHeader stats={stats} />

          {/* Save OPD Button — sits just below the stat cards */}
          <div className="flex justify-end">
            <button
              onClick={handleSaveOPD}
              disabled={saving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
            >
              {saving
                ? <Loader2 size={16} className="animate-spin" />
                : <Save size={16} />
              }
              {saving ? 'Saving...' : 'Save OPD Data'}
            </button>
          </div>
        </div>

        {/* ── PENDING APPROVALS + STAFF DIRECTORY ── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <PendingApprovals
            pendingUsers={pendingUsers}
            loading={loadingApprovals}
            onApprove={handleApprove}
            onReject={handleReject}
          />

          <StaffDirectory
            directory={directory}
            loading={loadingStaff}
          />
        </div>

        {/* ── LIVE DEPARTMENT QUEUES from queueEngine ── */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <DepartmentQueues departments={deptQueues} />
        </div>

      </div>
    </div>
  );
}