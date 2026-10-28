import React from 'react';
import { Bell, Flame, ChevronRight } from 'lucide-react';
import { TICKER_ALERTS } from '../data/cscData';
import { TickerAlert } from '../types/csc';

interface TickerBarProps {
  currentLang: 'hi' | 'en';
  onSelectAlert: (alert: TickerAlert) => void;
}

export const TickerBar: React.FC<TickerBarProps> = ({ currentLang, onSelectAlert }) => {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white text-xs border-b border-blue-800/80 shadow-inner overflow-hidden flex items-center">
      {/* Static Label Badge */}
      <div className="bg-orange-600 text-white font-extrabold px-3 py-2 sm:px-4 flex items-center gap-1.5 shrink-0 z-10 shadow-md">
        <Flame className="w-3.5 h-3.5 fill-white animate-pulse" />
        <span className="uppercase tracking-wider text-[11px] whitespace-nowrap">
          {currentLang === 'hi' ? 'ताजा सूचना' : 'LATEST ALERTS'}
        </span>
      </div>

      {/* Marquee Scroller */}
      <div className="relative flex-1 overflow-hidden py-2 cursor-pointer">
        <div className="animate-ticker flex items-center gap-8">
          {/* Duplicate list to enable infinite smooth scroll */}
          {[...TICKER_ALERTS, ...TICKER_ALERTS].map((alert, idx) => (
            <div
              key={`${alert.id}-${idx}`}
              onClick={() => onSelectAlert(alert)}
              className="inline-flex items-center gap-2 group hover:text-amber-300 transition-colors shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              <span className="font-semibold text-slate-100 group-hover:underline">
                {currentLang === 'hi' ? alert.titleHi : alert.title}
              </span>
              <span className="text-[10px] bg-blue-800/90 text-amber-300 border border-blue-600 px-1.5 py-0.2 rounded font-data font-bold">
                {alert.linkText}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* View all quick action */}
      <div className="hidden sm:flex items-center gap-1 bg-blue-950/90 px-3 py-2 border-l border-blue-800 shrink-0 z-10">
        <button
          onClick={() => {
            const el = document.getElementById('sarkari-results');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="text-[11px] font-bold text-amber-300 hover:text-white flex items-center gap-0.5 whitespace-nowrap"
        >
          <span>{currentLang === 'hi' ? 'सभी देखें' : 'View All'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
