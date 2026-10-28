import React, { useState } from 'react';
import {
  FileText,
  Award,
  Download,
  Calendar,
  ExternalLink,
  ChevronRight,
  Flame,
  Search,
} from 'lucide-react';
import { SARKARI_RESULTS_DATA } from '../data/cscData';
import { SarkariJobItem } from '../types/csc';

interface SarkariResultSectionProps {
  currentLang: 'hi' | 'en';
  onSelectJob: (job: SarkariJobItem) => void;
}

export const SarkariResultSection: React.FC<SarkariResultSectionProps> = ({
  currentLang,
  onSelectJob,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const jobsList = SARKARI_RESULTS_DATA.filter(
    (item) =>
      item.type === 'job' &&
      (filterQuery === '' ||
        item.postName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  const admitCardsList = SARKARI_RESULTS_DATA.filter(
    (item) =>
      item.type === 'admit_card' &&
      (filterQuery === '' ||
        item.postName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  const resultsList = SARKARI_RESULTS_DATA.filter(
    (item) =>
      item.type === 'result' &&
      (filterQuery === '' ||
        item.postName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        item.department.toLowerCase().includes(filterQuery.toLowerCase()))
  );

  return (
    <section id="sarkari-results" className="py-14 bg-slate-100 border-y border-slate-200 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5 fill-red-600 animate-pulse" />
              <span>{currentLang === 'hi' ? 'सरकारी रिजल्ट एवं रोजगार पोर्टल' : 'Sarkari Result & Jobs Portal'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-hindi">
              {currentLang === 'hi' ? 'नवीनतम सरकारी नौकरियां, प्रवेश पत्र एवं परिणाम' : 'Latest Jobs, Admit Cards & Results'}
            </h2>
            <p className="text-sm text-slate-600 font-hindi mt-1">
              {currentLang === 'hi'
                ? 'सरकारी नौकरियों के सभी फॉर्म हमारे सीएससी केंद्र पर त्रुटिरहित भरवाएं।'
                : 'Get your government application forms filled accurately at Sat Kabir CSC Center.'}
            </p>
          </div>

          {/* Search within Jobs */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder={currentLang === 'hi' ? 'भर्ती या रिजल्ट खोजें...' : 'Filter jobs or results...'}
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        {/* 3-Column Classic High-Utility Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLUMN 1: LATEST JOBS */}
          <div className="bg-white rounded-2xl border-2 border-red-200 overflow-hidden shadow-sm flex flex-col">
            <div className="bg-gradient-to-r from-red-600 to-rose-700 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  {currentLang === 'hi' ? 'नवीनतम नौकरियां (Latest Jobs)' : 'Latest Jobs 2026'}
                </h3>
              </div>
              <span className="text-[10px] bg-white text-red-700 font-bold px-1.5 py-0.5 rounded">
                {jobsList.length} Active
              </span>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {jobsList.map((job) => (
                <div
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="p-3.5 hover:bg-red-50/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-red-700 transition-colors leading-snug">
                          {job.postName}
                        </span>
                        {job.isNew && (
                          <span className="text-[9px] font-extrabold bg-red-100 text-red-700 px-1.5 rounded animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block">{job.department}</span>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1.5 font-data">
                        <span className="text-red-600 font-semibold">Last Date: {job.lastDateOrRelease}</span>
                        <span>·</span>
                        <span>{job.totalPosts}</span>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-500 font-medium font-hindi">
                {currentLang === 'hi' ? 'फॉर्म भरवाने हेतु आवश्यक कागजात लेकर केंद्र पर आएं' : 'Visit center to apply with documents'}
              </span>
            </div>
          </div>

          {/* COLUMN 2: ADMIT CARDS */}
          <div className="bg-white rounded-2xl border-2 border-blue-200 overflow-hidden shadow-sm flex flex-col">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  {currentLang === 'hi' ? 'प्रवेश पत्र (Admit Cards)' : 'Admit Cards'}
                </h3>
              </div>
              <span className="text-[10px] bg-white text-blue-800 font-bold px-1.5 py-0.5 rounded">
                Live
              </span>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {admitCardsList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectJob(item)}
                  className="p-3.5 hover:bg-blue-50/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug block">
                        {item.postName}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{item.department}</span>
                      <span className="text-[10px] text-blue-600 font-bold block mt-1">
                        {item.lastDateOrRelease}
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-500 font-medium font-hindi">
                {currentLang === 'hi' ? 'रंगीन प्रवेश पत्र प्रिंटिंग मात्र ₹10 में' : 'Color Admit Card printout available'}
              </span>
            </div>
          </div>

          {/* COLUMN 3: RESULTS */}
          <div className="bg-white rounded-2xl border-2 border-emerald-200 overflow-hidden shadow-sm flex flex-col">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                <h3 className="text-sm font-black uppercase tracking-wider">
                  {currentLang === 'hi' ? 'परिणाम (Results & Cut-off)' : 'Results & Cut-Off'}
                </h3>
              </div>
              <span className="text-[10px] bg-white text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                Declared
              </span>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {resultsList.map((res) => (
                <div
                  key={res.id}
                  onClick={() => onSelectJob(res)}
                  className="p-3.5 hover:bg-emerald-50/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug block">
                        {res.postName}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">{res.department}</span>
                      <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                        {res.lastDateOrRelease}
                      </span>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
              <span className="text-[11px] text-slate-500 font-medium font-hindi">
                {currentLang === 'hi' ? 'स्कोरकार्ड व मेरिट सूची तुरंत चेक करवाएं' : 'Check scorecard and merit list at CSC'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
