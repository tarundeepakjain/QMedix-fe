import React, { useState, useEffect } from 'react';
import ReceptionHeader from '../../components/reception/ReceptionHeader';
import DoctorList from '../../components/reception/DoctorList';
import RecentTokens from '../../components/reception/RecentTokens';
import RegisterPatientModal from '../../components/reception/RegisterPatientModal';

export default function ReceptionDashboard() {
  const departments = ['All', 'Cardiology', 'Pediatrics', 'Neurology', 'Orthopedics'];
  const [selectedDept, setSelectedDept] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedDocId, setExpandedDocId] = useState(null);

  // state
  const [doctors, setDoctors] = useState([
    {
      id: 'd1', name: "Dr. Robert Smith", dept: "Cardiology", status: "Available",
      current: { token: 'Q-42', name: 'Sarah Jenkins', emergency: false },
      queue: [
        { id: 'p1', token: 'Q-43', name: 'Michael Chen', emergency: true },
        { id: 'p2', token: 'Q-44', name: 'Emma Watson', emergency: false }
      ]
    },
    {
      id: 'd2', name: "Dr. Sarah Jenkins", dept: "Pediatrics", status: "On Break",
      current: null,
      queue: [
        { id: 'p3', token: 'P-12', name: 'Liam Johnson', emergency: false },
        { id: 'p4', token: 'P-13', name: 'Noah Brown', emergency: false }
      ]
    },
    {
      id: 'd3', name: "Dr. Emily Chen", dept: "Neurology", status: "Available",
      current: { token: 'N-08', name: 'Olivia Davis', emergency: true },
      queue: []
    }
  ]);

  const [recentRegistrations, setRecentRegistrations] = useState([
    { token: 'Q-46', name: 'Olivia Davis', time: '10:45 AM', type: 'Walk-in' },
    { token: 'P-12', name: 'Liam Johnson', time: '10:42 AM', type: 'App' },
    { token: 'N-08', name: 'Emma Wilson', time: '10:30 AM', type: 'App' }
  ]);

  const [newPatient, setNewPatient] = useState({ name: '', dept: 'Cardiology', doctorId: 'd1', isEmergency: false });

  // Update doctorId automatically if department changes in the modal
  useEffect(() => {
    const available = doctors.filter(d => d.dept === newPatient.dept);
    if(available.length > 0) setNewPatient(prev => ({...prev, doctorId: available[0].id}));
  }, [newPatient.dept, doctors]);


  // actions
  const handleRegisterPatient = (e) => {
    e.preventDefault();
    if (!newPatient.name) return alert("Please enter a patient name");

    const tokenPrefix = newPatient.dept.charAt(0).toUpperCase();
    const mockToken = `${tokenPrefix}-${Math.floor(Math.random() * 90 + 10)}`;
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const patientObj = {
      id: Date.now().toString(),
      token: mockToken,
      name: newPatient.name,
      emergency: newPatient.isEmergency
    };

    // Add to doctor's queue
    setDoctors(prevDocs => prevDocs.map(doc => {
      if (doc.id === newPatient.doctorId) {
        let updatedQueue = [...doc.queue, patientObj];
        if (patientObj.emergency) {
          updatedQueue.sort((a, b) => (a.emergency === b.emergency ? 0 : a.emergency ? -1 : 1));
        }
        return { ...doc, queue: updatedQueue };
      }
      return doc;
    }));

    // Add to Recent Tokens Feed dynamically!
    setRecentRegistrations(prev => [
      { token: mockToken, name: newPatient.name, time: currentTime, type: 'Walk-in' },
      ...prev.slice(0, 4) // Keep only the top 5 recent
    ]);

    setShowAddModal(false);
    setNewPatient({ name: '', dept: 'Cardiology', doctorId: 'd1', isEmergency: false });
    setExpandedDocId(newPatient.doctorId); 
  };

  const handleCancel = (docId, patientId) => {
    setDoctors(prevDocs => prevDocs.map(doc => {
      if (doc.id === docId) {
        return { ...doc, queue: doc.queue.filter(p => p.id !== patientId) };
      }
      return doc;
    }));
  };

  const handleToggleEmergency = (docId, patientId) => {
    setDoctors(prevDocs => prevDocs.map(doc => {
      if (doc.id === docId) {
        let updatedQueue = doc.queue.map(p => 
          p.id === patientId ? { ...p, emergency: !p.emergency } : p
        );
        updatedQueue.sort((a, b) => (a.emergency === b.emergency ? 0 : a.emergency ? -1 : 1));
        return { ...doc, queue: updatedQueue };
      }
      return doc;
    }));
  };

  const toggleAccordion = (id) => {
    setExpandedDocId(expandedDocId === id ? null : id);
  };

  const filteredDoctors = selectedDept === 'All' ? doctors : doctors.filter(d => d.dept === selectedDept);
  const availableFormDoctors = doctors.filter(d => d.dept === newPatient.dept);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] p-4 sm:p-6 lg:p-8 w-full max-w-[100vw] overflow-x-hidden transition-colors duration-500 relative">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <ReceptionHeader 
          departments={departments}
          selectedDept={selectedDept}
          setSelectedDept={setSelectedDept}
          onOpenModal={() => setShowAddModal(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DoctorList 
            doctors={filteredDoctors}
            expandedDocId={expandedDocId}
            onToggleAccordion={toggleAccordion}
            onToggleEmergency={handleToggleEmergency}
            onCancel={handleCancel}
          />

          <RecentTokens recentRegistrations={recentRegistrations} />
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
        />
      )}
    </div>
  );
}