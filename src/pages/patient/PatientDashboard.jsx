import React, { useState, useEffect } from 'react';
// Added 'Activity' to your imports for the new badge
import { RefreshCcw, Plus, Activity, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Notice: Removed PatientHeader import completely!
import LiveQueueCard from '../../components/patient/LiveQueueCard';
import HistoryTable from '../../components/patient/HistoryTable';
import api from "../../services/apiWrapper.js";

export default function PatientDashboard({ user, isDark, toggleTheme, onLogout }) {
  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await api("GET","patient/get-appointments");
        const formattedData = res.data.data.map((appointment) => ({
          id: appointment.appointment_id,
          hospital_name: appointment.hospital_name || "Unknown Hospital",
          speciality: appointment.department || "General",
          doctor_name: appointment.assigned_doctor || "Not Assigned",
          token_number: appointment.token_number ? `Q-${appointment.token_number}` : "Pending",
          serving_token: appointment.serving_token ? `Q-${appointment.serving_token}` : "N/A",
          isEmergency: appointment.isEmergency || false,
          status: appointment.status === "waiting" ? "Waiting" 
                : appointment.status === "in_progress" ? "In-Progress" 
                : appointment.status === "completed" ? "Completed" 
                : appointment.status,
        }));
        setQueueData(formattedData);
      } catch (err) {
        console.error("Failed to fetch queue data:", err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => { loadData(); }, [user]);

  const handleCancel = async (id) => {
    setQueueData(prev => prev.filter(a => a.id !== id));
    // Add your API delete call here later!
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-bold text-xs uppercase tracking-widest text-slate-400 animate-pulse">Syncing Portal...</p>
      </div>
    );
  }

  return (
    // Added the responsive mobile lock container here
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] p-4 sm:p-6 lg:p-8 w-full max-w-[100vw] overflow-x-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* --- ACTIVE PORTAL SECTION --- */}
        <section>
          {/* THE NEW HEADER WITH INLINE BADGE */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-2">
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white mb-1 uppercase">Active Portal</h1>
                <p className="text-slate-500 font-semibold uppercase text-xs tracking-wider">Live Medical Sessions</p>
              </div>
              
              {/* Dynamic Active Appointments Pill */}
              {queueData.length > 0 && (
                <div className="inline-flex items-center bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800/50 sm:ml-2">
                  <Activity size={12} className="mr-1.5 animate-pulse" />
                  {queueData.length} Active Appointment{queueData.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
               <button onClick={loadData} className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm text-slate-500 hover:text-blue-600 transition-all flex-shrink-0">
                 <RefreshCcw size={18} />
               </button>
               <button onClick={() => navigate('/patient/book')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md hover:bg-blue-700 transition-all flex items-center justify-center w-full group">
                 <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" /> New Booking
               </button>
            </div>
          </div>

          {/* THE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Show an elegant empty state if the API returns 0 active appointments */}
            {queueData.length === 0 ? (
              <div className="col-span-full bg-white dark:bg-[#111827] rounded-[2rem] p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No Active Sessions</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">You don't have any appointments currently in progress. Book a new appointment to join a virtual queue.</p>
              </div>
            ) : (
              queueData.map(app => (
                <LiveQueueCard key={app.id} app={app} onCancel={handleCancel} />
              ))
            )}
          </div>
        </section>

        <HistoryTable />
        
      </div>
    </div>
  );
}