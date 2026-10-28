import React from 'react';
import {
  ShieldAlert,
  Phone,
  Mail,
  MapPin,
  Clock,
  Heart,
  MessageCircle,
  Send,
  Youtube,
  Globe,
} from 'lucide-react';

interface FooterProps {
  currentLang: 'hi' | 'en';
  onNavigate: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-20 sm:pb-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white font-extrabold flex items-center justify-center text-sm">
                SK
              </div>
              <span className="text-base font-black text-white tracking-tight">
                Sat Kabir CSC Center
              </span>
            </div>
            <p className="text-slate-400 font-hindi leading-relaxed text-[11px]">
              {currentLang === 'hi'
                ? 'सत कबीर कॉमन सर्विस सेंटर (CSC) - ग्रामीण व शहरी नागरिकों को डिजिटल इंडिया, बैंकिंग, ई-डिस्ट्रिक्ट एवं सरकारी भर्ती फॉर्म सेवाएं सुलभ कराने हेतु समर्पित।'
                : 'Authorized Common Service Centre delivering digital governance, banking, state certificates, and job alerts to citizens.'}
            </p>
            <div className="pt-2 text-[11px] text-slate-300 font-data">
              <div>CSC VLE ID: <strong className="text-amber-400">419208310023</strong></div>
              <div>VLE Name: <strong>Sat Kabir Seva Kendra</strong></div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 font-hindi">
              {currentLang === 'hi' ? 'महत्वपूर्ण सेवाएं' : 'Key Services'}
            </h4>
            <ul className="space-y-1.5 text-[11px] font-hindi">
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-amber-400 transition-colors"
                >
                  नया पैन कार्ड एवं सुधार (PAN Card)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('services')}
                  className="hover:text-amber-400 transition-colors"
                >
                  डिजीपे आधार नकद निकासी (AePS Cash)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('sarkari-results')}
                  className="hover:text-amber-400 transition-colors"
                >
                  ताजा सरकारी नौकरी रिजल्ट (Sarkari Result)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('typing-test')}
                  className="hover:text-amber-400 transition-colors"
                >
                  हिंदी व अंग्रेजी टाइपिंग टेस्ट (Typing Tool)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('billing-tool')}
                  className="hover:text-amber-400 transition-colors"
                >
                  सीएससी रसीद जनरेटर (Billing Software)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('community')}
                  className="hover:text-amber-400 transition-colors"
                >
                  भक्ति बोध एवं नामदान रिपोर्ट (Spiritual)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Center Contact & Timing */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {currentLang === 'hi' ? 'केंद्र का पता व संपर्क' : 'Center Location & Contact'}
            </h4>
            <div className="flex items-start gap-2 text-[11px]">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>सत कबीर सीएससी केंद्र, मुख्य बस स्टैंड चौराहा, भारत</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>हेल्पलाइन: +91 98765-43210</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <span>info@satkabircsc.in</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>8:00 AM - 8:00 PM (सोमवार - शनिवार)</span>
            </div>
          </div>

          {/* Col 4: Community Alert Channels */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
              {currentLang === 'hi' ? 'जॉब अलर्ट ग्रुप से जुड़ें' : 'Join Alert Community'}
            </h4>
            <p className="text-[11px] text-slate-400 font-hindi">
              नई भर्तियों एवं सरकारी योजनाओं की जानकारी सबसे पहले अपने फोन पर पाने के लिए हमारे ग्रुप में जुड़ें:
            </p>
            <div className="flex flex-col gap-2">
              <a
                href="https://wa.me/919876543210?text=Please%20add%20me%20to%20Sat%20Kabir%20Job%20Alerts"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/80 border border-emerald-600/40 text-emerald-400 hover:text-emerald-300 text-[11px] font-bold"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Join WhatsApp Job Channel</span>
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-950/80 border border-blue-600/40 text-blue-400 hover:text-blue-300 text-[11px] font-bold"
              >
                <Send className="w-4 h-4" />
                <span>Join Telegram Alerts</span>
              </a>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 leading-relaxed font-hindi space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <ShieldAlert className="w-4 h-4" />
            <span>अस्वीकरण (Disclaimer):</span>
          </div>
          <p>
            सत कबीर सीएससी केंद्र (Sat Kabir CSC Center) भारत सरकार के डिजिटल सेवा (CSC e-Governance) के अंतर्गत एक अधिकृत सुविधा केंद्र है। इस पोर्टल पर प्रदर्शित सरकारी नौकरियों (Sarkari Result), परीक्षा तिथियों एवं प्रवेश पत्रों की जानकारी अभ्यर्थियों की सहायता हेतु आधिकारिक स्रोतों से संकलित की जाती है। किसी भी असुविधा से बचने के लिए अभ्यर्थी संबंधित भर्ती बोर्ड की मूल आधिकारिक विज्ञप्ति से अवश्य मिलान करें।
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-900 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Sat Kabir CSC Center. सर्वाधिकार सुरक्षित (All Rights Reserved).
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>डिजिटल सेवा केंद्र</span>
            <span>·</span>
            <span>ई-मित्र / सीएससी</span>
            <span>·</span>
            <span>रोजगार संगम</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
