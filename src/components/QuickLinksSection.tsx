import React from 'react';
import { ExternalLink, Globe, Shield, Landmark } from 'lucide-react';
import { QUICK_GOVT_PORTALS } from '../data/cscData';

interface QuickLinksSectionProps {
  currentLang: 'hi' | 'en';
}

export const QuickLinksSection: React.FC<QuickLinksSectionProps> = ({ currentLang }) => {
  return (
    <section className="py-14 bg-slate-900 text-white px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'महत्वपूर्ण सरकारी पोर्टल' : 'Official Government Portals'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-hindi">
              {currentLang === 'hi' ? 'उपयोगी डिजिटल इंडिया वेबसाइट्स एवं ऐप्स' : 'Quick Access Govt Portals'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-hindi mt-1">
              {currentLang === 'hi'
                ? 'नागरिकों की सुविधा हेतु मुख्य ई-गवर्नेंस पोर्टल्स के आधिकारिक डायरेक्ट लिंक्स'
                : 'Direct verified links to official e-governance systems and citizen services.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_GOVT_PORTALS.map((portal) => (
            <a
              key={portal.name}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500 rounded-2xl p-4 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-700 text-blue-300 px-2 py-0.5 rounded">
                    {portal.category}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-400 transition-colors" />
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                  {portal.name}
                </h3>
                <span className="text-xs text-amber-300 font-hindi block mt-0.5 font-medium">
                  {portal.hindi}
                </span>

                <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">
                  {portal.description}
                </p>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-700 text-[11px] font-semibold text-blue-400 group-hover:underline flex items-center gap-1">
                <span>{currentLang === 'hi' ? 'पोर्टल खोलें' : 'Open Portal'}</span>
                <span>→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
