import { useState } from "react";
import { Mail, Eye, EyeOff, Loader2, KeyRound, Phone, User } from "lucide-react";
import SocialAuth from "../components/SocialAuth";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import api from "../services/apiWrapper";
const labelStyle =
  "block text-[10px] font-black text-blue-600/70 uppercase mb-2 tracking-widest ml-1";

const inputStyle =
  "w-full border rounded-xl py-3.5 px-4 outline-none transition-all text-sm " +
  "bg-blue-50/40 dark:bg-slate-800/60 " +
  "border-blue-100/60 dark:border-slate-700 " +
  "text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
  "focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500";

const buttonPrimary =
  "flex items-center justify-center bg-blue-600 text-white py-3 px-6 rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
const roles=[
 { id:"patient", name:"Patient"},
 {id:"hospital",name:"Hospital"} ,
 {id:"doctor",name:"Dcotor"} ,
  {id:"hospital-staff",name:"Staff"}
]
const [role,setRole]=useState("Select User role");
const handleLogin=async(email,password)=>{
if(!email ||!password ||!role){
alert("all fields are required");
}
try {
  const res=await api("post",`auth/login/${role}`,{
    email,
    password
  })
  if(res.status=200 || res.status==201){
  alert(`${role} Login done`);
  navigate("/");
  }
  else{
    alert("login failed");
  }

} catch (error) {
  console.log(`${role} Login Error:`,error);
}
setLoading(false);
}
  return (
    <div className="max-w-md mx-auto mt-16 p-10 rounded-[2.5rem] shadow-xl border transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-100 dark:border-slate-700">
      
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Welcome Back</h2>
        <p className="text-slate-400 dark:text-slate-400 font-medium mt-2">Access your medical dashboard</p>
      </div>

      {/* Social Login */}
      <div className="mb-8">
        <SocialAuth type="login" />
      </div>

      <div className="flex items-center my-8">
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>

        <span className="px-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">or continue with email</span>
        <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700"></div>
      </div>

      {/* Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          handleLogin(e.target.email.value,e.target.password.value);
        
        }}
        className="space-y-6"
      >
  
        <div>
          <label className={labelStyle}>Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              name="email"
              required
              type="email"
              placeholder="you@example.com"
              className={inputStyle + " pl-11"}
            />
          </div>
        </div>


        <div>
          <label className={labelStyle}>Password</label>
          <div className="relative">
            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              name="password"
              required
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className={inputStyle + " pl-11 pr-11"}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        

        
                            <div className="space-y-1">
                                <label className={labelStyle}>role</label>
                                <select required className={inputStyle}
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                >
                                    <option key="" value="">{role}</option>
                                    {roles.map(h => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                                </select>
                            </div>

        <button disabled={loading} className={buttonPrimary + " w-full mt-4"}>
          {loading ? <Loader2 className="animate-spin" /> : "Login to Dashboard"}
        </button>
      </form>
    </div>
  );
}
