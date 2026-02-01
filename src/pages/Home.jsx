import { ArrowRight, Clock, ShieldCheck, Globe, Activity, Zap } from "lucide-react";

const buttonPrimary =
  "flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50";

const Home = ({ onNavigate }) => (
  <div className="animate-in fade-in duration-700">
    
    <section className="relative pt-24 pb-24 text-center px-4 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100">

      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-blue-200/40 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] bg-indigo-300/40 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto bg-white/50 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2.5rem] p-10">

        <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full mb-8 uppercase tracking-widest border border-blue-100">
          <Zap size={14} className="mr-2 fill-current" /> Next-Gen Healthcare Flow
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
          Care without <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600">
            the wait.
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Standardizing clinical logistics with smart queue management and automated patient intake.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate("SIGNUP")}
            className={buttonPrimary + " !px-10 !py-5 text-lg shadow-2xl"}
          >
            Get Started Now <ArrowRight className="ml-3" />
          </button>

          <button className="px-10 py-5 text-slate-600 font-bold hover:bg-white/60 rounded-xl transition-all">
            Watch Demo
          </button>
        </div>
      </div>
    </section>

    {/* FEATURES */}
    <section className="grid md:grid-cols-3 gap-8 py-20 border-t border-slate-50">
      <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
          <Clock size={28} />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-3">Real-time Queue</h3>
        <p className="text-slate-500 leading-relaxed">
          Virtual waiting rooms that let patients track their status from anywhere, reducing lobby congestion.
        </p>
      </div>

      <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <ShieldCheck size={28} />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-3">Secure Records</h3>
        <p className="text-slate-500 leading-relaxed">
          HIPAA-compliant data encryption ensures patient medical history and prescriptions stay private.
        </p>
      </div>

      <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
          <Globe size={28} />
        </div>
        <h3 className="text-xl font-black text-slate-900 mb-3">Universal Access</h3>
        <p className="text-slate-500 leading-relaxed">
          Available for clinics, hospitals, and pharmacies across the globe with multi-role support.
        </p>
      </div>
    </section>

    {/* STATS */}
    <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
      <div className="relative z-10 grid md:grid-cols-3 gap-12 text-center">
        <div>
          <p className="text-5xl font-black mb-2">98%</p>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Patient Satisfaction</p>
        </div>
        <div>
          <p className="text-5xl font-black mb-2">12min</p>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Avg Wait Reduction</p>
        </div>
        <div>
          <p className="text-5xl font-black mb-2">50k+</p>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Active Sessions</p>
        </div>
      </div>
      <Activity className="absolute bottom-[-20%] right-[-10%] w-64 h-64 opacity-5" />
    </section>
  </div>
);

export default Home;
