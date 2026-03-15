import React from 'react';
import { Activity, Sun, Moon, Bell, UserCircle, User, Settings, LogOut } from 'lucide-react';

const PatientHeader = ({ user, activeCount, isDark, toggleTheme, onLogout }) => (
  <nav className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 sticky top-0 z-50 h-20 transition-colors">
    <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
      <div className="flex items-center space-x-12">
        {user && (
          <div className="hidden lg:flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full border border-blue-100 dark:border-slate-800">
             <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
               {activeCount} Active Appointments
             </span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-all">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button> */}

        {user ? (
          <div className="flex items-center space-x-4 border-l pl-4 border-slate-100 dark:border-slate-800 group relative">
            {/* Notifications Icon */}
            <div className="relative cursor-pointer p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all">
              <Bell size={20} className="text-slate-600 dark:text-slate-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </div>
            
            <div className="flex items-center space-x-4 cursor-pointer">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black dark:text-white leading-none">{user.name}</p>
                <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest mt-1">Patient Profile</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden">
                <UserCircle size={32} className="text-slate-400" />
              </div>
            </div>

            {/* Dropdown Logic */}
            <div className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-[1.5rem] shadow-2xl py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[100]">
              <div className="px-4 py-2 mb-2 border-b border-slate-50 dark:border-slate-700">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Signed in as</p>
                <p className="text-xs font-bold dark:text-white truncate">{user.email || 'patient@qmedix.com'}</p>
              </div>
              <button className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center transition-colors">
                <User size={14} className="mr-3 text-blue-600" /> Edit Profile
              </button>
              <button className="w-full text-left px-4 py-2.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center transition-colors">
                <Settings size={14} className="mr-3 text-blue-600" /> Settings
              </button>
              <div className="my-2 border-t border-slate-50 dark:border-slate-700" />
              <button onClick={onLogout} className="w-full text-left px-4 py-2.5 text-[11px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center transition-colors">
                <LogOut size={14} className="mr-3" /> Logout Account
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => window.location.hash = '#/login'} className="bg-blue-600 text-white px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Sign In</button>
        )}
      </div>
    </div>
  </nav>
);

export default PatientHeader;