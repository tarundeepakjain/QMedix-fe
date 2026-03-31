import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReceptionHeader       from '../../components/reception/ReceptionHeader';
import DoctorList            from '../../components/reception/DoctorList';
import RecentTokens          from '../../components/reception/RecentTokens';
import RegisterPatientModal  from '../../components/reception/RegisterPatientModal';
import EmergencyRequests     from '../../components/reception/Emergencyrequests';

import api                   from '../../services/apiWrapper';
import queueEngine           from '../../services/queueEngine';
import { createAppointmentChannel, removeChannel } from '../../services/realtimeService';
import { useDoctors }        from '../../data/doctor';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildDoctorCards(hospitalId, doctorMap) {
  const hospitalMap = queueEngine.queues.get(hospitalId);
  if (!hospitalMap) return [];

  const cards = [];

  hospitalMap.forEach((doctorQueue, doctorId) => {
    const meta = doctorMap[doctorId] ?? {};

    const inProg  = doctorQueue.in_progress[0] ?? null;
    const current = inProg
      ? {
          token:     `Q-${queueEngine.getPatientPosition(inProg.appointment_id) ?? 1}`,
          name:      inProg.patient_name ?? 'Patient',
          emergency: inProg.isEmergency  ?? false,
        }
      : null;

    const queue = doctorQueue.waiting.map(app => ({
      id:        app.appointment_id,
      token:     `Q-${queueEngine.getPatientPosition(app.appointment_id) ?? '?'}`,
      name:      app.patient_name ?? 'Patient',
      emergency: app.isEmergency  ?? false,
    }));

    cards.push({
      id:     doctorId,
      name:   meta.name       ?? `Doctor ${doctorId.slice(0, 6)}`,
      dept:   meta.speciality ?? 'General',
      status: inProg ? 'Busy' : 'Available',
      current,
      queue,
    });
  });

  return cards;
}

function getDepartments(doctorCards) {
  return ['All', ...new Set(doctorCards.map(d => d.dept).filter(Boolean))];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReceptionDashboard({ user }) {
  const hospitalId = user?.hospital_id ?? user?.id;

  const { doctorMap } = useDoctors(hospitalId);

  const [doctorCards,         setDoctorCards]         = useState([]);
  const [departments,         setDepartments]         = useState(['All']);
  const [selectedDept,        setSelectedDept]        = useState('All');
  const [expandedDocId,       setExpandedDocId]       = useState(null);
  const [showAddModal,        setShowAddModal]        = useState(false);
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [submittingWalkin,    setSubmittingWalkin]    = useState(false);

  const [newPatient, setNewPatient] = useState({
    name: '', dept: '', doctorId: '', isEmergency: false,
  });

  const channelRef   = useRef(null);
  const pollingRef   = useRef(null);
  // Always holds the latest recompute — channel/interval read from this ref
  // so they never hold a stale closure over doctorMap
  const recomputeRef = useRef(null);
  // Always holds the latest doctorMap without causing channel to re-subscribe
  const doctorMapRef = useRef(doctorMap);

  // Keep doctorMapRef current on every render
  useEffect(() => {
    doctorMapRef.current = doctorMap;
  });

  // recompute reads doctorMapRef.current — never stale, never depends on doctorMap
  const recompute = useCallback(() => {
    const cards = buildDoctorCards(hospitalId, doctorMapRef.current);
    setDoctorCards(cards);
    setDepartments(getDepartments(cards));
  }, [hospitalId]);

  // Keep recomputeRef pointing to latest recompute after every render
  useEffect(() => {
    recomputeRef.current = recompute;
  });

  // Init engine + wire up channel and polling ONCE per hospitalId
  useEffect(() => {
    if (!hospitalId) return;

    // Stable wrapper — always calls whatever recomputeRef holds at invocation time
    const stableOnEvent = () => recomputeRef.current?.();

    queueEngine.init().then(stableOnEvent);

    channelRef.current = createAppointmentChannel({
      filter:  `hospital_id=eq.${hospitalId}`,
      onEvent: stableOnEvent,
    });

    pollingRef.current = setInterval(stableOnEvent, 30_000);

    return () => {
      if (channelRef.current) removeChannel(channelRef.current);
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [hospitalId]);

  // Also recompute whenever doctorMap finishes loading (useDoctors is async)
  useEffect(() => {
    recompute();
  }, [doctorMap, recompute]);

  // Auto-select first available doctor when dept changes in modal
  useEffect(() => {
    const available = doctorCards.filter(d => d.dept === newPatient.dept);
    if (available.length > 0 && newPatient.doctorId !== available[0].id) {
      setNewPatient(prev => ({ ...prev, doctorId: available[0].id }));
    }
  }, [newPatient.dept, doctorCards]);

  // ── Walk-in registration ───────────────────────────────────────────────────
  const handleRegisterPatient = async (e) => {
    e.preventDefault();
    if (!newPatient.name)     return alert('Please enter a patient name');
    if (!newPatient.doctorId) return alert('Please select a doctor');

    setSubmittingWalkin(true);
    try {
      const res = await api('POST', 'staff/register-walkin', {
        patient_name: newPatient.name,
        doctor_id:    newPatient.doctorId,
        hospital_id:  hospitalId,
        isEmergency:  newPatient.isEmergency,
      });

      if (res.status === 200 || res.status === 201) {
        const token       = res.data?.token ?? '—';
        const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setRecentRegistrations(prev => [
          { token, name: newPatient.name, time: currentTime, type: 'Walk-in' },
          ...prev.slice(0, 4),
        ]);

        setExpandedDocId(newPatient.doctorId);
        setShowAddModal(false);
        setNewPatient({ name: '', dept: '', doctorId: '', isEmergency: false });

        await queueEngine.init();
        recompute();
      }
    } catch (err) {
      console.error('Walk-in registration failed:', err);
      alert(err?.response?.data?.message ?? 'Registration failed. Please try again.');
    } finally {
      setSubmittingWalkin(false);
    }
  };

  // ── Cancel appointment ─────────────────────────────────────────────────────
  const handleCancel = async (docId, appointmentId) => {
    setDoctorCards(prev =>
      prev.map(doc =>
        doc.id === docId
          ? { ...doc, queue: doc.queue.filter(p => p.id !== appointmentId) }
          : doc
      )
    );
    try {
      await api('DELETE', `staff/cancel-appointment/${appointmentId}`);
    } catch (err) {
      console.error('Cancel failed:', err);
      alert(err?.response?.data?.message ?? 'Failed to cancel. Please refresh.');
      recompute();
    }
  };

  // ── Toggle emergency ───────────────────────────────────────────────────────
  const handleToggleEmergency = async (docId, appointmentId) => {
    setDoctorCards(prev =>
      prev.map(doc => {
        if (doc.id !== docId) return doc;
        const updatedQueue = doc.queue
          .map(p => p.id === appointmentId ? { ...p, emergency: !p.emergency } : p)
          .sort((a, b) => (a.emergency === b.emergency ? 0 : a.emergency ? -1 : 1));
        return { ...doc, queue: updatedQueue };
      })
    );
    try {
      await api('POST', `staff/toggle-emergency/${appointmentId}`);
    } catch (err) {
      console.error('Toggle emergency failed:', err);
      recompute();
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const filteredDoctors = selectedDept === 'All'
    ? doctorCards
    : doctorCards.filter(d => d.dept === selectedDept);

  const availableFormDoctors = newPatient.dept
    ? doctorCards.filter(d => d.dept === newPatient.dept)
    : doctorCards;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] p-4 sm:p-6 lg:p-8 w-full max-w-[100vw] overflow-x-hidden transition-colors duration-500 relative">
      <div className="max-w-7xl mx-auto space-y-6">

        <ReceptionHeader
          departments={departments}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          onOpenModal={() => setShowAddModal(true)}
        />

        {/* ← grid-cols-3 → grid-cols-4 to add EmergencyRequests column */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <DoctorList
            doctors={filteredDoctors}
            expandedDocId={expandedDocId}
            onToggleAccordion={id => setExpandedDocId(expandedDocId === id ? null : id)}
            onToggleEmergency={handleToggleEmergency}
            onCancel={handleCancel}
          />
          <RecentTokens recentRegistrations={recentRegistrations} />
          <EmergencyRequests hospitalId={hospitalId} />
        </div>
      </div>

      {showAddModal && (
        <RegisterPatientModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleRegisterPatient}
          newPatient={newPatient}
          setNewPatient={setNewPatient}
          departments={departments}
          availableFormDoctors={availableFormDoctors}
          submitting={submittingWalkin}
        />
      )}
    </div>
  );
}