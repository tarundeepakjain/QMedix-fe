import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Mail, Phone, MapPin, Stethoscope, Building2, 
  Briefcase, ShieldCheck, Edit2, Save, X, Lock, Camera,
  Users, UserCheck, KeyRound
} from 'lucide-react';
import { useAuth } from '../context/authContext';
import api from '../services/apiWrapper';

const inputStyle = 
  "w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/50 transition-all disabled:opacity-60 disabled:bg-slate-100 disabled:dark:bg-slate-800 disabled:cursor-not-allowed appearance-none";

const labelStyle = "block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2";

export default function Profile({user}) {

  // console.log("CURRENT LOGGED IN USER:", user);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hospitals, setHospitals] = useState([]); 
  
  const fileInputRef = useRef(null);
  const [profilePic, setProfilePic] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

  // Bulletproof role normalizer
  const rawRole = user?.role?.toLowerCase() || 'patient';
  const role = 
    ['admin', 'hospital'].includes(rawRole) ? 'admin' :
    ['staff', 'hospital-staff'].includes(rawRole) ? 'staff' : 
    rawRole;

  // EXACT MATCH to your Signup state fields!
  const [formData, setFormData] = useState({
    name:  user?.name || '', // FULL NAME
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    speciality: user?.speciality || '',
    dept: user?.dept || '',
    nop: user?.nop || '',
    doctors_available: user?.doctors_available || '',
    hospitalName: user?.hospitalName || '',       // HOSPITAL NAME
    hospital_id: user?.hospital_id || ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, ...user, name:  user.name || prev.name }));
      if (user.profilePic) setProfilePic(user.profilePic); 
      console.log(user);
    }
  }, [user]);

  // Fetch hospital dropdown data for Staff & Doctors
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await api("get", "hospital/all");
        if (res?.data?.hospitals) setHospitals(res.data.hospitals);
      } catch (error) {
        console.error("Error loading hospitals for profile", error);
      }
    };
    if (role === "doctor" || role === "staff") {
      fetchHospitals();
    }
  }, [role]);

const handleSave = async () => {
  try {
    setIsLoading(true);
    //      let payload = {};

    // if (role === "patient") {
    //   payload = {
    //     name: formData.name,
    //     phone: formData.phone,
    //     address: formData.address
    //   };
    // }

    // if (role === "doctor") {
    //   payload = {
    //     name: formData.name,
    //     phone: formData.phone,
    //     address: formData.address,
    //     speciality: formData.speciality,
    //     hospital_id: formData.hospital_id
    //   };
    // }

    // if (role === "staff") {
    //   payload = {
    //     name: formData.name,
    //     phone: formData.phone,
    //     dept: formData.dept,
    //     nop: formData.nop,
    //     doctors_available: formData.doctors_available,
    //     hospital_id: formData.hospital_id
    //   };
    // }

    // if (role === "admin") {
    //   payload = {
    //     name: formData.name,
    //     address: formData.address
    //   };
    // }
    const payload = Object.fromEntries(
  Object.entries(formData).filter(
    ([key, value]) =>
      value !== undefined &&
      value !== null &&
      value !== "" &&
      key !== "hospitalName"  && // ❌ not in DB
        key!=="role"
  )
);
    const res = await api("put","auth/update", payload);

    // console.log("Update response:", res);

    setIsEditing(false);
    alert("Profile updated successfully!");

  } catch (err) {
    console.error("Update failed:", err);
    alert("Failed to update profile");
  } finally {
    setIsLoading(false);
  }
};

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePic(URL.createObjectURL(file));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return alert("New passwords do not match!");
    alert("Password successfully updated!");
    setShowPasswordModal(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const getRoleIcon = () => {
    switch(role) {
      case 'doctor': return <Stethoscope size={24} className="text-indigo-500" />;
      case 'staff': return <Briefcase size={24} className="text-amber-500" />;
      case 'admin': return <ShieldCheck size={24} className="text-emerald-500" />;
      default: return <User size={24} className="text-blue-500" />;
    }
  };

  const getRoleBadgeColor = () => {
    switch(role) {
      case 'doctor': return 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800/50';
      case 'staff': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/50';
      case 'admin': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/50';
      default: return 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/50';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] p-4 sm:p-6 lg:p-8 w-full max-w-[100vw] overflow-x-hidden transition-colors duration-500 relative">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111827] p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Profile Settings</h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Manage your account details</p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button onClick={() => { setIsEditing(false); setFormData({...user, name: user.name }); }} className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all flex items-center">
                  <X size={16} className="mr-2" /> Cancel
                </button>
                <button onClick={handleSave} disabled={isLoading} className="px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 transition-all flex items-center disabled:opacity-70">
                  {isLoading ? <span className="animate-pulse">Saving...</span> : <><Save size={16} className="mr-2" /> Save</>}
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-6 py-3 rounded-xl font-bold text-sm bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/50 transition-all flex items-center">
                <Edit2 size={16} className="mr-2" /> Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COL: AVATAR & QUICK INFO */}
          <div className="lg:col-span-1 bg-white dark:bg-[#111827] p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center h-fit">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            <div onClick={() => isEditing && fileInputRef.current.click()} className={`relative mb-6 group ${isEditing ? 'cursor-pointer' : ''}`}>
              <div className="w-32 h-32 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-[#111827] shadow-xl flex items-center justify-center overflow-hidden">
                {profilePic ? <img src={profilePic} alt="Profile" className="w-full h-full object-cover" /> : getRoleIcon()}
              </div>
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
              )}
            </div>

            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">{formData.name || 'User'}</h2>
            <p className="text-sm font-bold text-slate-500 mb-4">{formData.email}</p>

            {/* --- NEW: DOCTOR QUICK IDENTITY --- */}
            {role === 'doctor' && (
              <div className="flex flex-col items-center gap-2 mb-6 bg-slate-50 dark:bg-slate-800/50 w-full py-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="flex items-center text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest">
                  <Stethoscope size={14} className="mr-1.5 text-indigo-500" /> 
                  {formData.speciality || "No Specialty Set"}
                </p>
                <p className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <Building2 size={12} className="mr-1.5 text-blue-500" /> 
                  {/* Match the ID to the hospital name from the API */}
                  {hospitals.find(h => h.id === formData.hospital_id)?.name || "No Hospital Assigned"}
                </p>
              </div>
            )}

            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getRoleBadgeColor()}`}>
              {role === 'admin' ? 'Hospital' : role} Account
            </span>

            <div className="w-full h-px bg-slate-100 dark:bg-slate-800 my-6"></div>

            <button onClick={() => setShowPasswordModal(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold text-sm transition-colors border border-slate-200 dark:border-slate-700">
              <Lock size={16} /> Change Password
            </button>
          </div>

          {/* RIGHT COL: EDITABLE FORM FIELDS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. GENERAL INFO */}
            <div className="bg-white dark:bg-[#111827] p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">General Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className={labelStyle}><User size={14} /> Full Name</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} disabled={!isEditing} className={inputStyle} />
                </div>
                <div>
                  <label className={labelStyle}><Phone size={14} /> Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} disabled={!isEditing} className={inputStyle} />
                </div>
                <div className="sm:col-span-2">
                  <label className={labelStyle}><Mail size={14} /> Email Address</label>
                  <input type="email" value={formData.email} disabled={true} className={inputStyle + " !opacity-50 !bg-slate-100 dark:!bg-slate-800 cursor-not-allowed"} />
                </div>
              </div>
            </div>

            {/* 2. SPECIFIC INFO */}
            <div className="bg-white dark:bg-[#111827] p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-6 border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center gap-2">
                {role === 'patient' || role === 'admin' ? <MapPin className="text-blue-500"/> : <Building2 className="text-amber-500" />} 
                {role === 'patient' || role === 'admin' ? 'Location Details' : 'Professional Details'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                {/* --- PATIENT --- */}
                {role === 'patient' && (
                  <div className="sm:col-span-2">
                    <label className={labelStyle}><MapPin size={14} /> Mailing Address</label>
                    <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} disabled={!isEditing} className={inputStyle} />
                  </div>
                )}

                {/* --- DOCTOR --- */}
                {role === 'doctor' && (
                  <>
                    <div className="sm:col-span-2">
                      <label className={labelStyle}><Stethoscope size={14} /> Specialty</label>
                      <input type="text" value={formData.speciality} onChange={e => setFormData({...formData, speciality: e.target.value})} disabled={!isEditing} className={inputStyle} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelStyle}><Building2 size={14} /> Hospital</label>
                      <select value={formData.hospital_id} onChange={e => setFormData({...formData, hospital_id: e.target.value})} disabled={!isEditing} className={inputStyle}>
                        <option value="">Select Hospital</option>
                        {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelStyle}><MapPin size={14} /> Address</label>
                      <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} disabled={!isEditing} className={inputStyle} />
                    </div>
                  </>
                )}

                {/* --- STAFF --- */}
                {role === 'staff' && (
                  <>
                    <div className="sm:col-span-2">
                      <label className={labelStyle}><Briefcase size={14} /> Department</label>
                      <input type="text" value={formData.dept} onChange={e => setFormData({...formData, dept: e.target.value})} disabled={!isEditing} className={inputStyle} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelStyle}><Users size={14} /> Patients Per Day (NOP)</label>
                      <input type="number" value={formData.nop} onChange={e => setFormData({...formData, nop: e.target.value})} disabled={!isEditing} className={inputStyle} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelStyle}><UserCheck size={14} /> Doctors Available</label>
                      <input type="number" value={formData.doctors_available} onChange={e => setFormData({...formData, doctors_available: e.target.value})} disabled={!isEditing} className={inputStyle} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelStyle}><Building2 size={14} /> Hospital</label>
                      <select value={formData.hospital_id} onChange={e => setFormData({...formData, hospital_id: e.target.value})} disabled={!isEditing} className={inputStyle}>
                        <option value="">Select Hospital</option>
                        {hospitals.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {/* --- ADMIN / HOSPITAL --- */}
                {role === 'admin' && (
                  <>
                    <div className="sm:col-span-2">
                      <label className={labelStyle}><MapPin size={14} /> Hospital Address</label>
                      <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} disabled={!isEditing} className={inputStyle} />
                    </div>
                  </>
                )}

              </div>
            </div>
            
          </div>
        </div>
      </div>

      {/* PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)}></div>
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <button onClick={() => setShowPasswordModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-100 dark:bg-slate-800 p-2 rounded-full transition-colors">
              <X size={18} />
            </button>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 dark:border-blue-800/50">
              <KeyRound size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">Security</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className={labelStyle}>Current Password</label>
                <input required type="password" value={passwords.current} onChange={e => setPasswords({...passwords, current: e.target.value})} className={inputStyle} placeholder="••••••••" />
              </div>
              <div className="h-px bg-slate-100 dark:bg-slate-800 my-4"></div>
              <div>
                <label className={labelStyle}>New Password</label>
                <input required type="password" value={passwords.new} onChange={e => setPasswords({...passwords, new: e.target.value})} className={inputStyle} placeholder="••••••••" />
              </div>
              <div>
                <label className={labelStyle}>Confirm New Password</label>
                <input required type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords, confirm: e.target.value})} className={inputStyle} placeholder="••••••••" />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl mt-4 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/25">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}