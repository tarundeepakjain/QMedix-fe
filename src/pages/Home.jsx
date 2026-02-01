import { ArrowRight, Clock, ShieldCheck, Globe, Activity, Zap } from "lucide-react";

const buttonPrimary =
  "flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50";

const Home = ({ onNavigate }) => (
  <div className="min-h-screen transition-colors duration-500
      bg-gradient-to-br from-blue-50 via-white to-indigo-50
      dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">

    {/* HERO */}
    <section className="relative pt-24 pb-24 text-center px-4 overflow-hidden">

      {/* Ambient blobs */}
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] bg-blue-200/40 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] bg-indigo-300/40 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>

      {/* Glass Panel */}
      <div className="relative z-10 max-w-4xl mx-auto
          bg-white/60 dark:bg-slate-800/60
          backdrop-blur-xl border border-white/40 dark:border-slate-700
          shadow-2xl rounded-[2.5rem] p-10 transition-colors">

        <div className="inline-flex items-center px-4 py-2
            bg-blue-50 dark:bg-blue-500/10
            text-blue-600 dark:text-blue-400
            text-[10px] font-black rounded-full mb-8 uppercase tracking-widest
            border border-blue-100 dark:border-blue-500/20">
          <Zap size={14} className="mr-2 fill-current" /> Next-Gen Healthcare Flow
        </div>

        <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.9]">
          Care without <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600">
            the wait.
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-300 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Standardizing clinical logistics with smart queue management and automated patient intake.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate("SIGNUP")}
            className={buttonPrimary + " !px-10 !py-5 text-lg shadow-2xl"}
          >
            Get Started Now <ArrowRight className="ml-3" />
          </button>

          <button className="px-10 py-5 text-slate-600 dark:text-slate-300 font-bold hover:bg-white/60 dark:hover:bg-slate-700/60 rounded-xl transition-all">
            Watch Demo
          </button>
        </div>
      </div>
    </section>

    {/* FEATURES */}
    <section className="py-20 border-t border-slate-200 dark:border-slate-800
        bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm transition-colors">

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">

        {[{
          icon: <Clock size={28} />,
          title: "Real-time Queue",
          text: "Virtual waiting rooms that let patients track their status from anywhere, reducing lobby congestion.",
          color: "blue"
        },{
          icon: <ShieldCheck size={28} />,
          title: "Secure Records",
          text: "HIPAA-compliant data encryption ensures patient medical history and prescriptions stay private.",
          color: "indigo"
        },{
          icon: <Globe size={28} />,
          title: "Universal Access",
          text: "Available for clinics, hospitals, and pharmacies across the globe with multi-role support.",
          color: "emerald"
        }].map((f, i) => (
          <div key={i} className="p-8 rounded-3xl
              bg-white/70 dark:bg-slate-800/70
              border border-slate-100 dark:border-slate-700
              shadow-sm hover:shadow-xl transition-all">

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6
                bg-${f.color}-50 dark:bg-${f.color}-500/10
                text-${f.color}-600 dark:text-${f.color}-400`}>
              {f.icon}
            </div>

            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3">{f.title}</h3>
            <p className="text-slate-500 dark:text-slate-300 leading-relaxed">{f.text}</p>
          </div>
        ))}

      </div>
    </section>

    {/* STATS */}
    <section className="bg-slate-900 text-white rounded-[3rem] p-12 relative overflow-hidden m-6">
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
