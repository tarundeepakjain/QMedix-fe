import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import WizardHeader from '../../components/patient/booking/WizardHeader';
import StepHospital from '../../components/patient/booking/StepHospital';
import StepDepartment from '../../components/patient/booking/StepDepartment';
import StepDoctor from '../../components/patient/booking/StepDoctor';
import { StepSchedule, StepConfirm } from '../../components/patient/booking/StepScheduleAndConfirm';

import { useHospitals } from '../../data/hospitals';
import api from '../../services/apiWrapper';

export default function BookAppointment({ user }) {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const { hospitalMap } = useHospitals();
  const hospitals = Object.values(hospitalMap);

  const [doctors,         setDoctors]         = useState([]);
  const [departments,     setDepartments]     = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [fetchingDoctors, setFetchingDoctors] = useState(false);
  const [submitting,      setSubmitting]      = useState(false);

  const [formData, setFormData] = useState({
    hospital_id:   null,
    hospital_name: '',
    department:    null,
    pref_doctor:   null,
    doctor_name:   '',
    bookingDate:   '',
    isEmergency:   false,
  });

  // ── Step 1 → 2: pick hospital ────────────────────────────────────────────
  const selectHospital = async (hosp) => {
    setFormData(prev => ({
      ...prev,
      hospital_id:   hosp.id,
      hospital_name: hosp.name,
      department:    null,
      pref_doctor:   null,
      doctor_name:   '',
      bookingDate:   '',
    }));

    setFetchingDoctors(true);
    try {
      const res            = await api('GET', `doctor/all/${hosp.id}`);
      const fetchedDoctors = res.data?.doctors ?? [];
      setDoctors(fetchedDoctors);

      // Derive unique departments from available doctors' speciality
      const depts = [
        ...new Set(
          fetchedDoctors
            .filter(d => d.isAvailable && d.speciality)
            .map(d => d.speciality)
        ),
      ];

      // ✅ If no departments found, fall back to ["General"]
      setDepartments(depts.length > 0 ? depts : ['General']);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      setDoctors([]);
      setDepartments(['General']); // ✅ fallback on error too
    } finally {
      setFetchingDoctors(false);
    }

    setStep(2);
  };

  // ── Step 2 → 3: pick department ──────────────────────────────────────────
  const selectDepartment = (dept) => {
    setFormData(prev => ({
      ...prev,
      department:  dept,
      pref_doctor: null,
      doctor_name: '',
    }));

    // Filter available doctors for this dept; if "General" show all available
    const filtered =
      dept === 'General'
        ? doctors.filter(d => d.isAvailable)
        : doctors.filter(d => d.speciality === dept && d.isAvailable);

    setFilteredDoctors(filtered);
    setStep(3);
  };

  // ── Step 3 → 4: pick doctor ──────────────────────────────────────────────
  const selectDoctor = (doc) => {
    setFormData(prev => ({
      ...prev,
      pref_doctor: doc.id,
      doctor_name: doc.name,
    }));
    setStep(4);
  };

  // ── Step 5: submit ───────────────────────────────────────────────────────
  const submitBooking = async () => {
    setSubmitting(true);
    try {
      const payload = {
        hospital_id: formData.hospital_id,
        pref_doctor: formData.pref_doctor,
        department:  formData.department,
        isEmergency: formData.isEmergency,
        bookingDate: formData.bookingDate,
        timeSlot:    formData.timeSlot,   // ✅ was missing — backend needs this
      };

      const res = await api('POST', 'patient/book-appointment', payload);

      if (res.status === 200 || res.status === 201) {
        navigate('/patient/dashboard');
      } else {
        alert('Booking failed. Please try again.');
        setSubmitting(false);
      }
    } catch (err) {
      console.error('Booking error:', err);
      alert(err?.response?.data?.message || 'Booking failed. Please try again.');
      setSubmitting(false);
    }
  };

  // Shape for StepDoctor
  const doctorCards = filteredDoctors.map(d => ({
    id:            d.id,
    name:          d.name,
    speciality:    d.speciality || 'General',
    nextAvailable: 'Today',
  }));

  // Shape for StepHospital
  const hospitalCards = hospitals.map(h => ({
    id:        h.id,
    name:      h.name,
    location:  h.address || 'Address not listed',
    isOpen:    true,
    emergency: false,
  }));

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <WizardHeader step={step} setStep={setStep} />

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] p-6 sm:p-10 shadow-xl min-h-[400px]">
        {fetchingDoctors ? (
          <div className="py-32 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
            <p className="font-black text-[10px] uppercase tracking-widest text-slate-400">
              Loading Department Data...
            </p>
          </div>
        ) : (
          <>
            {step === 1 && (
              <StepHospital
                hospitals={hospitalCards}
                selectHospital={selectHospital}
              />
            )}
            {step === 2 && (
              <StepDepartment
                departments={departments}
                formData={formData}
                setFormData={setFormData}
                selectDepartment={selectDepartment}
              />
            )}
            {step === 3 && (
              // If no doctors available even for General, show message
              filteredDoctors.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-slate-400 font-bold text-sm">
                    No available doctors in this department right now.
                  </p>
                  <button
                    onClick={() => setStep(2)}
                    className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                  >
                    ← Choose another department
                  </button>
                </div>
              ) : (
                <StepDoctor
                  doctors={doctorCards}
                  formData={formData}
                  selectDoctor={selectDoctor}
                />
              )
            )}
            {step === 4 && (
              <StepSchedule
                formData={formData}
                setFormData={setFormData}
                setStep={setStep}
              />
            )}
            {step === 5 && (
              <StepConfirm
                formData={formData}
                submitBooking={submitBooking}
                submitting={submitting}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}