import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ReceptionDashboard from "./pages/reception/ReceptionDashboard";
import BookAppointment from "./pages/patient/BookAppointment";
import { AuthProvider } from './context/authContext';
import { supabase } from "./services/supabaseClient";
import { useAuth } from './context/authContext';
export default function App() {
  
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const {user}=useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.includes('/dashboard');

  const handleRegister = (newUser) => {
    setUsersDb([...usersDb, newUser]);
    alert("Registration successful! Please login with your new account.");
    navigate('/login');
  };

  const handleLogin = () => {
    

    if (user.role === 'hospital-staff') {
      navigate('/staff/dashboard');
    } else {
      navigate(`/patient/dashboard`);
    }
  };
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Starting with patients only for Google Auth
        setUser({ ...session.user, role: 'patient' });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser({ ...session.user, role: 'patient' });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen font-sans transition-colors duration-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar
        user={user}
        onLogout={() => {
          setUser(null);
          navigate('/login');
        }}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
<AuthProvider>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onRegister={handleRegister} />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/patient/dashboard"
          element={user ? <PatientDashboard user={user} isDark={darkMode} toggleTheme={() => setDarkMode(!darkMode)} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/doctor/dashboard"
          element={user ? <DoctorDashboard user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/hospital/dashboard"
          element={user ? <AdminDashboard user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/staff/dashboard"
          element={user ? <ReceptionDashboard user={user} /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/patient/book"
          element={user ? <BookAppointment user={user} /> : <Navigate to="/login" replace />}
        />
      </Routes>
      </AuthProvider>

      <footer className="mt-20 py-16 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
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
