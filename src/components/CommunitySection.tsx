import React, { useState } from 'react';
import {
  Heart,
  BookOpen,
  Users,
  Sparkles,
  Share2,
  ExternalLink,
  ChevronRight,
  HandHeart,
} from 'lucide-react';
import { SPIRITUAL_ITEMS } from '../data/cscData';

interface CommunitySectionProps {
  currentLang: 'hi' | 'en';
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({ currentLang }) => {
  const [selectedTextModal, setSelectedTextModal] = useState<string | null>(null);

  const bhaktiBodhExcerpt = `कबीर, मानुष जनम दुर्लभ है, मिले न बारम्बार।
तरवर से पत्ता टूट गिरे, बहुरि न लागे डार।।

माला फेरत जुग भया, फिरा न मन का फेर।
कर का मनका डारि दे, मन का मनका फेर।।

सत साहेब! भक्ति बोध एवं कबीर साहिब जी की वाणी मानव जीवन को सत्य, अहिंसा, दया और आत्म-कल्याण की राह दिखाती है।`;

  return (
    <section id="community" className="py-14 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{currentLang === 'hi' ? 'आध्यात्मिक एवं समाज सेवा' : 'Spiritual & Community Welfare'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-hindi">
          {currentLang === 'hi' ? 'सत कबीर भक्ति बोध एवं लोक कल्याण' : 'Sat Kabir Wisdom & Social Seva'}
        </h2>
        <p className="text-sm text-slate-600 mt-1 font-hindi">
          {currentLang === 'hi'
            ? 'दैनिक नामदान रिपोर्ट, आध्यात्मिक वाणी, रक्तदान एवं निस्वार्थ समाज सेवा के समर्पित प्रयास।'
            : 'Daily spiritual reports, devotional literature, blood donation camps, and community welfare.'}
        </p>
      </div>

      {/* Grid of 3 Community Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {SPIRITUAL_ITEMS.map((item, idx) => {
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                  {item.tag}
                </span>

                <h3 className="text-lg font-bold text-slate-900 mt-3 font-hindi">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 mt-2 font-hindi leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedTextModal(item.title)}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>{item.actionText}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL FOR SPIRITUAL TEXT */}
      {selectedTextModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-base font-bold text-slate-900 font-hindi flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>{selectedTextModal}</span>
              </h4>
              <button
                onClick={() => setSelectedTextModal(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="py-4 text-sm font-hindi leading-relaxed text-slate-700 whitespace-pre-line bg-amber-50/50 p-4 rounded-2xl my-2 border border-amber-100">
              {bhaktiBodhExcerpt}
            </div>

            <p className="text-xs text-slate-500 font-hindi text-center mt-2">
              सत्संग, नामदान व आध्यात्मिक साहित्य की अधिक जानकारी हेतु हमारे केंद्र पर संपर्क करें।
            </p>

            <button
              onClick={() => setSelectedTextModal(null)}
              className="mt-4 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs"
            >
              {currentLang === 'hi' ? 'वापस जाएं' : 'Back to Portal'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
