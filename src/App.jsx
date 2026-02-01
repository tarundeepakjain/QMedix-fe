import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReceptionDashboard from "./pages/reception/ReceptionDashboard";

import { initialUsers } from "./services/supabaseClient";

export default function App() {
  const [view, setView] = useState('HOME');
  const [user, setUser] = useState(null);
  const [usersDb, setUsersDb] = useState(initialUsers);
  const [darkMode, setDarkMode] = useState(false);

  const handleRegister = (newUser) => {
    setUsersDb([...usersDb, newUser]);
    setView('LOGIN');
    alert("Registration successful! Please login with your new account.");
  };

  const handleLogin = (email, pass) => {
    const found = usersDb.find(u => u.email === email && u.password === pass);
    if (found) {
      setUser(found);
      setView('DASHBOARD');
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Navbar
        user={user}
        onNavigate={setView}
        onLogout={() => { setUser(null); setView('HOME'); }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main className="max-w-7xl mx-auto px-6 py-12">
        {view === 'HOME' && <Home onNavigate={setView} />}
        {view === 'LOGIN' && <Login onLogin={handleLogin} />}
        {view === 'SIGNUP' && <Signup onRegister={handleRegister} />}

        {view === 'DASHBOARD' && user && (
          <>
            {user.role === 'patient' && <PatientDashboard user={user} />}
            {user.role === 'doctor' && <DoctorDashboard user={user} />}
            {user.role === 'admin' && <AdminDashboard user={user} />}
            {user.role === 'reception' && <ReceptionDashboard user={user} />}
          </>
        )}
      </main>

      <footer className="mt-20 py-16 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="text-blue-600" />
              <span className="text-xl font-black tracking-tighter">QMedix</span>
            </div>
            <p className="text-slate-500 font-medium max-w-xs leading-relaxed">
              The global standard for medical queue management and patient information flow.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
