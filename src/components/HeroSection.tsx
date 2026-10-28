import React from 'react';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  Zap,
  FileText,
  CreditCard,
  Landmark,
  Download,
} from 'lucide-react';

interface HeroSectionProps {
  currentLang: 'hi' | 'en';
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onNavigateSection: (sectionId: string) => void;
  onSelectCategory: (cat: string) => void;
  onOpenDownloadModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  searchQuery,
  onSearchChange,
  onNavigateSection,
  onSelectCategory,
  onOpenDownloadModal,
}) => {
  const quickTags = [
    { label: 'PAN Card', cat: 'csc' },
    { label: 'SBI Clerk 2026', cat: 'jobs' },
    { label: 'DigiPay AePS', cat: 'banking' },
    { label: 'Caste Certificate', cat: 'certificates' },
    { label: 'India Post GDS', cat: 'jobs' },
    { label: 'Typing Test Tool', cat: 'typing' },
  ];

  return (
    <section id="hero" className="relative bg-gradient-to-b from-blue-950 via-slate-900 to-[#0c1424] text-white pt-10 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center">
        {/* Verification badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/60 border border-blue-500/30 text-xs font-semibold text-blue-200 mb-5 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            {currentLang === 'hi'
              ? 'अधिकृत सीएससी केंद्र (CSC e-Governance Services India Ltd.)'
              : 'Authorized CSC Center (CSC e-Governance India Ltd.)'}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-hindi">
          {currentLang === 'hi' ? (
            <>
              एक ही छत के नीचे{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
                डिजिटल इंडिया
              </span>{' '}
              की सभी सेवाएं
            </>
          ) : (
            <>
              All{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-emerald-400">
                Digital India Services
              </span>{' '}
              Under One Roof
            </>
          )}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-hindi font-medium">
          {currentLang === 'hi'
            ? 'सत कबीर सीएससी सेंटर: पैन कार्ड, आधार बैंकिंग, ई-डिस्ट्रिक्ट प्रमाण पत्र, सरकारी नौकरी (Sarkari Result) फॉर्म एवं ऑनलाइन सेवाएं विश्वास के साथ।'
            : 'Sat Kabir CSC Center: PAN Card, Aadhaar Banking (AePS), State e-District certificates, Sarkari Result forms, and digital citizen services with 100% trust.'}
        </p>

        {/* Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto relative">
          <div className="relative flex items-center bg-white rounded-2xl shadow-2xl p-1.5 border-2 border-slate-200 focus-within:border-orange-500 transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={
                currentLang === 'hi'
                  ? 'सेवा या सरकारी नौकरी खोजें (जैसे: PAN, GDS, जाति प्रमाण पत्र, SBI)...'
                  : 'Search any service or job (e.g. PAN card, GDS, DigiPay, SBI Clerk)...'
              }
              className="w-full py-2.5 px-3 text-slate-900 text-sm font-semibold placeholder:text-slate-400 focus:outline-none rounded-xl"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 font-bold"
              >
                Clear
              </button>
            )}
            <button
              onClick={() => onNavigateSection('services')}
              className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all shrink-0 cursor-pointer"
            >
              {currentLang === 'hi' ? 'खोजें' : 'Search'}
            </button>
          </div>

          {/* Quick Search Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
            <span className="text-slate-400 font-medium text-[11px]">
              {currentLang === 'hi' ? 'लोकप्रिय खोजें:' : 'Trending:'}
            </span>
            {quickTags.map((tag) => (
              <button
                key={tag.label}
                onClick={() => {
                  onSearchChange(tag.label);
                  onSelectCategory(tag.cat);
                  onNavigateSection('services');
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-medium transition-colors"
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Call-to-Action Buttons (including glowing Download Android APK) */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => onNavigateSection('services')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-orange-600/30 transition-all cursor-pointer group"
          >
            <span>{currentLang === 'hi' ? 'सीएससी सेवाएं देखें' : 'Explore CSC Services'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigateSection('sarkari-results')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-800/80 hover:bg-blue-700/90 text-white font-extrabold text-sm tracking-wide border border-blue-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-300" />
            <span>{currentLang === 'hi' ? 'सरकारी रिजल्ट' : 'Sarkari Results'}</span>
          </button>

          {onOpenDownloadModal && (
            <button
              onClick={onOpenDownloadModal}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/40 border border-emerald-300/40 transition-all cursor-pointer group"
            >
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>{currentLang === 'hi' ? 'फोन में इंस्टॉल / APK' : 'Install App / APK'}</span>
            </button>
          )}
        </div>

        {/* Trust Badges Strip */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black font-data text-white">10,000+</span>
              <span className="text-[11px] text-slate-400 block font-hindi">
                {currentLang === 'hi' ? 'संतुष्ट नागरिक' : 'Happy Citizens'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black text-white">100% Gov Auth</span>
              <span className="text-[11px] text-slate-400 block font-hindi">
                {currentLang === 'hi' ? 'सुरक्षित व अधिकृत' : 'Authorized VLE'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black text-white">Same Day</span>
              <span className="text-[11px] text-slate-400 block font-hindi">
                {currentLang === 'hi' ? 'त्वरित आवेदन' : 'Fast Processing'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-black text-white">4.9 / 5.0</span>
              <span className="text-[11px] text-slate-400 block font-hindi">
                {currentLang === 'hi' ? 'उत्कृष्ट जन सेवा' : 'Quality Rating'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
