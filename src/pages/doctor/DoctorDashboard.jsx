import React, { useState } from 'react';
import DoctorHeader from '../../components/doctor/DoctorHeader';
import ActiveSession from '../../components/doctor/ActiveSession';
import QueueControls from '../../components/doctor/QueueControls';
import QueueTable from '../../components/doctor/QueueTable';

export default function DoctorDashboard({user}) {
  // state
  const [isAvailable, setIsAvailable] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [currentPatient, setCurrentPatient] = useState(null);
  const [completedCount, setCompletedCount] = useState(12);

  // doctor's Queue
  const [queue, setQueue] = useState([
    { id: 1, token: 'Q-42', name: 'Sarah Jenkins', age: 34, gender: 'F', time: '10:00 AM' },
    { id: 2, token: 'Q-43', name: 'Michael Chen', age: 45, gender: 'M', time: '10:15 AM' },
    { id: 3, token: 'Q-44', name: 'Emma Watson', age: 28, gender: 'F', time: '10:30 AM' },
    { id: 4, token: 'Q-45', name: 'James Wilson', age: 62, gender: 'M', time: '10:45 AM' }
  ]);

  // actions
  const handleCallNext = () => {
    if (queue.length > 0) {
      setCurrentPatient(queue[0]);
      setQueue(queue.slice(1));
      setRemarks(''); 
    }
  };

  const handleComplete = () => {
    setCompletedCount(prev => prev + 1); // Dynamically update stats!
    setCurrentPatient(null);
    setRemarks('');
  };

  const handleNoShow = () => {
    setCurrentPatient(null);
    setRemarks('');
  };

  const handleSkip = () => {
    setQueue([...queue, currentPatient]);
    setCurrentPatient(null);
    setRemarks('');
  };
// if (user?.status==="PENDING")  {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0B0F19] px-6">
      
//       <div className="max-w-md w-full text-center p-10 rounded-3xl 
//         bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
//         border border-slate-200 dark:border-slate-700 shadow-2xl">

//         {/* ICON */}
//         <div className="w-16 h-16 mx-auto mb-6 rounded-full 
//           bg-yellow-100 dark:bg-yellow-500/10 flex items-center justify-center">
//           🔒
//         </div>

//         {/* TITLE */}
//         <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-3">
//           Account Pending Approval
//         </h2>

//         {/* MESSAGE */}
//         <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 font-medium">
//           Your account is currently under review by the hospital admin.  
//           You will gain access once approved.
//         </p>

//         {/* STATUS BADGE */}
//         <div className="inline-block px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest
//           bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400">
//           Pending Approval
//         </div>

//         {/* OPTIONAL ACTION */}
//         <div className="mt-6">
//           <button
//             onClick={() => window.location.reload()}
//             className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
//           >
//             Refresh Status
//           </button>
//         </div>

//       </div>
//     </div>
//   );
// }
  return (
    
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] p-4 sm:p-6 lg:p-8 w-full max-w-[100vw] overflow-x-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <DoctorHeader 
          isAvailable={isAvailable} 
          setIsAvailable={setIsAvailable} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ActiveSession 
            currentPatient={currentPatient}
            remarks={remarks}
            setRemarks={setRemarks}
            onComplete={handleComplete}
            onNoShow={handleNoShow}
            onSkip={handleSkip}
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