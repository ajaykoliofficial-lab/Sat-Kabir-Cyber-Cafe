import React, { useState } from 'react';
import { X, Copy, Check, Database, FolderTree, Layers, Cpu } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface DevSchemaModalProps {
  onClose: () => void;
}

export const DevSchemaModal: React.FC<DevSchemaModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'schema' | 'folder' | 'architecture'>('schema');
  const [copied, setCopied] = useState(false);

  const folderStructureText = `FitStreak/
├── app/                      # Expo / React Native or Web App router
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Bottom Navigation Bar
│   │   ├── index.tsx         # Dashboard & Daily Check-in Screen
│   │   ├── logger.tsx        # Workout Logger (Sets, Reps, Weights)
│   │   ├── analytics.tsx     # Consistency & Weight Progress Charts
│   │   ├── badges.tsx        # Milestone Badges & Gamification
│   │   └── profile.tsx       # Onboarding, Gym Timings & Settings
│   ├── modal/
│   │   ├── rest-timer.tsx    # Rest Interval Countdown
│   │   └── add-weight.tsx    # Body Weight Log Modal
│   └── _layout.tsx
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── StreakHero.tsx    # Fire flame streak counter
│   │   ├── CheckinButton.tsx # Large satisfying check-in CTA
│   │   ├── WeekCalendar.tsx  # Mon-Sun active vs missed days
│   │   ├── ExerciseCard.tsx  # Set/Rep table editor
│   │   └── BadgeCard.tsx     # Gamification badge showcase
│   ├── db/
│   │   ├── schema.ts         # Database Schema (Firestore / SQL)
│   │   └── client.ts         # DB Client connection
│   ├── store/
│   │   └── useFitnessStore.ts# Zustand / State management
│   ├── services/
│   │   ├── notifications.ts  # 30-min Pre-Gym Push Notifications
│   │   └── streakEngine.ts   # Consecutive streak & badge evaluator
│   ├── types/
│   │   └── index.ts          # Core TypeScript definitions
│   └── utils/
│       ├── audio.ts          # Web Audio synth chimes & feedback
│       └── dates.ts          # Date math & ISO helpers
├── package.json
└── tailwind.config.js`;

  const databaseSchemaText = `-- ========================================================
-- FITSTREAK DATABASE SCHEMA (PostgreSQL / Relational ORM)
-- ========================================================

-- 1. Users & Onboarding Profile
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(120) NOT NULL,
  fitness_goal VARCHAR(50) NOT NULL CHECK (fitness_goal IN ('muscle_gain', 'weight_loss', 'strength', 'endurance', 'general_fitness')),
  current_weight_kg NUMERIC(5, 2) NOT NULL,
  target_weight_kg NUMERIC(5, 2) NOT NULL,
  preferred_gym_time TIME NOT NULL DEFAULT '18:30:00',
  target_days_per_week INT NOT NULL DEFAULT 5 CHECK (target_days_per_week BETWEEN 1 AND 7),
  reminder_minutes_before INT NOT NULL DEFAULT 30,
  notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  sound_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Daily Check-in & Habit Tracking
CREATE TABLE daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  workout_title VARCHAR(120),
  duration_minutes INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT uq_user_date UNIQUE (user_id, checkin_date)
);

CREATE INDEX idx_checkins_user_date ON daily_checkins(user_id, checkin_date DESC);

-- 3. Workout Sessions
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  title VARCHAR(150) NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 45,
  total_volume_kg NUMERIC(10, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  intensity_rating INT CHECK (intensity_rating BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Logged Exercises & Sets
CREATE TABLE logged_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  exercise_name VARCHAR(120) NOT NULL,
  muscle_group VARCHAR(50) NOT NULL CHECK (muscle_group IN ('Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio')),
  order_index INT NOT NULL DEFAULT 0
);

CREATE TABLE exercise_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID NOT NULL REFERENCES logged_exercises(id) ON DELETE CASCADE,
  set_number INT NOT NULL,
  weight_kg NUMERIC(6, 2) NOT NULL DEFAULT 0,
  reps INT NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT TRUE,
  rpe NUMERIC(3, 1)
);

-- 5. Body Weight Progress Tracking
CREATE TABLE body_weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  weight_kg NUMERIC(5, 2) NOT NULL,
  notes VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Badges & Milestone Progress
CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_key VARCHAR(60) NOT NULL,
  title VARCHAR(100) NOT NULL,
  progress_percent INT NOT NULL DEFAULT 0,
  is_unlocked BOOLEAN NOT NULL DEFAULT FALSE,
  unlocked_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT uq_user_badge UNIQUE (user_id, badge_key)
);`;

  const architectureText = `// ========================================================
// CORE STREAK & NOTIFICATION ARCHITECTURE
// ========================================================

/**
 * 1. Consecutive Streak Computation Rule:
 * - If today's checkin == true: current streak counts consecutive days ending today.
 * - If today's checkin == false: check yesterday. If yesterday was completed, streak is alive and counts backwards from yesterday!
 * - If yesterday was missed: streak resets to 0.
 *
 * 2. Push Notification Trigger Algorithm (30m Prior):
 * - Target Time: User's preferredGymTime (e.g. 18:30)
 * - Reminder Offset: User's reminderMinutesBefore (30 min)
 * - Trigger Moment: 18:00
 * - Message: "Time to lock in! Your workout starts in 30 minutes. Keep your 5-day streak alive! 🔥"
 *
 * 3. Gamification Unlock Hooks:
 * - Evaluate after every Check-in or Workout Save:
 *   - streak >= 3  -> Unlock '3-Day Momentum'
 *   - streak >= 7  -> Unlock '7-Day Iron Discipline'
 *   - streak >= 30 -> Unlock '30-Day Beast Mode'
 *   - max_single_lift >= 100kg -> Unlock 'Century Lifter'
 *   - total_volume >= 10,000kg -> Unlock '10-Ton Club'
 */`;

  const handleCopy = () => {
    soundManager.playClick();
    const content =
      activeTab === 'schema'
        ? databaseSchemaText
        : activeTab === 'folder'
        ? folderStructureText
        : architectureText;

    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl bg-[#10141c] border border-[#232b3b] rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#1c222e]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-lime-500/20 border border-lime-500/30 flex items-center justify-center text-lime-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Developer Specs &amp; Database Architecture
              </h3>
              <p className="text-xs text-slate-400">
                Ready-to-use schemas for Cursor, Claude, v0, React Native or Backend
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-400 hover:bg-lime-300 text-black text-xs font-bold transition-all shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#181f2b] text-slate-400 hover:text-white border border-[#242c3b]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 p-2 bg-[#0c0e14] border-b border-[#1c222e]">
          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'schema'
                ? 'bg-[#1a212e] text-lime-400 border border-lime-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Database Schema (SQL/PostgreSQL)</span>
          </button>
          <button
            onClick={() => setActiveTab('folder')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'folder'
                ? 'bg-[#1a212e] text-lime-400 border border-lime-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>Project Folder Structure</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'architecture'
                ? 'bg-[#1a212e] text-lime-400 border border-lime-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Streak &amp; Notification Engine</span>
          </button>
        </div>

        {/* Code Content View */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#090b0f] font-mono text-xs leading-relaxed text-slate-300">
          <pre className="whitespace-pre-wrap select-all">
            {activeTab === 'schema'
              ? databaseSchemaText
              : activeTab === 'folder'
              ? folderStructureText
              : architectureText}
          </pre>
        </div>
      </div>
    </div>
  );
};
