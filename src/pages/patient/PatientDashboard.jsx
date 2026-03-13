import React, { useState, useEffect } from 'react';
import { RefreshCcw, Plus, Ticket, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import your modular components
import PatientHeader from '../../components/patient/PatientHeader';
import LiveQueueCard from '../../components/patient/LiveQueueCard';
import HistoryTable from '../../components/patient/HistoryTable';
import api from "../../services/apiWrapper.js";

export default function PatientDashboard({ user, isDark, toggleTheme, onLogout }) {
  const [queueData, setQueueData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Simulated data fetch - this is where your apiWrapper logic will go later
  const loadData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const res = await api("GET","patient/get-appointments");
        const result = res.data;

        const formattedData = result.data.map((appointment) => ({
          id: appointment.appointment_id,

          hospital_name: appointment.hospital_name || "Unknown Hospital",

          speciality: appointment.department || "General",

          doctor_name: appointment.assigned_doctor || "Not Assigned",

          token_number: appointment.token_number
            ? `Q-${appointment.token_number}`
            : "N/A",

          serving_token: appointment.serving_token
            ? `Q-${appointment.serving_token}`
            : "N/A",

          isEmergency: appointment.isEmergency || false,

          status:
            appointment.status === "waiting"
              ? "Waiting"
              : appointment.status === "in_progress"
              ? "In-Progress"
              : appointment.status === "completed"
              ? "Completed"
              : appointment.status,
        }));

        setQueueData(formattedData);
      } catch (err) {
        console.error("Failed to fetch queue data:", err);
      } finally {
        setLoading(false);
      }
    };

  // Load data when the component mounts or the user changes
  useEffect(() => { 
    loadData(); 
  }, [user]);

  // Handle removing a cancelled appointment from the local state
  const handleCancel = (id) => {
    setQueueData(prev => prev.filter(a => a.id !== id));
    // Here you would also call your API to cancel it in the database
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
        <p className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-400 animate-pulse">Establishing Secure Uplink...</p>
      </div>
    );
  }

  // 2. Main Dashboard Render
  return (
    <div className="space-y-16 pb-8">
      
      {/* Improvised Patient Header */}
      <PatientHeader 
        user={user} 
        activeCount={queueData.length} 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        onLogout={onLogout} 
      />

      {/* Active Overview Section */}
      <section>
        <div className="flex items-center justify-between mb-8 px-2">
          <div>
            <h1 className="text-5xl font-black tracking-tighter dark:text-white leading-none mb-1 uppercase">Portal</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em]">Aggregated Live Sessions</p>
          </div>
          <div className="flex gap-4">
             <button onClick={loadData} className="p-3.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-sm text-slate-400 hover:text-blue-600 transition-all">
               <RefreshCcw size={20} />
             </button>
             <button onClick={() => navigate('/patient/book')} className="bg-blue-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center group">
               <Plus size={20} className="mr-2 group-hover:rotate-90 transition-transform" /> New Booking
             </button>
          </div>
        </div>

        {/* Live Queue Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {queueData.map(app => (
            <LiveQueueCard key={app.id} app={app} onCancel={handleCancel} />
          ))}
          
          {/* Empty State Fallback */}
          {queueData.length === 0 && (
            <div className="col-span-full py-24 text-center border-4 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] animate-pulse">
               <Ticket size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-4 opacity-40" />
               <p className="font-black text-slate-400 uppercase tracking-widest text-xs">No active medical sessions found</p>
            </div>
          )}
        </div>
      </section>

      {/* History Table Component */}
      <HistoryTable />
      
    </div>
  );
}