import React, { useState } from "react";
// Merged your imports with the Bell and UserRound icons!
import { Activity, LogOut, Menu, X, Bell, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/apiWrapper";

const buttonPrimary =
  "flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50";

const Navbar = ({ user, onLogout, darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  // Your custom logout logic!
  const handleLogout = async () => {
    try {
      const res = await api("post", "auth/logout");

      if (res.status === 200) {
        alert("Logged out! Kindly login again to continue");
        navigate("/");
        if (onLogout) onLogout(); // Just in case you still need to clear React state
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <nav
        className="sticky top-0 z-50 h-20 backdrop-blur-md border-b transition-colors
        bg-white/90 dark:bg-slate-900/80
        border-slate-100 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
          
          {/* LEFT SIDE */}
          <div className="flex items-center space-x-12">
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => handleNav("/")}
            >
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl transition-transform group-hover:rotate-6 shadow-lg shadow-blue-500/20">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                QMedix
              </span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => handleNav(user ? "/" : "/")} className="font-black text-sm uppercase tracking-widest transition-colors text-slate-900 dark:text-slate-100 hover:text-blue-600">Home</button>
              <button onClick={() => handleNav(user ? `/${user?.role}/dashboard` : "/")} className="font-black text-sm uppercase tracking-widest transition-colors text-slate-400 dark:text-slate-500 hover:text-blue-600">DASHBOARD</button>
              <button onClick={() => handleNav("/FAQ")} className="font-black text-sm uppercase tracking-widest transition-colors text-slate-400 dark:text-slate-500 hover:text-blue-600">FAQ</button>
            </div>
          </div>
           {user?.role === "doctor" && user?.status==="PENDING" && (
            <>
  <p onClick={()=>{
     navigate("/FAQ", {
      state: {
        role: "doctor",
        openQuestion: "approval"
      }
    });
  }} className="text-[12px] text-amber-500 font-black uppercase tracking-widest mt-1 cursor-pointer hover:underline">
    Approval from hospital is pending!! <br></br>
    Click here to know more
  </p>
  </>

)}

          {/* RIGHT SIDE (Desktop Only) */}
          <div className="hidden md:flex items-center space-x-6">
            {!user ? (
              <div className="flex items-center space-x-3">
                <button onClick={() => handleNav("/login")} className="font-bold px-4 transition-colors text-slate-600 dark:text-slate-300 hover:text-blue-600">Login</button>
                <button onClick={() => handleNav("/signup")} className={buttonPrimary + " !py-2.5 !px-5"}>Sign Up</button>
                <button onClick={() => setDarkMode(!darkMode)} className="ml-4 px-3 py-2 rounded-lg transition-colors bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {darkMode ? "☀️ Light" : "🌙 Dark"}
                </button>           
              </div>
            ) : (
              <div className="flex items-center space-x-5 border-l pl-6 border-slate-100 dark:border-slate-800">
                
                {/* THE BELL ICON */}
                <button className="relative p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Bell size={22} />
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                </button>

                {/* THE USER PROFILE & FACE ICON */}
                <div className="flex items-center gap-3 border border-slate-100 dark:border-slate-800/50 p-1.5 rounded-full bg-slate-50/50 dark:bg-slate-800/30">
                  <div className="bg-slate-200 dark:bg-slate-800 p-2.5 rounded-full text-slate-500 dark:text-slate-400 border border-white dark:border-slate-700 shadow-inner">
                    <UserRound size={18} />
                  </div>
                  <div className="text-right pr-2">
                    <p className="text-sm font-black leading-none text-slate-900 dark:text-white">
                      {user.name || "User"}
                    </p>
                    <p className="text-[9px] text-blue-500 dark:text-blue-400 font-black uppercase tracking-widest mt-1">
                      {user.role}
                    </p>
                   
                  </div>
                </div>

                <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-2 rounded-lg transition-colors bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                  {darkMode ? "☀️" : "🌙"}
                </button>

                {/* YOUR NEW LOGOUT FUNCTION WIRED UP */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg transition-all bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-500 hover:text-white"
                >
                  <LogOut size={18} />
                </button>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE BUTTONS */}
          <div className="md:hidden flex items-center space-x-3">
            {/* MOBILE BELL ICON */}
            {user && (
              <button className="relative p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Bell size={22} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
            )}
            
            <button onClick={() => setDarkMode(!darkMode)} className="px-3 py-2 rounded-lg transition-colors bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-900 dark:text-white">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU DROPDOWN */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xl px-6 py-8 flex flex-col space-y-6">
            <div className="flex flex-col space-y-4 border-b border-slate-100 dark:border-slate-800 pb-6">
              <button onClick={() => handleNav(user ? "/dashboard" : "/")} className="text-left font-black text-sm uppercase tracking-widest text-slate-900 dark:text-slate-100">Home</button>
              <button onClick={() => handleNav(user ? "/dashboard" : "/")} className="text-left font-black text-sm uppercase tracking-widest text-slate-400 dark:text-slate-500">Services</button>
              <button onClick={() => handleNav(user ? "/dashboard" : "/")} className="text-left font-black text-sm uppercase tracking-widest text-slate-400 dark:text-slate-500">Network</button>
            </div>

            {!user ? (
              <div className="flex flex-col space-y-4">
                <button onClick={() => handleNav("/login")} className="font-bold text-center py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">Login</button>
                <button onClick={() => handleNav("/signup")} className={buttonPrimary + " w-full"}>Sign Up</button>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {/* MOBILE USER FACE ICON */}
                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="bg-slate-200 dark:bg-slate-800 p-2.5 rounded-full text-slate-500 dark:text-slate-400 border border-white dark:border-slate-700 shadow-inner">
                    <UserRound size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-black leading-none text-slate-900 dark:text-white">{user.name || "User"}</p>
                    <p className="text-[9px] text-blue-500 dark:text-blue-400 font-black uppercase tracking-widest mt-1">{user.role}</p>
                  </div>
                </div>
                {/* MOBILE LOGOUT WIRED UP */}
                <button onClick={handleLogout} className="font-bold text-center py-3 bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 rounded-xl flex items-center justify-center">
                  <LogOut size={18} className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;