import { Activity, LogOut } from "lucide-react";

const toggleDarkMode = () => {
  document.documentElement.classList.toggle("dark");
};

const buttonPrimary =
    "flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50";

const Navbar = ({ user, onNavigate, onLogout, darkMode, setDarkMode }) => (
    <nav className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 h-20">
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
            <div className="flex items-center space-x-12">
                <div
                    className="flex items-center cursor-pointer group"
                    onClick={() => onNavigate("HOME")}
                >
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl transition-transform group-hover:rotate-6 shadow-lg shadow-blue-500/20">
                        <Activity className="h-5 w-5 text-white" />
                    </div>
                    <span className="ml-3 text-2xl font-black text-slate-900 tracking-tighter">
                        QMedix
                    </span>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                    <button
                        onClick={() => onNavigate("HOME")}
                        className="text-slate-900 font-black text-sm uppercase tracking-widest hover:text-blue-600 transition-colors"
                    >
                        Home
                    </button>
                    <button
                        onClick={() => onNavigate("HOME")}
                        className="text-slate-400 font-black text-sm uppercase tracking-widest hover:text-blue-600 transition-colors"
                    >
                        Services
                    </button>
                    <button
                        onClick={() => onNavigate("HOME")}
                        className="text-slate-400 font-black text-sm uppercase tracking-widest hover:text-blue-600 transition-colors"
                    >
                        Network
                    </button>
                </div>
            </div>

            <div className="flex items-center space-x-6">
                {!user ? (
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => onNavigate("LOGIN")}
                            className="text-slate-600 font-bold px-4 hover:text-blue-600"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => onNavigate("SIGNUP")}
                            className={buttonPrimary + " !py-2.5 !px-5"}
                        >
                            Sign Up
                        </button>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className="ml-4 px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition"
                        >
                            {darkMode ? "☀️ Light" : "🌙 Dark"}
                        </button>

                    </div>
                ) : (
                    <div className="flex items-center space-x-6 border-l pl-6 border-slate-100">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-900 leading-none">
                                {user.name}
                            </p>
                            <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest mt-1">
                                {user.role}
                            </p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="bg-slate-100 p-2 rounded-lg text-slate-500 hover:bg-red-500 hover:text-white transition-all"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    </nav>
);

export default Navbar;
