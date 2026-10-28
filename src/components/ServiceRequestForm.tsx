import React, { useState, useEffect } from 'react';
import {
  Send,
  MessageCircle,
  CheckCircle2,
  Phone,
  FileCheck2,
  Sparkles,
  MapPin,
  Clock,
} from 'lucide-react';
import { CSCServiceItem } from '../types/csc';
import { CSC_SERVICES } from '../data/cscData';

interface ServiceRequestFormProps {
  currentLang: 'hi' | 'en';
  preselectedService: CSCServiceItem | null;
}

export const ServiceRequestForm: React.FC<ServiceRequestFormProps> = ({
  currentLang,
  preselectedService,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [selectedService, setSelectedService] = useState('PAN Card (New & Correction)');
  const [notes, setNotes] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setSelectedService(preselectedService.title);
      // scroll to form
      const el = document.getElementById('service-request');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [preselectedService]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const refId = `SK-REQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedRef(refId);

    // Prepare WhatsApp message
    const waText = encodeURIComponent(
      `*Sat Kabir CSC Center - Online Service Request*\n\n` +
      `Reference ID: ${refId}\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Location: ${location || 'Local'}\n` +
      `Service Needed: ${selectedService}\n` +
      `Notes: ${notes || 'None'}\n\n` +
      `Please confirm the required documents and fee details.`
    );

    window.open(`https://wa.me/919876543210?text=${waText}`, '_blank');
  };

  return (
    <section id="service-request" className="py-14 px-4 sm:px-6 max-w-5xl mx-auto">
      <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-blue-800/80 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left information column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-800/80 text-blue-200 text-xs font-bold border border-blue-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentLang === 'hi' ? 'ऑनलाइन आवेदन सहायता' : 'Online Application Desk'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-hindi leading-tight">
              {currentLang === 'hi'
                ? 'घर बैठे किसी भी सेवा का आवेदन कराएं'
                : 'Request Any Digital Service Online'}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 font-hindi leading-relaxed">
              {currentLang === 'hi'
                ? 'अपना नाम व मोबाइल नंबर दर्ज करें। हमारी टीम आपके दस्तावेजों की जांच कर तुरंत आवेदन प्रक्रिया शुरू कर देगी।'
                : 'Submit your contact details and required service. Our team will verify documents and assist via WhatsApp & Call.'}
            </p>

            <div className="space-y-3 pt-3 border-t border-blue-800/80 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <span>सत कबीर सीएससी सेंटर, मुख्य बस स्टैंड, ग्राम/शहर</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>हेल्पलाइन: +91 98765-43210 / WhatsApp उपलब्ध</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>कार्य समय: सुबह 8:00 बजे से सायं 8:00 बजे तक</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 text-slate-900 shadow-xl border border-slate-100">
            {submittedRef ? (
              <div className="text-center py-6 space-y-3 font-hindi animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">
                  {currentLang === 'hi' ? 'आवेदन अनुरोध दर्ज हुआ!' : 'Request Registered Successfully!'}
                </h3>
                <p className="text-xs text-slate-600">
                  {currentLang === 'hi'
                    ? 'आपका संदर्भ क्रमांक है:'
                    : 'Your Application Reference Number is:'}{' '}
                  <strong className="text-blue-900 font-data text-sm">{submittedRef}</strong>
                </p>
                <p className="text-xs text-slate-500">
                  {currentLang === 'hi'
                    ? 'विवरण WhatsApp पर प्रेषित कर दिया गया है। हमारे प्रतिनिधि शीघ्र संपर्क करेंगे।'
                    : 'Details forwarded to WhatsApp. Our CSC representative will confirm shortly.'}
                </p>
                <button
                  onClick={() => setSubmittedRef(null)}
                  className="mt-3 px-4 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold"
                >
                  {currentLang === 'hi' ? 'नया आवेदन करें' : 'Submit Another Request'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      {currentLang === 'hi' ? 'आपका पूरा नाम *' : 'Your Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-700"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      {currentLang === 'hi' ? 'मोबाइल नंबर (WhatsApp) *' : 'Mobile Number (WhatsApp) *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-data text-slate-900 focus:outline-none focus:border-blue-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      {currentLang === 'hi' ? 'ग्राम / मोहल्ला / शहर' : 'Village / Town / City'}
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Ward No 4 / Rampur"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-700"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      {currentLang === 'hi' ? 'आवश्यक सेवा चुनें *' : 'Select Required Service *'}
                    </label>
                    <select
                      value={selectedService}
                      onChange={(e) => setSelectedService(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-blue-700"
                    >
                      {CSC_SERVICES.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.titleHi} ({s.title})
                        </option>
                      ))}
                      <option value="Sarkari Job Form Online Apply">
                        सरकारी नौकरी फॉर्म ऑनलाइन भरवाना (Sarkari Job Apply)
                      </option>
                      <option value="Urgent Aadhaar Document Update">
                        आधार कार्ड दस्तावेज अपडेट (Aadhaar Update)
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                    {currentLang === 'hi' ? 'संदेश या विशेष आवश्यकता' : 'Message or Document Details'}
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      currentLang === 'hi'
                        ? 'जैसे: पैन कार्ड में नाम सुधार करवाना है, या नया फार्म भरना है।'
                        : 'e.g. Need urgent PAN correction or SSC GD form filling.'
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-700 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>
                    {currentLang === 'hi'
                      ? 'WhatsApp पर विवरण भेजें एवं सहायता पाएं'
                      : 'Send Details to WhatsApp & Get Help'}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
