import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Clock,
  Menu,
  X,
  FileCheck2,
  FileText,
  Keyboard,
  Receipt,
  Heart,
  Globe,
  Code2,
} from 'lucide-react';

interface NavbarProps {
  currentLang: 'hi' | 'en';
  onToggleLang: () => void;
  onOpenDevSpecs: () => void;
  activeSection: string;
  onSelectNav: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onToggleLang,
  onOpenDevSpecs,
  activeSection,
  onSelectNav,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'services', labelEn: 'All Services', labelHi: 'सभी सेवाएं', icon: FileCheck2 },
    { id: 'sarkari-results', labelEn: 'Sarkari Results', labelHi: 'सरकारी रिजल्ट', icon: FileText },
    { id: 'typing-test', labelEn: 'Typing Test', labelHi: 'टाइपिंग टेस्ट', icon: Keyboard },
    { id: 'billing-tool', labelEn: 'Billing Software', labelHi: 'बिलिंग टूल', icon: Receipt },
    { id: 'community', labelEn: 'Spiritual / Seva', labelHi: 'भक्ति व सेवा', icon: Heart },
    { id: 'contact', labelEn: 'Contact Us', labelHi: 'संपर्क करें', icon: Phone },
  ];

  const handleNavClick = (id: string) => {
    onSelectNav(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-sm">
      {/* 1. TOP UTILITY HELPLINE STRIP */}
      <div className="bg-[#0f172a] text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          {/* Left info: Working hours & VLE ID */}
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'समय: 8:00 AM - 8:00 PM (सोमवार - शनिवार)' : 'Timing: 8:00 AM - 8:00 PM (Mon - Sat)'}</span>
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300">
              CSC ID: <strong className="text-white font-data">419208310023</strong>
            </span>
          </div>

          {/* Right info: Quick WhatsApp & Language Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919876543210?text=Hello%20Sat%20Kabir%20CSC%20Center%2C%20I%20need%20assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium text-[11px]"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp: 98765-43210</span>
            </a>

            <span className="text-slate-600">|</span>

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition-colors"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              <span>{currentLang === 'hi' ? 'English' : 'हिंदी'}</span>
            </button>

            {/* Dev Specs Trigger */}
            <button
              onClick={onOpenDevSpecs}
              title="View Next.js Code & Architecture"
              className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/80 hover:bg-blue-900 text-blue-300 text-[11px] font-semibold border border-blue-800"
            >
              <Code2 className="w-3 h-3" />
              <span>Developer Specs</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION BAR */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Tricolor CSC Emblem */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-blue-950/20 shrink-0 border border-blue-700">
              <span className="font-extrabold text-base tracking-tighter">SK</span>
              <span className="absolute -bottom-1 w-6 h-1 rounded-full bg-gradient-to-r from-orange-500 via-white to-green-600 shadow-sm" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-900 tracking-tight leading-none group-hover:text-blue-900 transition-colors">
                  Sat Kabir CSC Center
                </span>
                <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded border border-blue-200 uppercase">
                  Digital Seva
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5 font-hindi">
                {currentLang === 'hi'
                  ? 'सत कबीर डिजिटल सेवा केंद्र एवं सरकारी रिजल्ट'
                  : 'Common Service Centre & E-Governance Portal'}
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-slate-600">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap hover:text-blue-700 py-1 ${
                  activeSection === item.id ? 'text-blue-700 border-b-2 border-blue-700' : ''
                }`}
              >
                {currentLang === 'hi' ? item.labelHi : item.labelEn}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Action & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleNavClick('service-request')}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>{currentLang === 'hi' ? 'ऑनलाइन आवेदन करें' : 'Apply Online'}</span>
            </button>

            {/* Mobile Hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-left text-xs font-bold transition-all border ${
                    activeSection === item.id
                      ? 'bg-blue-50 border-blue-300 text-blue-800'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 text-blue-700 shrink-0" />
                  <span className="truncate">{currentLang === 'hi' ? item.labelHi : item.labelEn}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={onOpenDevSpecs}
              className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold text-center border border-slate-200"
            >
              Next.js Code &amp; Schema
            </button>
            <button
              onClick={() => handleNavClick('service-request')}
              className="flex-1 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold text-center shadow-md"
            >
              {currentLang === 'hi' ? 'आवेदन करें' : 'Apply Now'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
