import React, { useState } from 'react';
import { triggerKeyEvent } from '../services/notificationService';

interface AdvisorChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'advisor' | 'user';
  text: string;
  timestamp: string;
}

export const AdvisorChatModal: React.FC<AdvisorChatModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'advisor',
      text: 'Hello Niharika! I am Dr. Marcus Vance, your academic advisor. How can I help you with your degree audit, course registration, or study schedule today?',
      timestamp: '10:00 AM',
    },
  ]);
  const [input, setInput] = useState('');

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Responsive advisor answer
    setTimeout(() => {
      let reply = "I've reviewed your academic degree trajectory. Your 3.84 GPA places you well ahead of Dean's List requirements. Let me know if you need prerequisite clearances!";
      if (userText.toLowerCase().includes('spring') || userText.toLowerCase().includes('register')) {
        reply = 'Your priority registration window for Spring 2025 opens this Monday at 8:00 AM. Be sure to clear your CS 301 prerequisites before enrolling in Advanced Operating Systems!';
      } else if (userText.toLowerCase().includes('exam') || userText.toLowerCase().includes('midterm')) {
        reply = 'Prof. Chen is holding drop-in midterm review hours today in Room 304 from 4:00 PM to 5:00 PM. Highly recommended for the CS101 quiz prep!';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `adv-${Date.now()}`,
          sender: 'advisor',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);

      // Fire backend push notification for advisor message
      triggerKeyEvent('advisor_reply');
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] h-[85vh] sm:h-[650px] bg-white dark:bg-[#131B2E] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                MV
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#131B2E]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Academic Advisory 24/7</h3>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Dr. Vance • Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#10B981] text-white rounded-br-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about courses, degree audit, or GPA..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 h-10 px-3.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-[#10B981]/30"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-[#10B981] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#059669] transition-all shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
