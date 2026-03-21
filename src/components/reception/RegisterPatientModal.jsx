import React from 'react';
import { X } from 'lucide-react';

export default function RegisterPatientModal({ 
  onClose, onSubmit, newPatient, setNewPatient, departments, availableFormDoctors 
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 p-2 rounded-full transition-colors">
          <X size={18} />
        </button>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Register Walk-in</h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Patient Name</label>
            <input 
              autoFocus required
              type="text" 
              value={newPatient.name}
              onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/50"
              placeholder="e.g. John Doe" 
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Department</label>
            <select 
              value={newPatient.dept}
              onChange={(e) => {
                setNewPatient({...newPatient, dept: e.target.value});
                // We handle resetting doctorId in the parent component for cleaner logic
              }}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
            >
              {departments.filter(d => d !== 'All').map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Assign Doctor</label>
            <select 
              required
              value={newPatient.doctorId}
              onChange={(e) => setNewPatient({...newPatient, doctorId: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
            >
              {availableFormDoctors.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.name} ({doc.queue.length} waiting)</option>
              ))}
              {availableFormDoctors.length === 0 && <option value="">No doctors available in this dept</option>}
            </select>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <input 
                type="checkbox" 
                checked={newPatient.isEmergency}
                onChange={(e) => setNewPatient({...newPatient, isEmergency: e.target.checked})}
                className="w-5 h-5 rounded border-slate-300 text-red-500 focus:ring-red-500/50"
              />
              <div>
                <p className="font-bold text-slate-900 dark:text-white text-sm">High Priority / Emergency</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-0.5">Will bypass normal queue order</p>
              </div>
            </label>
          </div>

          <button 
            type="submit" 
            disabled={availableFormDoctors.length === 0}
            className="w-full bg-blue-600 disabled:bg-slate-300 hover:bg-blue-700 text-white font-black py-4 rounded-xl mt-4 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25"
          >
            Create Token
          </button>
        </form>
      </div>
    </div>
  );
}