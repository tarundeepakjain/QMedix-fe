import React, { useState,useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";
const faqs = {
  patient: [
    {
      q: "How do I book an appointment?",
      a: "You can book appointments digitally through QMedix. A smart token will be generated instantly."
    },
    {
      q: "Can I track my queue in real-time?",
      a: "Yes, you can track your live queue status and estimated waiting time from anywhere."
    },
    {
      q: "Do I need to be physically present?",
      a: "No, arrive only when your turn is near to avoid waiting."
    }
  ],

  doctor: [
    {
      q: "How do I start using QMedix?",
      a: "After signup, your account must be approved by your hospital admin before accessing features."
    },
    {
      q: "Why is my account not active?",
      a: "Doctors require hospital verification. Until approved, access will remain restricted."
    },
    {
      q: "What features do I get?",
      a: "You can manage queues, view patients, update availability, and track workflow."
    }
  ],

  staff: [
    {
      q: "What can staff members do?",
      a: "Staff can manage patient queues, update tokens, and assist in hospital operations."
    },
    {
      q: "Can staff assign tokens?",
      a: "Yes, staff can assign and manage tokens for patients."
    }
  ],

  admin: [
    {
      q: "What is the role of hospital admin?",
      a: "Admins manage doctors, approve registrations, and oversee hospital workflow."
    },
    {
      q: "How do I approve doctors?",
      a: "New doctors appear in pending list. You can approve or reject them."
    },
    {
      q: "Can I monitor system analytics?",
      a: "Yes, admins get insights like patient flow, wait times, and performance."
    }
  ]
};

const roles = ["patient", "doctor", "staff", "admin"];

const FAQ = () => {

  const location=useLocation();
  const [activeRole, setActiveRole] = useState(
  location.state?.role || "patient"
);

const [openIndex, setOpenIndex] = useState(null);
useEffect(() => {
  if (location.state?.openQuestion === "approval") {
    // find index of approval question
    const index = faqs["doctor"].findIndex(q =>
      q.q.toLowerCase().includes("approve") ||
      q.a.toLowerCase().includes("approved")
    );

    if (index !== -1) {
      setActiveRole("doctor");
      setOpenIndex(index);
    }
  }
}, [location.state]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] px-6 py-20">

      {/* HEADER */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Everything you need to know about QMedix
        </p>
      </div>

      {/* ROLE SELECTOR */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => {
              setActiveRole(role);
              setOpenIndex(null);
            }}
            className={`px-5 py-2 rounded-xl font-bold uppercase text-xs tracking-widest transition-all
              ${activeRole === role
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border"
              }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* FAQ LIST */}
      <div className="max-w-3xl mx-auto space-y-4">
        {faqs[activeRole].map((item, index) => (
          <div
            key={index}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl p-5 transition-all"
          >
            <button
              className="flex justify-between items-center w-full text-left"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-bold text-slate-900 dark:text-white">
                {item.q}
              </span>
              <ChevronDown
                className={`transition-transform ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {openIndex === index && (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                {item.a}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* DOCTOR SPECIAL NOTICE */}
      {activeRole === "doctor" && (
        <div className="max-w-3xl mx-auto mt-10 p-5 rounded-2xl bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/30">
          <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
            ⚠️ Note: After signup, doctors must be approved by their hospital admin before accessing features.
          </p>
        </div>
      )}
    </div>
  );
};

export default FAQ;