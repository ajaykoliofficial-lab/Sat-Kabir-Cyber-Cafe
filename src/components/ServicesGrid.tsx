import React, { useState } from 'react';
import {
  CreditCard,
  Landmark,
  ShieldCheck,
  Banknote,
  Sprout,
  Mail,
  FileText,
  HeartPulse,
  Zap,
  Vote,
  Briefcase,
  ShoppingBag,
  Clock,
  CheckCircle,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { CSC_SERVICES } from '../data/cscData';
import { CSCServiceItem } from '../types/csc';

interface ServicesGridProps {
  currentLang: 'hi' | 'en';
  searchQuery: string;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectServiceToApply: (service: CSCServiceItem) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({
  currentLang,
  searchQuery,
  selectedCategory,
  onSelectCategory,
  onSelectServiceToApply,
}) => {
  // Map icon names to Lucide icons
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'CreditCard': return CreditCard;
      case 'Landmark': return Landmark;
      case 'ShieldCheck': return ShieldCheck;
      case 'Banknote': return Banknote;
      case 'Sprout': return Sprout;
      case 'Mail': return Mail;
      case 'FileText': return FileText;
      case 'HeartPulse': return HeartPulse;
      case 'Zap': return Zap;
      case 'Vote': return Vote;
      case 'Briefcase': return Briefcase;
      case 'ShoppingBag': return ShoppingBag;
      default: return FileText;
    }
  };

  const categories = [
    { id: 'all', labelEn: 'All Services', labelHi: 'सभी सेवाएं' },
    { id: 'csc', labelEn: 'CSC & E-Governance', labelHi: 'सीएससी सेवाएं' },
    { id: 'banking', labelEn: 'Banking & DigiPay', labelHi: 'बैंकिंग व लोन' },
    { id: 'certificates', labelEn: 'Certificates (e-District)', labelHi: 'प्रमाण पत्र' },
    { id: 'utility', labelEn: 'Bills & Recharge', labelHi: 'बिल व रिचार्ज' },
  ];

  const filteredServices = CSC_SERVICES.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.titleHi.includes(searchQuery) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.descriptionHi.includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="services" className="py-14 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-orange-600" />
            <span>{currentLang === 'hi' ? 'नागरिक सेवाएं' : 'Citizen Services'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-hindi">
            {currentLang === 'hi' ? 'सीएससी डिजिटल सेवाएं एवं योजनाएं' : 'CSC Digital Services & Schemes'}
          </h2>
          <p className="text-sm text-slate-600 font-hindi mt-1">
            {currentLang === 'hi'
              ? 'ग्राम व शहर के नागरिकों के लिए सरकार द्वारा अधिकृत त्वरित सेवाएं'
              : 'Direct authorized e-governance services for all citizens with quick turnaround.'}
          </p>
        </div>

        {/* Category Segmented Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              {currentLang === 'hi' ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <Filter className="w-10 h-10 text-slate-400 mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-800">
            {currentLang === 'hi' ? 'कोई सेवा नहीं मिली' : 'No services found matching your query'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {currentLang === 'hi' ? 'कृपया अन्य शब्द से खोजें या फ़िल्टर रीसेट करें।' : 'Try clearing your search keyword.'}
          </p>
          <button
            onClick={() => {
              onSelectCategory('all');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold"
          >
            {currentLang === 'hi' ? 'सभी सेवाएं दिखाएं' : 'Show All Services'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((service) => {
            const Icon = getIconComponent(service.icon);

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-blue-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group relative"
              >
                {/* Optional Badge */}
                {service.badge && (
                  <span className="absolute top-4 right-4 text-[10px] font-extrabold uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-md">
                    {service.badge}
                  </span>
                )}

                <div>
                  {/* Icon & Title */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="pr-12">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors font-hindi leading-snug">
                        {currentLang === 'hi' ? service.titleHi : service.title}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium block">
                        {service.title}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 font-hindi leading-relaxed mb-4">
                    {currentLang === 'hi' ? service.descriptionHi : service.description}
                  </p>

                  {/* Processing info & Docs strip */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="flex items-center gap-1 text-[11px] font-medium">
                        <Clock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{service.processingTime}</span>
                      </span>
                      <span className="font-semibold text-slate-700 text-[11px]">
                        {service.govtFeeApprox}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      <strong className="text-slate-700">
                        {currentLang === 'hi' ? 'जरूरी दस्तावेज:' : 'Required:'}
                      </strong>{' '}
                      {service.requiredDocs.join(', ')}
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectServiceToApply(service)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-900 text-slate-800 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer group-hover:bg-blue-900 group-hover:text-white"
                  >
                    <span>{currentLang === 'hi' ? 'आवेदन कराएं / सहायता' : 'Avail Service / Apply'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
