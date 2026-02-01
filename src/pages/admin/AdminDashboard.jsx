import { ShieldCheck, Users, Hospital, Activity } from "lucide-react";

const cardStyle =
  "p-8 rounded-3xl border shadow-sm transition-all bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-500";

const AdminDashboard = () => {
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

      {/* HERO */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-[2rem] p-8 text-white flex justify-between items-center overflow-hidden relative shadow-2xl">
        <div className="relative z-10">
          <p className="text-indigo-300 font-black uppercase text-[10px] tracking-widest mb-2">
            Admin Control Panel
          </p>
          <h2 className="text-4xl font-black">Hospital Administration</h2>
          <p className="text-slate-400 text-sm mt-3 max-w-md">
            Monitor system activity, manage staff, and oversee hospital operations from one place.
          </p>
        </div>
        <ShieldCheck className="absolute right-[-5%] opacity-10 w-48 h-48" />
      </div>

      {/* ACTION CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className={cardStyle}>
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
            <Users />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Manage Staff
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Add, remove, or update doctors, receptionists, and support staff.
          </p>
        </div>

        <div className={cardStyle}>
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-6">
            <Hospital />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Hospital Settings
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Configure departments, service timings, and facility information.
          </p>
        </div>

        <div className={cardStyle}>
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6">
            <Activity />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            System Activity
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Track patient flow, queue load, and real-time hospital performance.
          </p>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
