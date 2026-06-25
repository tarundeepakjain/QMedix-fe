import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Stethoscope, RefreshCw, AlertTriangle, FileText, CheckCircle } from 'lucide-react';

export default function AIChatbotPanel({ currentPatient }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am your QMedix Clinical Copilot. How can I assist you with your consultations today? You can ask me about drug interactions, differential diagnosis, or to draft letters.",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef(null);

  const suggestionChips = [
    { label: "💊 Drug Interactions", prompt: "Check drug interactions for Aspirin and Warfarin" },
    { label: "🩺 Differential Diagnosis", prompt: "Differential diagnosis for acute chest pain" },
    { label: "📝 Draft Referral", prompt: `Draft a referral letter to cardiology` },
    { label: "📋 Patient Summary", prompt: "Show active patient summary" }
  ];

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const generateAIResponse = (userPrompt) => {
    const promptLower = userPrompt.toLowerCase();
    const patientName = currentPatient ? currentPatient.name : "[Patient Name]";
    const tokenNum = currentPatient ? currentPatient.token : "N/A";

    if (promptLower.includes('interaction') || promptLower.includes('aspirin')) {
      return `### ⚠️ Clinical Alert: High-Risk Interaction\n\n` +
             `**Substances:** Aspirin + Warfarin\n` +
             `**Severity:** Major / Contraindicated\n\n` +
             `* **Mechanism:** Synergistic antihemostatic effects. Aspirin inhibits platelet aggregation via COX-1 pathways, while Warfarin impedes vitamin K-dependent coagulation factors. Concomitant use significantly exacerbates bleeding risk.\n` +
             `* **Recommendation:** Avoid combination unless strictly indicated. Monitor INR closely, consider gastroprotection (e.g., PPI), and advise patient on signs of hemorrhage.`;
    }

    if (promptLower.includes('diagnosis') || promptLower.includes('chest pain')) {
      return `### 🩺 Differential Diagnosis: Chest Pain\n\n` +
             `Based on clinical guidelines, consider the following differentials:\n\n` +
             `1. **Cardiovascular (Life-threatening):**\n` +
             `   * Acute Coronary Syndrome (STEMI/NSTEMI)\n` +
             `   * Aortic Dissection (tearing pain, radiation to back)\n` +
             `   * Pericarditis (pleuritic, relieved by sitting forward)\n` +
             `2. **Pulmonary:**\n` +
             `   * Pulmonary Embolism (check Well's criteria, D-Dimer)\n` +
             `   * Pneumothorax (diminished breath sounds)\n` +
             `3. **Gastrointestinal:**\n` +
             `   * Gastroesophageal Reflux Disease (GERD) / Esophageal spasm\n` +
             `4. **Musculoskeletal:**\n` +
             `   * Costochondritis (localized tenderness)\n\n` +
             `*Recommended initial actions: Order urgent 12-lead ECG, high-sensitivity Troponin, and Chest X-ray.*`;
    }

    if (promptLower.includes('referral') || promptLower.includes('letter')) {
      return `### 📝 Clinical Referral Letter Draft\n\n` +
             `**Date:** ${new Date().toLocaleDateString()}\n` +
             `**From:** Dr. Test Doctor, QMedix Clinical Team\n` +
             `**To:** Specialist Consultant\n\n` +
             `**Subject:** Urgent referral for **${patientName}** (Token: ${tokenNum})\n\n` +
             `*Dear Colleague,*\n\n` +
             `*I am writing to refer this patient, ${patientName}, who presented today in our clinic. Based on my initial examination, they require specialist evaluation and diagnosis for further clinical management.*\n\n` +
             `*Please find the patient's active consultation history in QMedix. I would be grateful for your expert input and assessment of their case.*\n\n` +
             `*Warm regards,*\n` +
             `*Dr. Test Doctor*`;
    }

    if (promptLower.includes('summary') || promptLower.includes('patient') || promptLower.includes('current')) {
      if (!currentPatient) {
        return `### 📋 Active Patient Summary\n\n` +
               `*There is currently no active consultation in progress.* Please click "Call Next" to bring a patient in.`;
      }
      return `### 📋 Active Patient Summary\n\n` +
             `* **Name:** ${currentPatient.name}\n` +
             `* **Token:** ${currentPatient.token}\n` +
             `* **Gender/Age:** ${currentPatient.gender || '—'} / ${currentPatient.age || 'N/A'}\n` +
             `* **Phone:** ${currentPatient.phone || '—'}\n` +
             `* **Emergency Status:** ${currentPatient.isEmergency ? '🚨 Emergency Priority' : 'Normal waiting'}\n\n` +
             `**AI Copilot Tip:** Document their active complaints in the consultation remarks panel to the left.`;
    }

    return `### QMedix AI Copilot response\n\n` +
           `I detected your query: "${userPrompt}".\n\n` +
           `As a clinical assistant, I can help you search medical definitions, compile differential lists, or write letters. Try asking me:\n` +
           `* *"What is the treatment for hypertension?"*\n` +
           `* *"Draft referral for cardiology"*`;
  }

  const handleSend = (textToSend) => {
    const prompt = textToSend.trim();
    if (!prompt) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: prompt,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // Simulate AI thinking
    setIsThinking(true);
    setTimeout(() => {
      const responseText = generateAIResponse(prompt);
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend(inputValue);
    }
  };

  return (
    <div className="bg-white dark:bg-[#111827] rounded-[2.5rem] p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-full min-h-[500px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="bg-blue-50 dark:bg-blue-500/10 p-2 rounded-xl text-blue-600 dark:text-blue-400">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Clinical Copilot</h3>
            <span className="flex items-center text-[10px] font-bold text-slate-400 gap-1.5 uppercase mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
              AI Assistant Active
            </span>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{
            id: 1,
            sender: 'ai',
            text: "Chat history cleared. How else can I assist you, Doctor?",
            timestamp: new Date()
          }])}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 transition-colors p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-850"
          title="Clear Chat"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Suggestion Chips */}
      {messages.length === 1 && (
        <div className="mb-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Suggested Actions</p>
          <div className="flex flex-wrap gap-2">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(chip.prompt)}
                className="text-[11px] font-bold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-350 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-200 dark:hover:border-blue-800 transition-colors text-left"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-850 max-h-[300px] lg:max-h-[340px] mb-4">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] rounded-2xl p-4 text-xs ${
              msg.sender === 'user' 
                ? 'bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10' 
                : 'bg-slate-50 dark:bg-slate-850 text-slate-800 dark:text-slate-300 rounded-bl-none border border-slate-100 dark:border-slate-800'
            }`}>
              {msg.sender === 'ai' ? (
                <div className="space-y-2 markdown-content">
                  {msg.text.split('\n').map((line, lIdx) => {
                    if (line.startsWith('### ')) {
                      return <h4 key={lIdx} className="font-bold text-slate-900 dark:text-white mt-2 mb-1">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return <p key={lIdx} className="font-bold text-slate-900 dark:text-white">{line.replace(/\*\*/g, '')}</p>;
                    }
                    if (line.startsWith('* ')) {
                      return <li key={lIdx} className="ml-4 list-disc">{line.replace('* ', '')}</li>;
                    }
                    if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
                      return <div key={lIdx} className="ml-4 font-semibold text-slate-900 dark:text-white mt-1">{line}</div>;
                    }
                    if (line.startsWith('   * ')) {
                      return <li key={lIdx} className="ml-8 list-circle">{line.replace('   * ', '')}</li>;
                    }
                    return <p key={lIdx} className="leading-relaxed">{line}</p>;
                  })}
                </div>
              ) : (
                <p className="leading-relaxed">{msg.text}</p>
              )}
              <span className={`block text-[8px] mt-1.5 text-right font-medium ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex justify-start">
            <div className="bg-slate-50 dark:bg-slate-850 rounded-2xl rounded-bl-none p-4 text-xs text-slate-500 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="font-bold uppercase tracking-wider text-[9px] text-slate-400">Copilot is thinking...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="mt-auto flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-850">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask clinical copilot..."
          className="flex-1 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-350 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-slate-400"
        />
        <button
          onClick={() => handleSend(inputValue)}
          disabled={!inputValue.trim()}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition disabled:opacity-40 disabled:hover:bg-blue-600 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
