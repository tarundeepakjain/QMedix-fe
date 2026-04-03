import React, { useState, useEffect, useRef, useCallback } from 'react';
import DoctorHeader from '../../components/doctor/DoctorHeader';
import ActiveSession from '../../components/doctor/ActiveSession';
import QueueControls from '../../components/doctor/QueueControls';
import QueueTable from '../../components/doctor/QueueTable';
import api from '../../services/apiWrapper';
import queueEngine from '../../services/queueEngine';
import { createAppointmentChannel, removeChannel } from '../../services/realtimeService';
import { useHospitals } from '../../data/hospitals';
import { useDoctors } from '../../data/doctor';

const TOGGLE_COOLDOWN_MS = 5000;
const TOGGLE_KEY = 'doctor_last_toggle';

function normaliseQueueItem(app, patientMap) {
  const patient = patientMap.get(app.patient_id) ?? {};
  const pos = queueEngine.getPatientPosition(app.appointment_id);
  return {
    id:           app.id ?? app.appointment_id,
    appointment_id: app.id ?? app.appointment_id,
    patient_id:   app.patient_id,
    token: pos ? `Q-${pos}` : '—',
    name:         patient.name  ?? 'Patient',
    age:          patient.age   ?? null,
    dob:          patient.dob   ?? null,
    gender:       patient.gender ?? '—',
    phone:        patient.phone  ?? '—',
    isEmergency:  app.isEmergency ?? false,
    booked_for:   app.booked_for,
    status:       app.status,
  };
}

export default function DoctorDashboard({ user }) {
  const doctorId   = user?.id;
  const hospitalId = user?.hospital_id;

  const { getHospital } = useHospitals();
  const { getDoctor }   = useDoctors(hospitalId);

  const doctorInfo   = getDoctor(doctorId)   ?? {};
  const hospitalInfo = getHospital(hospitalId) ?? {};
// console.log(doctorInfo);
  const [isAvailable,    setIsAvailable]    = useState(false);
  const [toggling,       setToggling]       = useState(false);
  const [queue,          setQueue]          = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [completing,     setCompleting]     = useState(false);

  const [remarks, setRemarks] = useState({
    age:       '',
    medicines: '',
    diagnosis: '',
    notes:     '',
  });

  const startedAtRef  = useRef(null);
  const channelRef    = useRef(null);
  const patientMapRef = useRef(new Map());
useEffect(() => {
  if (doctorInfo?.isAvailable !== undefined) {
    setIsAvailable(doctorInfo.isAvailable);
  }
}, [doctorInfo]);
  const buildQueue = useCallback(() => {
    if (!hospitalId || !doctorId) return;
    const raw = queueEngine.getDoctorQueue(hospitalId, doctorId);
    const normalised = raw.map((app, index) => {
      const patient = patientMapRef.current.get(app.patient_id) ?? {};

      return {
        id: app.id ?? app.appointment_id,
        appointment_id: app.id ?? app.appointment_id,
        patient_id: app.patient_id,

        token: `Q-${index + 1}`,   // ✅ local numbering

        name: patient.name ?? 'Patient',
        age: patient.age ?? null,
        dob: patient.dob ?? null,
        gender: patient.gender ?? '—',
        phone: patient.phone ?? '—',

        isEmergency: app.isEmergency ?? false,
        booked_for: app.booked_for,
        status: app.status,
      };
    });
    setQueue(normalised);

    const inProgressRaw = queueEngine.queues
      ?.get(hospitalId)
      ?.get(doctorId)
      ?.in_progress ?? [];

    const completedRaw = queueEngine.queues
      ?.get(hospitalId)
      ?.get(doctorId)
      ?.completed ?? [];

    setCompletedCount(completedRaw.length);

    if (inProgressRaw.length > 0 && !currentPatient) {
      const app = inProgressRaw[0];
      setCurrentPatient(normaliseQueueItem(app, patientMapRef.current));
      if (!startedAtRef.current) {
        startedAtRef.current = app.started_at ?? new Date().toISOString();
      }
    }
  }, [hospitalId, doctorId, currentPatient]);

  const fetchPatientDetails = useCallback(async (patientIds) => {
    const toFetch = patientIds.filter(id => id && !patientMapRef.current.has(id));
    if (toFetch.length === 0) return;
    try {
      const res = await api('POST', 'patient/batch-details', { ids: toFetch });
      const patients = res.data?.patients ?? [];
      patients.forEach(p => patientMapRef.current.set(p.id, p));
    } catch (err) {
      console.error('Failed to fetch patient details:', err);
    }
  }, []);

  const refreshQueue = useCallback(async () => {
    if (!hospitalId || !doctorId) return;
    const raw = queueEngine.getDoctorQueue(hospitalId, doctorId);
    const ids = [...new Set(raw.map(a => a.patient_id).filter(Boolean))];
    await fetchPatientDetails(ids);
    buildQueue();
  }, [hospitalId, doctorId, fetchPatientDetails, buildQueue]);

  useEffect(() => {
    if (!hospitalId || !doctorId) return;

    queueEngine.init().then(() => {
      refreshQueue();
    });

    channelRef.current = createAppointmentChannel({
      filter:  `hospital_id=eq.${hospitalId}`,
      onEvent: refreshQueue,
    });

    return () => {
      if (channelRef.current) removeChannel(channelRef.current);
    };
  }, [hospitalId, doctorId]);

  const handleCallNext = () => {
    if (queue.length === 0) return;
    const next = queue[0];
    setCurrentPatient(next);
    setQueue(prev => prev.slice(1));
    setRemarks({ age: '', medicines: '', diagnosis: '', notes: '' });
    startedAtRef.current = new Date().toISOString();
  };

  const buildRemarksString = () => {
    const parts = [];
    if (remarks.diagnosis) parts.push(`Diagnosis: ${remarks.diagnosis}`);
    if (remarks.medicines) parts.push(`Medicines: ${remarks.medicines}`);
    if (remarks.notes)     parts.push(`Notes: ${remarks.notes}`);
    return parts.join(' | ');
  };

  const handleComplete = async () => {
    if (!currentPatient) return;
    setCompleting(true);
    const completed_at = new Date().toISOString();
    const started_at   = startedAtRef.current ?? completed_at;
    const remarksStr   = buildRemarksString();
    try {
     const res= await api('POST', 'doctor/mark-complete', {
        appointmentId: currentPatient.appointment_id,
        remarks:   remarksStr,
        completed_at,
        started_at,
      });
      console.log(res.data);
      setCompletedCount(prev => prev + 1);
      setCurrentPatient(null);
      setRemarks({ age: '', medicines: '', diagnosis: '', notes: '' });
      startedAtRef.current = null;
    } catch (err) {
      console.error('Mark complete failed:', err);
      alert(err?.response?.data?.message ?? err?.message ?? 'Failed to complete appointment.');
    } finally {
      setCompleting(false);
    }
  };

  const handleToggleAvailability = async () => {
    const lastToggle = localStorage.getItem(TOGGLE_KEY);
    if (lastToggle) {
      const elapsed = Date.now() - parseInt(lastToggle, 10);
      if (elapsed < TOGGLE_COOLDOWN_MS) {
        const remaining = Math.ceil((TOGGLE_COOLDOWN_MS - elapsed) / 60000);
        alert(`You can toggle availability again in ${remaining} minute${remaining !== 1 ? 's' : ''}.`);
        return;
      }
    }
    setToggling(true);
    try {
      // console.log("Before toggle:", isAvailable);
      await api('POST', 'doctor/toggle-availability');
      setIsAvailable(prev => !prev);
      // console.log("After toggle:", isAvailable);
      localStorage.setItem(TOGGLE_KEY, Date.now().toString());
      // window.location.reload();
    } catch (err) {
      console.error('Toggle availability failed:', err);
      alert(err?.response?.data?.message ?? err?.message ?? 'Failed to toggle availability.');
    } finally {
      setToggling(false);
    }
  };
if (user?.status==="PENDING")  {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] px-6">
      
      <div className="max-w-md w-full text-center p-10 rounded-3xl 
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
        border border-slate-200 dark:border-slate-700 shadow-2xl">

        {/* ICON */}
        <div className="w-16 h-16 mx-auto mb-6 rounded-full 
          bg-yellow-100 dark:bg-yellow-500/10 flex items-center justify-center">
          🔒
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
          Account Pending Approval
        </h2>

        {/* MESSAGE */}
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 font-medium">
          Your account is currently under review by the hospital admin.  
          You will gain access once approved.
        </p>

        {/* STATUS BADGE */}
        <div className="inline-block px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest
          bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
          Pending Approval
        </div>

        {/* OPTIONAL ACTION */}
        <div className="mt-6">
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
          >
            Refresh Status
          </button>
        </div>

      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] p-4 sm:p-6 lg:p-8 w-full max-w-[100vw] overflow-x-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-6">
        <DoctorHeader
          doctorInfo={doctorInfo}
          hospitalInfo={hospitalInfo}
          isAvailable={isAvailable}
          toggling={toggling}
          onToggle={handleToggleAvailability}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ActiveSession
            currentPatient={currentPatient}
            remarks={remarks}
            setRemarks={setRemarks}
            onComplete={handleComplete}
            completing={completing}
          />
          <QueueControls
            onCallNext={handleCallNext}
            isAvailable={isAvailable}
            queueLength={queue.length}
            completedCount={completedCount}
          />
        </div>
        <QueueTable queue={queue} />
      </div>
    </div>
  );
}