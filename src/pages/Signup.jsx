import { useState } from "react";
import {
    User,
    Stethoscope,
    ClipboardList,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Mail,
    KeyRound,
    Loader2
} from "lucide-react";
import SocialAuth from "../components/SocialAuth";

const labelStyle =
    "block text-[10px] font-black text-blue-600/70 dark:text-blue-400/70 uppercase mb-2 tracking-widest ml-1";

const inputStyle =
    "w-full border rounded-xl py-3.5 px-4 outline-none transition-all text-sm " +
    "bg-blue-50/40 dark:bg-slate-800/60 " +
    "border-blue-100/60 dark:border-slate-700 " +
    "text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
    "focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500";

const buttonPrimary =
    "flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed";

const Signup = ({ onRegister }) => {
    const [step, setStep] = useState(1); // 1: Role, 2: Form, 3: Email Verification
    const [role, setRole] = useState('patient');
    const [data, setData] = useState({
        fullName: '',
        hospitalName: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        speciality: '',
        dept: '',
        nop: '',
        doctors_available: '',
        hospital_id: ''
    });
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Email Regex Validation
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const validatePassword = (pass) => {
        return {
            length: pass.length >= 6,
            number: /[0-9]/.test(pass),
            symbol: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
            letter: /[a-z]/.test(pass)
        };
    };

    const passwordChecks = validatePassword(data.password);
    const isPasswordValid = Object.values(passwordChecks).every(Boolean);
    const isEmailValid = validateEmail(data.email);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!isEmailValid) return alert("Please enter a valid email address.");
        if (!isPasswordValid) return;

        // Simulate sending an email verification code
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep(3);
        }, 1500);
    };

    const verifyOtpAndRegister = (e) => {
        e.preventDefault();
        if (otp === '123456') { // Mock verification code
            onRegister({ ...data, role });
        } else {
            alert("Invalid verification code. Please check your email and enter '123456' for this demo.");
        }
    };

    const hospitals = [
        { id: "h1", name: "City Hospital" },
        { id: "h2", name: "Green Valley Clinic" },
        { id: "h3", name: "Sunrise Medical Center" }
    ];

    return (
        <div className="max-w-xl mx-auto mt-12 p-10 rounded-[2.5rem] shadow-2xl transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
    border border-slate-100 dark:border-slate-700
    animate-in slide-in-from-bottom-4 duration-500">

            {step === 1 && (
                <>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-8">Choose your profile</h2>
                    <div className="space-y-8">
                        <SocialAuth type="role selection" />
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { id: 'patient', l: 'Patient', i: <User />, c: 'text-blue-600 bg-blue-50' },
                                { id: 'doctor', l: 'Doctor', i: <Stethoscope />, c: 'text-indigo-600 bg-indigo-50' },
                                { id: 'staff', l: 'Staff', i: <ClipboardList />, c: 'text-amber-600 bg-amber-50' },
                                { id: 'admin', l: 'Admin', i: <ShieldCheck />, c: 'text-emerald-600 bg-emerald-50' }
                            ].map(r => (
                                <button key={r.id} onClick={() => { setRole(r.id); setStep(2); }} className="p-6 border rounded-2xl text-center transition-all group
    border-slate-100 dark:border-slate-700
    bg-white dark:bg-slate-800/60
    hover:border-blue-600 hover:shadow-lg">
                                    <div className={`w-12 h-12 ${r.c} rounded-xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform`}>{r.i}</div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">{r.l}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {step === 2 && (
                <form className="space-y-4" onSubmit={handleFormSubmit}>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white text-center mb-4">Account Details</h2>
                    <p className="text-slate-400 dark:text-slate-500 text-center text-xs font-bold uppercase tracking-widest mb-8">Role: {role}</p>

                    <div className="space-y-1">
                        <label className={labelStyle}>Full Name</label>
                        <input required className={inputStyle} placeholder="John Doe" value={data.fullName} onChange={e => setData({ ...data, fullName: e.target.value })} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className={labelStyle}>Phone Number</label>
                            <input required className={inputStyle} placeholder="9876543210"
                                value={data.phone}
                                onChange={e => setData({ ...data, phone: e.target.value })}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className={labelStyle}>Email Address</label>
                            <input required type="email" className={`${inputStyle} ${data.email && !isEmailValid ? 'border-red-300 bg-red-50' : ''}`} value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
                            {data.email && !isEmailValid && <p className="text-[10px] text-red-500 font-bold ml-1">Invalid email format</p>}
                        </div>
                        <div className="space-y-1">
                            <label className={labelStyle}>Password</label>
                            <input required type="password" className={inputStyle} placeholder="••••••••" value={data.password} onChange={e => setData({ ...data, password: e.target.value })} />
                        </div>
                    </div>

                    {/* Password Validation Feedback */}
                    <div className="p-4 rounded-2xl grid grid-cols-2 gap-y-2 gap-x-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">

                        <div className={`flex items-center text-[10px] font-bold uppercase tracking-wider ${passwordChecks.length ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {passwordChecks.length ? <CheckCircle2 size={12} className="mr-2" /> : <AlertCircle size={12} className="mr-2" />} Min 6 Characters
                        </div>
                        <div className={`flex items-center text-[10px] font-bold uppercase tracking-wider ${passwordChecks.letter ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {passwordChecks.letter ? <CheckCircle2 size={12} className="mr-2" /> : <AlertCircle size={12} className="mr-2" />} Lowercase (a-z)
                        </div>
                        <div className={`flex items-center text-[10px] font-bold uppercase tracking-wider ${passwordChecks.number ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {passwordChecks.number ? <CheckCircle2 size={12} className="mr-2" /> : <AlertCircle size={12} className="mr-2" />} Use Numbers
                        </div>
                        <div className={`flex items-center text-[10px] font-bold uppercase tracking-wider ${passwordChecks.symbol ? 'text-emerald-600' : 'text-slate-400'}`}>
                            {passwordChecks.symbol ? <CheckCircle2 size={12} className="mr-2" /> : <AlertCircle size={12} className="mr-2" />} Special Symbols
                        </div>
                    </div>

                    {role === 'patient' && (
                        <div className="space-y-1">
                            <label className={labelStyle}>Mailing Address</label>
                            <input required className={inputStyle} placeholder="123 Care Street" value={data.address} onChange={e => setData({ ...data, address: e.target.value })} />
                        </div>
                    )}

                    {role === 'doctor' && (
                        <>
                            <div className="space-y-1">
                                <label className={labelStyle}>Specialty</label>
                                <input required className={inputStyle} placeholder="Cardiologist"
                                    value={data.speciality}
                                    onChange={e => setData({ ...data, speciality: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className={labelStyle}>Hospital</label>
                                <select required className={inputStyle}
                                    value={data.hospital_id}
                                    onChange={e => setData({ ...data, hospital_id: e.target.value })}
                                >
                                    <option value="">Select Hospital</option>
                                    {hospitals.map(h => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className={labelStyle}>Address</label>
                                <input required className={inputStyle} placeholder="Clinic Address"
                                    value={data.address}
                                    onChange={e => setData({ ...data, address: e.target.value })}
                                />
                            </div>
                        </>
                    )}

                    {role === 'staff' && (
                        <>
                            <div className="space-y-1">
                                <label className={labelStyle}>Department</label>
                                <input required className={inputStyle} placeholder="Reception / Billing"
                                    value={data.dept}
                                    onChange={e => setData({ ...data, dept: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className={labelStyle}>Patients Per Day (NOP)</label>
                                <input type="number" required className={inputStyle}
                                    value={data.nop}
                                    onChange={e => setData({ ...data, nop: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className={labelStyle}>Doctors Available</label>
                                <input type="number" required className={inputStyle}
                                    value={data.doctors_available}
                                    onChange={e => setData({ ...data, doctors_available: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className={labelStyle}>Hospital</label>
                                <select required className={inputStyle}
                                    value={data.hospital_id}
                                    onChange={e => setData({ ...data, hospital_id: e.target.value })}
                                >
                                    <option value="">Select Hospital</option>
                                    {hospitals.map(h => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {role === 'admin' && (
                        <>
                            <div className="space-y-1">
                                <label className={labelStyle}>Hospital Name</label>
                                <input required className={inputStyle} placeholder="Apollo Hospital"
                                    value={data.hospitalName}
                                    onChange={e => setData({ ...data, hospitalName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className={labelStyle}>Hospital Address</label>
                                <input required className={inputStyle} placeholder="Main Road, City"
                                    value={data.address}
                                    onChange={e => setData({ ...data, address: e.target.value })}
                                />
                            </div>
                        </>
                    )}


                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setStep(1)} className="flex-1 font-bold py-4 rounded-xl transition-all
    bg-slate-100 dark:bg-slate-800
    text-slate-600 dark:text-slate-300
    hover:bg-slate-200 dark:hover:bg-slate-700"
                        >Back</button>
                        <button disabled={!isPasswordValid || !isEmailValid || isLoading} className={buttonPrimary + " flex-[2]"}>
                            {isLoading ? <Loader2 className="animate-spin" /> : "Verify Email"}
                        </button>
                    </div>
                </form>
            )}

            {step === 3 && (
                <form className="space-y-6 text-center animate-in zoom-in-95 duration-300" onSubmit={verifyOtpAndRegister}>
                    <div className="w-16 h-16 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white">Check your inbox</h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">We sent a code to <span className="text-slate-900 dark:text-white font-bold">{data.email}</span></p>

                    <div className="relative max-w-[240px] mx-auto">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600" size={20} />
                        <input
                            autoFocus
                            required
                            maxLength={6}
                            placeholder="123456"
                            className={inputStyle + " pl-12 text-center text-2xl tracking-[0.5em] font-black"}
                            value={otp}
                            onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                        />
                    </div>

                    <div className="space-y-4">
                        <button className={buttonPrimary + " w-full py-4 text-lg"}>Verify & Create Account</button>
                        <button type="button" onClick={() => setStep(2)} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Entered wrong email?</button>
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-8">Note: Use code '123456' for this demo</p>
                </form>
            )}
        </div>
    );
};
export default Signup;