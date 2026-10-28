import React, { useState, useEffect, useRef } from 'react';
import {
  Keyboard,
  Timer,
  RotateCcw,
  Award,
  CheckCircle,
  Printer,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { TypingResult } from '../types/csc';

interface TypingTestToolProps {
  currentLang: 'hi' | 'en';
}

const SAMPLE_TEXTS = {
  en: "Government examinations like SSC, Railway, and State High Courts require candidates to possess fast and accurate typing skills. Consistent practice with proper finger positioning enables aspirants to achieve the mandatory threshold of 35 words per minute with over 90 percent accuracy. Digital India and e-governance systems depend on efficient data entry and citizen service delivery across rural and urban centers.",
  hi: "डिजिटल भारत और ई-गवर्नेंस सेवाओं के विस्तार से सरकारी विभागों में कुशल कंप्यूटर ऑपरेटर और लिपिकों की मांग बढ़ गई है। एसएससी, उच्च न्यायालय एवं रेलवे जैसी प्रतियोगी परीक्षाओं में सफलता के लिए हिंदी व अंग्रेजी टाइपिंग में कम से कम तीस से पैंतीस शब्द प्रति मिनट की गति तथा नब्बे प्रतिशत शुद्धता अनिवार्य है। नियमित अभ्यास से आत्मविश्वास और सटीकता में निरंतर वृद्धि होती है।",
};

export const TypingTestTool: React.FC<TypingTestToolProps> = ({ currentLang }) => {
  const [testLang, setTestLang] = useState<'en' | 'hi'>('en');
  const [duration, setDuration] = useState<number>(60); // seconds
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [candidateName, setCandidateName] = useState<string>('Student Candidate');
  const [typedInput, setTypedInput] = useState<string>('');

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const targetText = SAMPLE_TEXTS[testLang];

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsFinished(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Handle start
  const handleStart = () => {
    setIsActive(true);
    setIsFinished(false);
    setTimeLeft(duration);
    setTypedInput('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Handle reset
  const handleReset = () => {
    setIsActive(false);
    setIsFinished(false);
    setTimeLeft(duration);
    setTypedInput('');
  };

  // Calculations
  const timeElapsed = duration - timeLeft || 1;
  const wordsTyped = typedInput.trim().split(/\s+/).filter(Boolean).length;
  const grossWpm = Math.round((wordsTyped / timeElapsed) * 60) || 0;

  // Compute accuracy
  let errors = 0;
  for (let i = 0; i < typedInput.length; i++) {
    if (typedInput[i] !== targetText[i]) {
      errors++;
    }
  }
  const accuracy = typedInput.length > 0 ? Math.max(0, Math.round(((typedInput.length - errors) / typedInput.length) * 100)) : 100;
  const netWpm = Math.max(0, Math.round(grossWpm * (accuracy / 100)));

  return (
    <section id="typing-test" className="py-14 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
          <Keyboard className="w-3.5 h-3.5" />
          <span>{currentLang === 'hi' ? 'ऑनलाइन टाइपिंग स्पीड टेस्ट' : 'Online Typing Speed Test'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-hindi">
          {currentLang === 'hi' ? 'एसएससी, रेलवे व कोर्ट परीक्षा हेतु टाइपिंग टेस्ट' : 'Hindi & English Speed Tester'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 font-hindi">
          {currentLang === 'hi'
            ? 'अपनी टाइपिंग गति (WPM) व शुद्धता (%) जांचें और अपना डिजिटल सर्टिफिकेट प्रिंट करें।'
            : 'Check your real-time WPM, Net Speed, Accuracy and generate a verified certificate.'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-5 sm:p-7">
        {/* Controls strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          {/* Language selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => {
                setTestLang('en');
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                testLang === 'en' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              English Typing
            </button>
            <button
              onClick={() => {
                setTestLang('hi');
                handleReset();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                testLang === 'hi' ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              हिंदी टाइपिंग (देवनागरी)
            </button>
          </div>

          {/* Duration selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">
              {currentLang === 'hi' ? 'समय:' : 'Time:'}
            </span>
            {[60, 120, 300].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setDuration(sec);
                  setTimeLeft(sec);
                  setIsActive(false);
                  setIsFinished(false);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold font-data transition-all ${
                  duration === sec ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {sec / 60}m
              </button>
            ))}
          </div>

          {/* Candidate name input */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Candidate:</span>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-900 font-semibold focus:outline-none focus:border-blue-700 w-36"
              placeholder="Your Name"
            />
          </div>
        </div>

        {/* Live Metrics Strip */}
        <div className="grid grid-cols-4 gap-3 py-4 border-b border-slate-100 text-center">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Time Left</span>
            <span className="text-xl sm:text-2xl font-black font-data text-blue-900">
              {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Gross WPM</span>
            <span className="text-xl sm:text-2xl font-black font-data text-slate-900">{grossWpm}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Net WPM</span>
            <span className="text-xl sm:text-2xl font-black font-data text-emerald-600">{netWpm}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Accuracy</span>
            <span className="text-xl sm:text-2xl font-black font-data text-orange-600">{accuracy}%</span>
          </div>
        </div>

        {/* Sample Target Text Box */}
        <div className="my-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed font-hindi select-none max-h-36 overflow-y-auto">
          {targetText}
        </div>

        {/* Input Textarea */}
        <div className="relative">
          <textarea
            ref={inputRef}
            rows={4}
            disabled={isFinished}
            value={typedInput}
            onChange={(e) => {
              if (!isActive && !isFinished) {
                setIsActive(true);
              }
              setTypedInput(e.target.value);
            }}
            placeholder={
              currentLang === 'hi'
                ? 'यहाँ टाइप करना शुरू करें, समय स्वतः शुरू हो जाएगा...'
                : 'Start typing here to automatically start the timer...'
            }
            className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-blue-700 focus:outline-none text-slate-900 text-sm font-hindi leading-relaxed bg-white shadow-inner resize-none"
          />

          {!isActive && !isFinished && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
              <button
                onClick={handleStart}
                className="px-6 py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-900/20 cursor-pointer"
              >
                {currentLang === 'hi' ? 'टाइपिंग टेस्ट शुरू करें' : 'Start Typing Test'}
              </button>
            </div>
          )}
        </div>

        {/* Controls action buttons */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{currentLang === 'hi' ? 'रीसेट करें' : 'Reset Test'}</span>
          </button>

          {isFinished && (
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'सर्टिफिकेट प्रिंट करें' : 'Print Speed Certificate'}</span>
            </button>
          )}
        </div>

        {/* FINISHED CERTIFICATE SUMMARY (Printable) */}
        {isFinished && (
          <div className="mt-6 p-6 rounded-3xl bg-gradient-to-r from-blue-50 via-slate-50 to-orange-50 border-2 border-dashed border-blue-300 text-center relative print:border-solid">
            <div className="inline-flex p-2 rounded-full bg-emerald-100 text-emerald-800 mb-2">
              <Award className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-slate-900 font-hindi">
              Sat Kabir CSC Center — Typing Speed Performance Certificate
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Certified for Candidate: <strong>{candidateName}</strong> on {new Date().toLocaleDateString()}
            </p>

            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto my-4 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">NET SPEED</span>
                <span className="text-xl font-black font-data text-blue-900">{netWpm} WPM</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">ACCURACY</span>
                <span className="text-xl font-black font-data text-emerald-600">{accuracy}%</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold block">ERRORS</span>
                <span className="text-xl font-black font-data text-red-600">{errors}</span>
              </div>
            </div>

            <p className="text-xs text-slate-600 font-hindi">
              {netWpm >= 35
                ? 'शाबाश! आपकी टाइपिंग गति अधिकांश सरकारी परीक्षाओं (SSC / Court / Railway) के मानक (35 WPM) से बेहतर है।'
                : 'अभ्यास जारी रखें! प्रतिदिन 15-20 मिनट टाइपिंग करने से आपकी गति 35 WPM पार हो जाएगी।'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
