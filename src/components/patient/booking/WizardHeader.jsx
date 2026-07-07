import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WizardHeader({ step, setStep, isEmergency }) {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (step === 5 && isEmergency) {
      setStep(3);
    } else if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/patient/dashboard');
    }
  };
  
  return (
    <div className="flex items-center justify-between mb-10">
      <button 
        onClick={handleBack} 
        className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors dark:text-slate-400"
      >
        <ArrowLeft size={16} className="mr-2" /> {step > 1 ? 'Back' : 'Cancel'}
      </button>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={`h-2 rounded-full transition-all ${step >= i ? 'w-8 bg-blue-600' : 'w-4 bg-slate-200 dark:bg-slate-700'}`} />
        ))}
      </div>
    </div>
  );
}