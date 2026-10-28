import React, { useState, useEffect } from 'react';
import { Smartphone, X, Sparkles, Download } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ApkTopBannerProps {
  currentLang: 'hi' | 'en';
  onOpenDownloadModal: () => void;
  onDismissPermanently?: () => void;
}

export const ApkTopBanner: React.FC<ApkTopBannerProps> = ({
  currentLang,
  onOpenDownloadModal,
  onDismissPermanently,
}) => {
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('satkabir_apk_banner_hidden') === 'true';
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    soundManager.playClick();
    setDismissed(true);
    localStorage.setItem('satkabir_apk_banner_hidden', 'true');
    if (onDismissPermanently) {
      onDismissPermanently();
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-3 sm:px-4 py-2 text-xs border-b border-indigo-700/60 shadow-sm relative z-30 flex items-center justify-between gap-3 animate-in fade-in">
      <div className="flex items-center gap-2.5 overflow-hidden">
        <div className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-sm">
          <Smartphone className="w-3.5 h-3.5" />
        </div>
        <div className="flex items-center gap-2 truncate">
          <span className="font-extrabold uppercase bg-emerald-500 text-white px-1.5 py-0.2 rounded text-[9px] shrink-0 font-data">
            MOBILE APP
          </span>
          <span className="font-semibold truncate font-hindi text-slate-200">
            {currentLang === 'hi'
              ? 'सत कबीर प्लस को सीधे अपने फोन स्क्रीन पर 1-क्लिक में जोड़ें या ऐप डाउनलोड करें!'
              : 'Add SatKabir Plus directly to your mobile home screen or download the package!'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenDownloadModal}
          className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md transition-all cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          <span>{currentLang === 'hi' ? 'फोन में जोड़ें / APK' : 'Install / APK'}</span>
        </button>

        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          title={currentLang === 'hi' ? 'बैनर हटाएं' : 'Dismiss banner'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
