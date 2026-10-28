import React, { useState } from 'react';
import { X, Copy, Check, Code2, FolderTree, Database, Layers } from 'lucide-react';

interface DevSpecsModalProps {
  onClose: () => void;
}

export const DevSpecsModal: React.FC<DevSpecsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'schema' | 'nextjs'>('structure');
  const [copied, setCopied] = useState(false);

  const folderStructureText = `sat-kabir-csc/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout with Devanagari & Sans fonts, SEO meta
│   ├── page.tsx                  # Complete Homepage with Hero, Services & Sarkari Results
│   ├── typing-test/
│   │   └── page.tsx              # Hindi & English typing speed tester
│   ├── billing/
│   │   └── page.tsx              # CSC Invoice & Customer Receipt Generator
│   ├── sarkari-result/
│   │   ├── page.tsx              # Full Sarkari Result Job Explorer
│   │   └── [id]/page.tsx         # Detailed Job & Notification View
│   └── api/
│       ├── ticker/route.ts       # Live Marquee news API
│       ├── services/route.ts     # E-Governance service catalog
│       └── enquiry/route.ts      # WhatsApp & Email service enquiry endpoint
├── components/
│   ├── Navbar.tsx                # Bilingual header with helpline & CSC VLE ID
│   ├── TickerBar.tsx             # Smooth continuous scrolling alert ticker
│   ├── HeroSection.tsx           # Digital India banner & live search bar
│   ├── ServicesGrid.tsx          # Categorized CSC services with document requirements
│   ├── SarkariResultSection.tsx  # 3-column classic Sarkari Result view
│   ├── JobDetailModal.tsx        # Job eligibility, dates & WhatsApp apply modal
│   ├── TypingTestTool.tsx        # Real-time WPM, Net Speed, & Certificate print
│   ├── BillingTool.tsx           # Thermal & A4 customer receipt generator
│   ├── QuickLinksSection.tsx     # Direct links to official UIDAI, Income Tax portals
│   ├── ServiceRequestForm.tsx    # Citizen application form with WhatsApp trigger
│   └── Footer.tsx                # Official disclaimer, VLE credentials & location
├── data/
│   └── cscData.ts                # Real-time schemes, job vacancies & alert repository
├── public/                       # CSC Emblem, Digital India logos, favicons
├── tailwind.config.ts            # Tailwind CSS configuration
└── package.json`;

  const databaseSchemaText = `-- ========================================================
-- SAT KABIR CSC CENTER DATABASE SCHEMA (PostgreSQL / Supabase)
-- ========================================================

-- 1. Services Catalog (E-Governance, Banking, Certificates)
CREATE TABLE csc_services (
  id VARCHAR(60) PRIMARY KEY,
  category VARCHAR(50) NOT NULL CHECK (category IN ('csc', 'banking', 'certificates', 'utility', 'education')),
  title_en VARCHAR(150) NOT NULL,
  title_hi VARCHAR(150) NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  processing_time VARCHAR(80) NOT NULL,
  govt_fee VARCHAR(80) NOT NULL,
  required_docs JSONB NOT NULL DEFAULT '[]'::JSONB,
  badge VARCHAR(50),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Sarkari Results & Government Job Notifications
CREATE TABLE sarkari_jobs (
  id VARCHAR(80) PRIMARY KEY,
  post_name VARCHAR(200) NOT NULL,
  department VARCHAR(200) NOT NULL,
  item_type VARCHAR(40) NOT NULL CHECK (item_type IN ('job', 'admit_card', 'result', 'admission', 'syllabus')),
  last_date_or_release VARCHAR(80) NOT NULL,
  total_vacancies VARCHAR(60),
  qualification TEXT NOT NULL,
  age_limit VARCHAR(80),
  application_fee VARCHAR(150),
  official_notification_url VARCHAR(255),
  official_apply_url VARCHAR(255),
  is_new_badge BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_sarkari_type ON sarkari_jobs(item_type, created_at DESC);

-- 3. Live Marquee Ticker Alerts
CREATE TABLE ticker_alerts (
  id SERIAL PRIMARY KEY,
  title_en TEXT NOT NULL,
  title_hi TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  link_url VARCHAR(255),
  display_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Customer Service Requests & Inquiries
CREATE TABLE customer_requests (
  id VARCHAR(60) PRIMARY KEY, -- e.g. SK-REQ-89412
  customer_name VARCHAR(120) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  village_or_town VARCHAR(120),
  service_requested VARCHAR(150) NOT NULL,
  notes TEXT,
  status VARCHAR(40) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CSC Invoices & Bill Logs
CREATE TABLE csc_invoices (
  receipt_number VARCHAR(60) PRIMARY KEY, -- e.g. SK-894123
  customer_name VARCHAR(120) NOT NULL,
  customer_phone VARCHAR(20),
  items_json JSONB NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_status VARCHAR(30) NOT NULL DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  const nextJsSnippet = `// app/page.tsx (Next.js 14+ / 15 with Tailwind CSS)
import { Navbar } from "@/components/Navbar";
import { TickerBar } from "@/components/TickerBar";
import { HeroSection } from "@/components/HeroSection";
import { ServicesGrid } from "@/components/ServicesGrid";
import { SarkariResultSection } from "@/components/SarkariResultSection";
import { TypingTestTool } from "@/components/TypingTestTool";
import { BillingTool } from "@/components/BillingTool";
import { CommunitySection } from "@/components/CommunitySection";
import { QuickLinksSection } from "@/components/QuickLinksSection";
import { ServiceRequestForm } from "@/components/ServiceRequestForm";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <TickerBar />
      <HeroSection />
      <ServicesGrid />
      <SarkariResultSection />
      <TypingTestTool />
      <BillingTool />
      <CommunitySection />
      <QuickLinksSection />
      <ServiceRequestForm />
      <Footer />
    </main>
  );
}`;

  const handleCopy = () => {
    const text =
      activeTab === 'structure'
        ? folderStructureText
        : activeTab === 'schema'
        ? databaseSchemaText
        : nextJsSnippet;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] text-white">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Sat Kabir CSC — Next.js Specs &amp; Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Ready-to-use project files, database schema &amp; Next.js components
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 p-2 bg-slate-950 border-b border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('structure')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'structure' ? 'bg-slate-800 text-blue-400' : 'text-slate-400'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Folder Structure</span>
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'schema' ? 'bg-slate-800 text-blue-400' : 'text-slate-400'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>SQL Database Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('nextjs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'nextjs' ? 'bg-slate-800 text-blue-400' : 'text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Next.js App Router Page</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs leading-relaxed text-slate-300">
          <pre className="whitespace-pre-wrap select-all">
            {activeTab === 'structure'
              ? folderStructureText
              : activeTab === 'schema'
              ? databaseSchemaText
              : nextJsSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
