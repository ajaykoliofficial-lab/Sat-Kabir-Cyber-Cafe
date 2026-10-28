import React, { useState } from 'react';
import { X, Copy, Check, Code2, FolderTree, Database, Layers } from 'lucide-react';

interface SuperDevSpecsModalProps {
  onClose: () => void;
}

export const SuperDevSpecsModal: React.FC<SuperDevSpecsModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'schema' | 'nextjs'>('structure');
  const [copied, setCopied] = useState(false);

  const folderStructureText = `satkabir-plus-super-app/
├── app/                          # Next.js 14/15 App Router OR Expo Router
│   ├── (modules)/
│   │   ├── (csc)/                # MODULE 2: CSC & SARKARI PORTAL
│   │   │   ├── page.tsx          # CSC Home (Services, Quick Links, Marquee)
│   │   │   ├── jobs/page.tsx     # Sarkari Results & Vacancy Explorer
│   │   │   ├── typing/page.tsx   # Online Typing Speed Test Tool
│   │   │   └── billing/page.tsx  # CSC Customer Receipt & Invoice Tool
│   │   ├── (gym)/                # MODULE 1: FITNESS & HABIT TRACKER (Dark Theme)
│   │   │   ├── tracker/page.tsx  # Daily Habit Check-in & Fire Streak
│   │   │   ├── logger/page.tsx   # Sets, Reps & Weight Volume Logger
│   │   │   └── stats/page.tsx    # Consistency & Body Weight Progression
│   │   └── profile/page.tsx      # Unified Settings (Gym Timing + CSC Account)
│   ├── layout.tsx                # Super App Root Layout + Font configuration
│   └── api/                      # Full-stack API routes (Jobs, Schemes, Notifications)
├── components/
│   ├── navigation/
│   │   ├── SuperNavbar.tsx       # Mode Switcher & Top Header
│   │   └── SuperBottomNav.tsx    # Thumb-friendly 4-Tab Bottom Bar
│   ├── csc/                      # CSC & Jobs Components
│   │   ├── TickerBar.tsx         # Breaking Alerts Marquee
│   │   ├── ServicesGrid.tsx      # PAN, DigiPay, Insurance, Agriculture
│   │   └── SarkariResultView.tsx # 3-Column Jobs, Admit Cards, Results
│   └── fitness/                  # Gym Tracker Components
│       ├── CheckinButton.tsx     # Satisfying Check-in with Confetti & Synth
│       ├── StreakCounter.tsx     # Animated Flame & Consistency %
│       └── RestTimerModal.tsx    # Floating Rest Interval Timer
├── public/
│   ├── satkabir-plus-v2.4.2.apk  # Android APK Binary Download Package
│   └── manifest.json             # PWA Web App Manifest
├── tailwind.config.ts
└── package.json`;

  const databaseSchemaText = `-- ========================================================
-- SATKABIR PLUS SUPER APP UNIFIED DATABASE SCHEMA (Supabase / PostgreSQL)
-- ========================================================

-- 1. Unified User Accounts (Profile & Preferences)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  village_or_town VARCHAR(120),
  fitness_goal VARCHAR(50) DEFAULT 'muscle_gain',
  current_weight_kg NUMERIC(5, 2) DEFAULT 72.8,
  target_weight_kg NUMERIC(5, 2) DEFAULT 75.0,
  preferred_gym_time TIME DEFAULT '18:30:00',
  target_days_per_week INT DEFAULT 5,
  notifications_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Daily Gym Habits & Consecutive Streaks
CREATE TABLE gym_daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  workout_title VARCHAR(120),
  duration_minutes INT,
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT uq_user_checkin UNIQUE (user_id, checkin_date)
);

-- 3. Workout Sessions & Exercise Sets
CREATE TABLE gym_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  title VARCHAR(150) NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 45,
  total_volume_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE gym_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES gym_workouts(id) ON DELETE CASCADE,
  exercise_name VARCHAR(120) NOT NULL,
  muscle_group VARCHAR(50) NOT NULL,
  set_number INT NOT NULL,
  weight_kg NUMERIC(6, 2) NOT NULL,
  reps INT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT TRUE
);

-- 4. CSC Citizen Service Requests
CREATE TABLE csc_service_requests (
  id VARCHAR(60) PRIMARY KEY, -- e.g. SK-REQ-89412
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(120) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  service_name VARCHAR(150) NOT NULL,
  notes TEXT,
  status VARCHAR(40) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Sarkari Results & Job Alerts
CREATE TABLE sarkari_job_alerts (
  id VARCHAR(80) PRIMARY KEY,
  post_name VARCHAR(200) NOT NULL,
  department VARCHAR(200) NOT NULL,
  item_type VARCHAR(40) NOT NULL CHECK (item_type IN ('job', 'admit_card', 'result')),
  last_date_or_release VARCHAR(80) NOT NULL,
  total_posts VARCHAR(60),
  qualification TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  const nextJsAppLayout = `// app/layout.tsx - Super App Layout with Bottom Navigation
import { SuperNavbar } from "@/components/navigation/SuperNavbar";
import { SuperBottomNav } from "@/components/navigation/SuperBottomNav";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="hi">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <SuperNavbar />
        <main className="pb-20">{children}</main>
        <SuperBottomNav />
      </body>
    </html>
  );
}`;

  const handleCopy = () => {
    const text =
      activeTab === 'structure'
        ? folderStructureText
        : activeTab === 'schema'
        ? databaseSchemaText
        : nextJsAppLayout;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] text-white">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-800 flex items-center justify-center text-white">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                SatKabir Plus — Super App Architecture &amp; Schemas
              </h3>
              <p className="text-xs text-slate-400">
                Unified structure for Next.js, React Native (Expo) &amp; Supabase
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
            <span>Unified Database Schema</span>
          </button>
          <button
            onClick={() => setActiveTab('nextjs')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'nextjs' ? 'bg-slate-800 text-blue-400' : 'text-slate-400'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Next.js Layout Strategy</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs leading-relaxed text-slate-300">
          <pre className="whitespace-pre-wrap select-all">
            {activeTab === 'structure'
              ? folderStructureText
              : activeTab === 'schema'
              ? databaseSchemaText
              : nextJsAppLayout}
          </pre>
        </div>
      </div>
    </div>
  );
};
