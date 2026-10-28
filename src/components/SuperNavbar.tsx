import React from 'react';
import {
  Flame,
  Globe,
  Smartphone,
  Monitor,
  Code2,
  Building2,
  Dumbbell,
  FileText,
  User,
  Volume2,
  VolumeX,
  Download,
} from 'lucide-react';

export type SuperTab = 'csc_home' | 'sarkari_jobs' | 'gym_tracker' | 'profile';

interface SuperNavbarProps {
  activeTab: SuperTab;
  onSelectTab: (tab: SuperTab) => void;
  currentLang: 'hi' | 'en';
  onToggleLang: () => void;
  currentStreak: number;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenDevSpecs: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenDownloadModal?: () => void;
}

export const SuperNavbar: React.FC<SuperNavbarProps> = ({
  activeTab,
  onSelectTab,
  currentLang,
  onToggleLang,
  currentStreak,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenDevSpecs,
  soundEnabled,
  onToggleSound,
  onOpenDownloadModal,
}) => {
  const isGymMode = activeTab === 'gym_tracker';

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-colors duration-200 border-b ${
        isGymMode
          ? 'bg-[#0c0e14]/95 text-white border-[#1f2636] backdrop-blur-md'
          : 'bg-white/95 text-slate-900 border-slate-200 backdrop-blur-md shadow-sm'
      }`}
    >
      {/* Top utility strip */}
      <div
        className={`text-[11px] py-1 px-4 border-b flex items-center justify-between ${
          isGymMode
            ? 'bg-[#080a0e] text-slate-400 border-[#1a202d]'
            : 'bg-slate-900 text-slate-300 border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-amber-400">
            {currentLang === 'hi'
              ? 'सत कबीर प्लस — ऑल-इन-वन सुपर ऐप'
              : 'SatKabir Plus — All-in-One Super App'}
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-400">
            CSC ID: <strong className="text-white font-data">419208310023</strong>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Active streak pill */}
          <button
            onClick={() => onSelectTab('gym_tracker')}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-950/70 border border-orange-500/40 text-orange-400 font-bold font-data text-[10px] hover:scale-105 transition-transform"
          >
            <Flame className="w-3 h-3 fill-orange-400 animate-pulse" />
            <span>{currentStreak}d Streak</span>
          </button>

          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute sound FX' : 'Enable sound FX'}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-lime-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Language toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold border border-slate-700"
          >
            <Globe className="w-3 h-3 text-amber-400" />
            <span>{currentLang === 'hi' ? 'ENG' : 'हिंदी'}</span>
          </button>

          {/* Device Frame Toggle */}
          <button
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? 'Expand to Full Width' : 'Preview in Mobile Phone Frame'}
            className="p-1 rounded text-slate-400 hover:text-white"
          >
            {isMobileFrame ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
          </button>

          {/* APK Download Button */}
          {onOpenDownloadModal && (
            <button
              onClick={onOpenDownloadModal}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>APK (18MB)</span>
            </button>
          )}

          {/* Dev specs */}
          <button
            onClick={onOpenDevSpecs}
            className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/80 hover:bg-blue-900 text-blue-300 text-[10px] font-bold border border-blue-800"
          >
            <Code2 className="w-3 h-3" />
            <span>Next.js Specs</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('csc_home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-900 to-indigo-800 flex items-center justify-center text-white shadow-md font-black text-sm tracking-tighter shrink-0 border border-blue-700">
            SK+
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span
                className={`text-base sm:text-lg font-black tracking-tight leading-none ${
                  isGymMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                SatKabir Plus
              </span>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-xs">
                SUPER APP
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-hindi font-medium mt-0.5">
              {currentLang === 'hi'
                ? 'डिजिटल सेवा + सरकारी रिजल्ट + जिम ट्रैकर'
                : 'CSC Services · Sarkari Jobs · Gym Tracker'}
            </p>
          </div>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#151923] border border-slate-200 dark:border-[#222a38]">
          <button
            onClick={() => onSelectTab('csc_home')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'csc_home'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>{currentLang === 'hi' ? 'सीएससी पोर्टल' : 'CSC Home'}</span>
          </button>

          <button
            onClick={() => onSelectTab('sarkari_jobs')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'sarkari_jobs'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{currentLang === 'hi' ? 'सरकारी रिजल्ट' : 'Sarkari Jobs'}</span>
          </button>

          <button
            onClick={() => onSelectTab('gym_tracker')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'gym_tracker'
                ? 'bg-gradient-to-r from-lime-400 to-emerald-400 text-black shadow-sm font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>{currentLang === 'hi' ? 'जिम ट्रैकर' : 'Gym Tracker'}</span>
          </button>

          <button
            onClick={() => onSelectTab('profile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{currentLang === 'hi' ? 'प्रोफाइल' : 'Profile'}</span>
          </button>
        </nav>

        {/* Right CTA / Quick Mode Toggle */}
        <div className="flex items-center gap-2">
          {activeTab !== 'gym_tracker' ? (
            <button
              onClick={() => onSelectTab('gym_tracker')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f172a] hover:bg-slate-800 text-lime-400 border border-slate-700 text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Dumbbell className="w-3.5 h-3.5 text-lime-400" />
              <span className="hidden sm:inline">
                {currentLang === 'hi' ? 'जिम वर्कआउट' : 'Gym Mode'}
              </span>
            </button>
          ) : (
            <button
              onClick={() => onSelectTab('csc_home')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-800 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {currentLang === 'hi' ? 'सीएससी सेवाएं' : 'CSC Services'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
