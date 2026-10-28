import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';

interface FloatingWhatsAppProps {
  currentLang: 'hi' | 'en';
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ currentLang }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      'नमस्ते सत कबीर सीएससी सेंटर! मुझे ऑनलाइन सेवा / सरकारी नौकरी फॉर्म हेतु जानकारी चाहिए।'
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
      {/* Popover Bubble */}
      {isOpen && (
        <div className="bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 text-slate-800 text-xs w-64 animate-in slide-in-from-bottom-3 font-hindi">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Sat Kabir CSC Helpdesk</span>
            </span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="py-2 text-slate-600 text-[11px] leading-relaxed">
            {currentLang === 'hi'
              ? 'नमस्ते! किसी भी फॉर्म, रिजल्ट या सीएससी सेवा की तुरंत जानकारी के लिए हमें WhatsApp करें।'
              : 'Hello! Need assistance with any form or service? Chat directly on WhatsApp.'}
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleOpenWhatsApp}
              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-1 shadow-sm"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </button>
            <a
              href="tel:+919876543210"
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center"
            >
              <Phone className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => {
          if (!isOpen) {
            handleOpenWhatsApp();
          } else {
            setIsOpen(!isOpen);
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
        aria-label="Chat on WhatsApp"
        className="relative group p-3.5 sm:px-4 sm:py-3.5 rounded-full sm:rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-700/30 flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
      >
        <MessageCircle className="w-6 h-6 sm:w-5 sm:h-5 fill-current" />
        <span className="hidden sm:inline text-xs font-black tracking-wide">
          {currentLang === 'hi' ? 'सीएससी सहायता' : 'WhatsApp Help'}
        </span>
      </button>
    </div>
  );
};
