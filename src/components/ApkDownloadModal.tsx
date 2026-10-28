import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  Download,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  EyeOff,
  Share2,
  Copy,
  Check,
  Info,
  Layers,
} from 'lucide-react';
import { soundManager, triggerHaptic } from '../utils/audio';
import { OFFICIAL_APK_INFO, downloadOfficialApk, isInIframe } from '../utils/apkDownloader';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ApkDownloadModalProps {
  onClose: () => void;
  currentLang: 'hi' | 'en';
  onDisableApkFeatures?: () => void;
}

export const ApkDownloadModal: React.FC<ApkDownloadModalProps> = ({
  onClose,
  currentLang,
  onDisableApkFeatures,
}) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'apk' | 'hide'>('pwa');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const inIframe = isInIframe();

  const handlePwaInstall = async () => {
    soundManager.playClick();
    triggerHaptic('medium');
    const success = await install();
    if (success) {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // Ignored
      }
    }
  };

  const handleCopyDirectLink = () => {
    soundManager.playClick();
    const fullUrl = `${window.location.origin}/${OFFICIAL_APK_INFO.fileName}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const handleDirectDownload = () => {
    downloadOfficialApk(() => {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-data">
                  ANDROID &amp; MOBILE APP
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight mt-0.5">
                SatKabir Plus — Mobile Setup
              </h3>
              <p className="text-xs text-slate-300 font-hindi">
                {currentLang === 'hi'
                  ? 'फोन में ऐप इस्तेमाल करने के दो सबसे आसान तरीके'
                  : 'Two easy ways to run the Super App on your mobile'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1.5 flex gap-1 border-b border-slate-200 text-xs font-bold font-hindi">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'pwa'
                ? 'bg-white text-blue-900 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{currentLang === 'hi' ? '1-क्लिक ऐप (बिना APK)' : '1-Tap App (PWA)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('apk')}
            className={`flex-1 py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'apk'
                ? 'bg-white text-emerald-800 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentLang === 'hi' ? 'APK फाइल डाउनलोड' : 'Download APK'}</span>
          </button>

          <button
            onClick={() => setActiveTab('hide')}
            className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'hide'
                ? 'bg-red-50 text-red-700 shadow-xs font-black'
                : 'text-slate-500 hover:text-red-600'
            }`}
            title="Hide APK options"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{currentLang === 'hi' ? 'हटाएं' : 'Hide'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-800 font-hindi flex-1">
          {/* TAB 1: DIRECT PWA INSTALL (RECOMMENDED) */}
          {activeTab === 'pwa' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    अनुशंसित (RECOMMENDED)
                  </span>
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% सेफ
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-900">
                  {currentLang === 'hi'
                    ? 'बिना किसी डाउनलोड के सीधे होम स्क्रीन पर जोड़ें'
                    : 'Instant Android Home Screen App (Zero Download Required)'}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentLang === 'hi'
                    ? 'इसमें कोई APK parse error नहीं आता और कोई Unknown Sources ऑन नहीं करना पड़ता। यह असली ऐप की तरह फोन स्क्रीन पर आइकन बन जाता है और ऑफलाइन भी चलता है।'
                    : 'Runs in standalone mode, works offline, and requires zero security permissions or APK package parsing.'}
                </p>

                {isInstallable && (
                  <button
                    onClick={handlePwaInstall}
                    className="w-full mt-2 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>
                      {currentLang === 'hi'
                        ? 'अभी फोन में ऐप इंस्टॉल करें (1-क्लिक)'
                        : 'Install App on Phone Now (1-Tap)'}
                    </span>
                  </button>
                )}
              </div>

              {/* Step by step for mobile browser */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>
                    {currentLang === 'hi'
                      ? 'क्रोम ब्राउज़र से 3 सेकंड में इंस्टॉल करने का तरीका:'
                      : 'How to Install via Chrome Browser (Android):'}
                  </span>
                </h5>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <strong className="text-slate-900 block">
                        {currentLang === 'hi' ? 'ऊपर 3 डॉट्स (⋮) दबाएं' : 'Tap the 3 dots (⋮) menu'}
                      </strong>
                      <span className="text-slate-500 text-[11px]">
                        {currentLang === 'hi'
                          ? 'मोबाइल में क्रोम ब्राउज़र के ऊपर दाहिने कोने में तीन डॉट्स पर क्लिक करें।'
                          : 'In mobile Chrome, tap the top-right menu button.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-blue-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <strong className="text-slate-900 block">
                        {currentLang === 'hi'
                          ? '"Add to Home screen" या "Install app" चुनें'
                          : 'Tap "Install app" or "Add to Home screen"'}
                      </strong>
                      <span className="text-slate-500 text-[11px]">
                        {currentLang === 'hi'
                          ? 'मेन्यू में "होम स्क्रीन में जोड़ें" या "ऐप इंस्टॉल करें" पर टैप करें।'
                          : 'Select "Add to Home screen" from the Chrome dropdown.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <strong className="text-slate-900 block">
                        {currentLang === 'hi' ? 'ऐप तैयार है!' : 'Ready on Home Screen!'}
                      </strong>
                      <span className="text-slate-500 text-[11px]">
                        {currentLang === 'hi'
                          ? 'सत कबीर प्लस का ऐप आइकन आपके फोन स्क्रीन पर आ जाएगा।'
                          : 'SatKabir Plus icon is added to your phone launcher.'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT APK FILE DOWNLOAD */}
          {activeTab === 'apk' && (
            <div className="space-y-4 animate-in fade-in">
              {/* App Specifications */}
              <div className="grid grid-cols-3 gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-2xl text-center">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Package</span>
                  <span className="text-xs font-black font-data text-slate-900">v2.4.2</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Size</span>
                  <span className="text-xs font-black font-data text-emerald-600">18.4 MB</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Platform</span>
                  <span className="text-xs font-bold text-slate-900">Android 7+</span>
                </div>
              </div>

              {inIframe && (
                <div className="bg-amber-50 border border-amber-300 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">
                      {currentLang === 'hi' ? 'ब्राउज़र सुरक्षा सूचना:' : 'Browser Security Notice:'}
                    </strong>
                    <span>
                      {currentLang === 'hi'
                        ? 'वेब प्रीव्यू आईफ्रेम (Iframe Sandbox) सुरक्षा कारणों से सीधे फाइल डाउनलोड ब्लॉक कर सकता है। नीचे दिए गए सीधे डाउनलोड लिंक पर क्लिक करें।'
                        : 'Sandboxed browser previews may restrict automated downloads. Use the direct HTML link below.'}
                    </span>
                  </div>
                </div>
              )}

              {/* Direct HTML Native Anchor Link (Ensures Browser Triggers Download) */}
              <div className="space-y-2.5">
                <a
                  href={`/${OFFICIAL_APK_INFO.fileName}`}
                  download={OFFICIAL_APK_INFO.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleDirectDownload}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/30 transition-all cursor-pointer text-center"
                >
                  <Download className="w-4 h-4 animate-bounce" />
                  <span>
                    {currentLang === 'hi'
                      ? 'सीधा APK डाउनलोड लिंक (SatKabir-Plus-v2.4.2.apk)'
                      : 'Direct APK Download (SatKabir-Plus-v2.4.2.apk)'}
                  </span>
                </a>

                {downloadSuccess && (
                  <div className="p-2.5 bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-800 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>
                      {currentLang === 'hi'
                        ? 'डाउनलोड ट्रिगर कर दिया गया है! अपने डाउनलोड्स फोल्डर की जांच करें।'
                        : 'Download initiated! Please check your device Downloads.'}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleCopyDirectLink}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>
                    {copiedLink
                      ? currentLang === 'hi'
                        ? 'डाउनलोड लिंक कॉपी हो गया!'
                        : 'Download Link Copied!'
                      : currentLang === 'hi'
                      ? 'सीधा डाउनलोड URL कॉपी करें'
                      : 'Copy Direct Download URL'}
                  </span>
                </button>
              </div>

              {/* Developer Note on Native APK compilation */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500 space-y-1">
                <span className="font-bold text-slate-700 block">
                  {currentLang === 'hi' ? 'एंड्रॉइड डेवलपर्स के लिए:' : 'For Android Developers:'}
                </span>
                <p>
                  {currentLang === 'hi'
                    ? 'अगर आप Android Studio या Capacitor से असली साइन्ड APK बनाना चाहते हैं, तो "Next.js Specs" मेनू से प्रोजेक्ट कोड एक्सपोर्ट करें।'
                    : 'To build a signed production release APK, use Capacitor (npx cap add android) and build in Android Studio.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: HIDE / REMOVE APK OPTIONS */}
          {activeTab === 'hide' && (
            <div className="space-y-4 animate-in fade-in text-center p-2">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center">
                <EyeOff className="w-6 h-6" />
              </div>
              <h4 className="text-base font-black text-slate-900">
                {currentLang === 'hi'
                  ? 'क्या आप APK डाउनलोड के विकल्प हटाना चाहते हैं?'
                  : 'Do you want to hide the APK Download options?'}
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                {currentLang === 'hi'
                  ? 'यदि आपको APK डाउनलोड बैनर या बटन नहीं चाहिए, तो आप इसे पूरी तरह बंद कर सकते हैं। आप ऐप को साधारण सुपर ऐप (वेबसाइट) की तरह इस्तेमाल कर सकेंगे।'
                  : 'If you prefer not to display APK download buttons and banners, you can disable them completely.'}
              </p>

              <button
                onClick={() => {
                  soundManager.playClick();
                  if (onDisableApkFeatures) onDisableApkFeatures();
                  onClose();
                }}
                className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all cursor-pointer"
              >
                {currentLang === 'hi'
                  ? 'हाँ, APK डाउनलोड विकल्प हटाएं (Hide APK Banner)'
                  : 'Yes, Remove APK Download Feature'}
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-hindi">
            {currentLang === 'hi' ? 'सत कबीर डिजिटल सेवा केंद्र' : 'SatKabir Digital Seva'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
          >
            {currentLang === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
