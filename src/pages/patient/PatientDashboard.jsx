import { Activity, Calendar, FileText, MapPin } from "lucide-react";

const buttonPrimary =
  "flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50";

export default function PatientDashboard({ user }) {
  // ✅ Fallback to localStorage if prop not passed
  const storedUser = localStorage.getItem("user");
  const currentUser = user || (storedUser ? JSON.parse(storedUser) : null);

  // ✅ Safe name handling (prevents crash)
  const firstName = currentUser?.name?.split(" ")[0] || "Patient";
  const address = currentUser?.address || "Medical District Center";

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

      {/* TOP HERO CARD */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-[2rem] p-8 text-white flex justify-between items-center overflow-hidden relative shadow-2xl">
        <div className="relative z-10">
          <p className="text-blue-400 font-black uppercase text-[10px] tracking-widest mb-2">
            Patient Profile
          </p>

          {/* ✅ SAFE NAME */}
          <h2 className="text-4xl font-black">Hello, {firstName}</h2>

          <div className="flex items-center text-slate-400 text-xs mt-4 font-bold uppercase tracking-widest">
            <MapPin size={14} className="mr-2 text-blue-500" />
            {address}
          </div>
        </div>

        <div className="hidden md:block relative z-10 text-right">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
            Insurance Active
          </p>
          <p className="text-emerald-400 font-black text-xl">Verified</p>
        </div>

        <Activity className="absolute right-[-5%] opacity-10 w-48 h-48" />
      </div>

      {/* ACTION CARDS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* BOOK APPOINTMENT */}
        <div
          className="p-8 rounded-3xl border shadow-sm transition-all
          bg-white dark:bg-slate-900
          border-slate-100 dark:border-slate-700
          hover:border-blue-200 dark:hover:border-blue-500"
        >
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-6">
            <Calendar />
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Book Appointment
          </h3>

          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-6">
            Skip the physical queue by scheduling a time slot with a specialist.
          </p>

          <button className={buttonPrimary + " w-full"}>Explore Doctors</button>
        </div>

        {/* HEALTH CARD */}
        <div
          className="p-8 rounded-3xl border shadow-sm transition-all
          bg-white dark:bg-slate-900
          border-slate-100 dark:border-slate-700
          hover:border-indigo-200 dark:hover:border-indigo-500"
        >
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-6">
            <FileText />
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Digital Health Card
          </h3>

          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-6">
            Your unique ID for quick check-ins and history retrieval.
          </p>

          <button className="w-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 py-3 rounded-xl font-bold">
            Show QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
