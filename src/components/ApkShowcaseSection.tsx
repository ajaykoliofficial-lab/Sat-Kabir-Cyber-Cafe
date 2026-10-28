import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Bell,
  WifiOff,
  Copy,
  Check,
} from 'lucide-react';
import { OFFICIAL_APK_INFO, downloadOfficialApk } from '../utils/apkDownloader';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { soundManager } from '../utils/audio';

interface ApkShowcaseSectionProps {
  currentLang: 'hi' | 'en';
  onOpenModal?: () => void;
}

export const ApkShowcaseSection: React.FC<ApkShowcaseSectionProps> = ({
  currentLang,
  onOpenModal,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isInstallable, install } = usePWAInstall();

  const handlePwaInstall = async () => {
    soundManager.playClick();
    await install();
  };

  const handleCopyLink = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(`${window.location.origin}/${OFFICIAL_APK_INFO.fileName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-10 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-10 border-2 border-indigo-500/30 shadow-2xl">
        {/* Ambient Blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Description & Actions */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/60 border border-blue-400/40 text-blue-300 text-xs font-black">
              <Smartphone className="w-4 h-4 text-amber-400" />
              <span>SATKABIR PLUS MOBILE EXPERIENCE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight font-hindi">
              {currentLang === 'hi' ? (
                <>
                  सत कबीर प्लस को{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-300 to-cyan-300">
                    अपने फोन में इंस्टॉल करें
                  </span>
                </>
              ) : (
                <>
                  Run SatKabir Plus as a{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-emerald-300 to-cyan-300">
                    Dedicated Mobile App
                  </span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-hindi leading-relaxed max-w-xl">
              {currentLang === 'hi'
                ? 'सरकारी रिजल्ट अलर्ट, सीएससी डिजिटल सेवाएं, और बिना इंटरनेट चलने वाला जिम हैबिट ट्रैकर—अब सब कुछ सीधे आपके फोन में! आप सीधे 1-क्लिक में होम स्क्रीन पर जोड़ सकते हैं या पैकेज फाइल डाउनलोड कर सकते हैं।'
                : 'Get instant job notifications, CSC request tracking, and full offline habit tracking directly on your mobile device.'}
            </p>

            {/* Action Buttons: PWA 1-Click + Direct Native APK Link */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {isInstallable && (
                <button
                  onClick={handlePwaInstall}
                  className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>
                    {currentLang === 'hi' ? 'फोन में जोड़ें (1-क्लिक)' : 'Install on Mobile (1-Tap)'}
                  </span>
                </button>
              )}

              {/* Direct HTML <a> tag to ensure native browser download */}
              <a
                href={`/${OFFICIAL_APK_INFO.fileName}`}
                download={OFFICIAL_APK_INFO.fileName}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  setDownloadSuccess(true);
                  setTimeout(() => setDownloadSuccess(false), 5000);
                }}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>
                  {currentLang === 'hi'
                    ? 'डाउनलोड APK फाइल (18.4 MB)'
                    : 'Download APK File (18.4 MB)'}
                </span>
              </a>

              <button
                onClick={handleCopyLink}
                className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy URL'}</span>
              </button>
            </div>

            {downloadSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500 text-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>
                  {currentLang === 'hi'
                    ? 'डाउनलोड शुरू हो गया है! डाउनलोड्स फोल्डर में SatKabir-Plus-v2.4.2.apk चेक करें।'
                    : 'Download initiated! Check your downloads folder.'}
                </span>
              </div>
            )}
          </div>

          {/* Right Column: Key Benefits */}
          <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>{currentLang === 'hi' ? 'मोबाइल ऐप के मुख्य लाभ:' : 'Key Mobile Benefits:'}</span>
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-hindi">
                    {currentLang === 'hi' ? 'फुल-स्क्रीन स्टैंडअलोन' : 'Full-Screen Standalone'}
                  </strong>
                  <span className="text-slate-400 text-[11px] font-hindi">
                    {currentLang === 'hi'
                      ? 'ब्राउज़र एड्रेस बार के बिना बिना किसी रुकावट के चलता है।'
                      : 'Runs without browser chrome and URL bars.'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <WifiOff className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-hindi">
                    {currentLang === 'hi' ? 'ऑफलाइन जिम ट्रैकर' : 'Works Fully Offline'}
                  </strong>
                  <span className="text-slate-400 text-[11px] font-hindi">
                    {currentLang === 'hi'
                      ? 'इंटरनेट न होने पर भी वर्कआउट लॉग और स्ट्रीक सुरक्षित रहेंगे।'
                      : 'Never miss a check-in even when offline.'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-white block font-hindi">
                    {currentLang === 'hi' ? '30 मिनट पहले पुश अलर्ट' : '30-Min Workout Reminder'}
                  </strong>
                  <span className="text-slate-400 text-[11px] font-hindi">
                    {currentLang === 'hi'
                      ? 'जिम समय से आधा घंटा पहले फोन पर नोटिफिकेशन आएगा।'
                      : 'Timely reminders to lock in your daily gym habit.'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-hindi flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Free &amp; Secure
              </span>
              {onOpenModal && (
                <button
                  onClick={onOpenModal}
                  className="text-amber-400 hover:underline text-[11px] font-bold cursor-pointer"
                >
                  {currentLang === 'hi' ? 'सहायता व विकल्प >' : 'Help & Options >'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
