import React from 'react';
import {
  X,
  Calendar,
  Briefcase,
  GraduationCap,
  Users,
  CheckCircle2,
  FileText,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import { SarkariJobItem } from '../types/csc';

interface JobDetailModalProps {
  job: SarkariJobItem | null;
  onClose: () => void;
  currentLang: 'hi' | 'en';
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose, currentLang }) => {
  if (!job) return null;

  const handleApplyWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Sat Kabir CSC Center, I want to apply for ${job.postName} (${job.department}). Please tell me the required documents and form filling process.`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header with Sarkari Result Header Style */}
        <div className="bg-gradient-to-r from-red-700 via-rose-700 to-red-800 text-white p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-extrabold bg-white text-red-700 px-2 py-0.5 rounded">
                Sarkari Notification
              </span>
              {job.isNew && (
                <span className="text-[10px] uppercase font-extrabold bg-amber-400 text-slate-900 px-2 py-0.5 rounded animate-pulse">
                  NEW
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-black tracking-tight">{job.postName}</h3>
            <p className="text-xs text-red-100 font-medium">{job.department}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm text-slate-800 font-hindi">
          {/* Key Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[11px] text-slate-500 font-semibold uppercase block">
                {currentLang === 'hi' ? 'अंतिम तिथि' : 'Last Date'}
              </span>
              <span className="text-sm font-bold text-red-700 font-data block mt-0.5">
                {job.lastDateOrRelease}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[11px] text-slate-500 font-semibold uppercase block">
                {currentLang === 'hi' ? 'कुल पद' : 'Total Vacancies'}
              </span>
              <span className="text-sm font-bold text-slate-900 font-data block mt-0.5">
                {job.totalPosts || 'As per rules'}
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-500 font-semibold uppercase block">
                {currentLang === 'hi' ? 'आयु सीमा' : 'Age Limit'}
              </span>
              <span className="text-sm font-bold text-slate-900 block mt-0.5">
                {job.ageLimit || '18 to 28+ Yrs'}
              </span>
            </div>
          </div>

          {/* Qualification Requirement */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5 mb-1.5">
              <GraduationCap className="w-4 h-4 text-blue-700" />
              <span>{currentLang === 'hi' ? 'शैक्षणिक योग्यता (Eligibility)' : 'Educational Qualification'}</span>
            </h4>
            <p className="text-xs text-blue-950 font-semibold leading-relaxed">
              {job.qualification}
            </p>
          </div>

          {/* Application Fee */}
          {job.applicationFee && (
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                {currentLang === 'hi' ? 'आवेदन शुल्क (Application Fee)' : 'Application Fee Structure'}
              </h4>
              <p className="text-xs text-slate-800 font-semibold font-data">{job.applicationFee}</p>
            </div>
          )}

          {/* Documents to bring to CSC */}
          <div className="border border-slate-200 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-orange-600" />
              <span>
                {currentLang === 'hi'
                  ? 'सीएससी केंद्र पर फॉर्म भरवाने हेतु आवश्यक दस्तावेज:'
                  : 'Documents needed to apply at our CSC:'}
              </span>
            </h4>
            <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
              <li>10th / 12th / Graduation Marksheet &amp; Certificate</li>
              <li>Aadhaar Card (Linked with active Mobile Number)</li>
              <li>Passport size latest photo &amp; clean signature</li>
              <li>Caste Certificate / EWS / Domicile (if applicable for reservation)</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer CTAs */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleApplyWhatsApp}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>
              {currentLang === 'hi' ? 'सीएससी से फॉर्म भरवाएं (WhatsApp)' : 'Apply via Sat Kabir CSC'}
            </span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
          >
            {currentLang === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
