import React from 'react';

export default function StepDepartment({ departments, formData, setFormData, selectDepartment }) {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black mb-2 dark:text-white">Department</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">{formData.hospital_name}</p>
        </div>
        <label className="flex items-center cursor-pointer bg-red-50 dark:bg-red-900/10 px-4 py-2 rounded-xl border border-red-100 dark:border-red-900/30">
          <input type="checkbox" className="sr-only peer" checked={formData.isEmergency} onChange={(e) => setFormData({...formData, isEmergency: e.target.checked, bookingDate: '', timeSlot: ''})} />
          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-500 relative mr-3"></div>
          <span className="text-xs font-black text-red-600 uppercase tracking-widest">Emergency Visit</span>
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {departments.map(dept => (
          <button key={dept} onClick={() => selectDepartment(dept)} className="p-6 text-left border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all font-bold dark:text-slate-200">
            {dept}
          </button>
        ))}
      </div>
    </div>
  );
}