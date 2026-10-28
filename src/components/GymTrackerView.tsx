import React, { useState } from 'react';
import {
  Flame,
  Dumbbell,
  BarChart3,
  Award,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { DailyCheckIn, UserProfile, WeightRecord, WorkoutSession, Badge } from '../types';
import { Dashboard } from './Dashboard';
import { WorkoutLogger } from './WorkoutLogger';
import { Analytics } from './Analytics';
import { Gamification } from './Gamification';
import { soundManager } from '../utils/audio';

interface GymTrackerViewProps {
  profile: UserProfile;
  checkins: DailyCheckIn[];
  workouts: WorkoutSession[];
  badges: Badge[];
  weights: WeightRecord[];
  currentStreak: number;
  longestStreak: number;
  currentLang: 'hi' | 'en';
  onToggleTodayCheckin: () => void;
  onToggleDateCheckin: (dateStr: string) => void;
  onSaveWorkout: (workout: WorkoutSession) => void;
  onAddWeightRecord: (record: WeightRecord) => void;
  onOpenRestTimer: (seconds: number) => void;
  onTriggerTestReminder: () => void;
}

export const GymTrackerView: React.FC<GymTrackerViewProps> = ({
  profile,
  checkins,
  workouts,
  badges,
  weights,
  currentStreak,
  longestStreak,
  currentLang,
  onToggleTodayCheckin,
  onToggleDateCheckin,
  onSaveWorkout,
  onAddWeightRecord,
  onOpenRestTimer,
  onTriggerTestReminder,
}) => {
  const [gymSubTab, setGymSubTab] = useState<'today' | 'logger' | 'stats' | 'badges'>('today');

  return (
    <div className="bg-[#0b0e14] text-white min-h-[85vh] py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Gym Module Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1c2333]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635]" />
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-lime-400">
                FitStreak Module
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white mt-0.5">
              {currentLang === 'hi' ? 'जिम हैबिट ट्रैकर एवं वर्कआउट' : 'Gym Habit Tracker & Logger'}
            </h2>
            <p className="text-xs text-slate-400 font-hindi">
              {currentLang === 'hi'
                ? 'दैनिक आदत बनाएं, वर्कआउट लॉग करें और स्ट्रीक बनाए रखें।'
                : 'Build unbreakable workout consistency, log sets, and unlock badges.'}
            </p>
          </div>

          {/* Sub Navigation Segmented Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#121622] rounded-xl border border-[#1f2638] overflow-x-auto no-scrollbar">
            <button
              onClick={() => {
                soundManager.playClick();
                setGymSubTab('today');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                gymSubTab === 'today'
                  ? 'bg-lime-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'आज का चेक-इन' : 'Today Check-in'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setGymSubTab('logger');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                gymSubTab === 'logger'
                  ? 'bg-lime-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dumbbell className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'वर्कआउट लॉगर' : 'Logger'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setGymSubTab('stats');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                gymSubTab === 'stats'
                  ? 'bg-lime-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'एनालिटिक्स' : 'Stats'}</span>
            </button>

            <button
              onClick={() => {
                soundManager.playClick();
                setGymSubTab('badges');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                gymSubTab === 'badges'
                  ? 'bg-lime-400 text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'बैज व लेवल्स' : 'Badges'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Today Dashboard */}
        {gymSubTab === 'today' && (
          <Dashboard
            profile={profile}
            checkins={checkins}
            workouts={workouts}
            badges={badges}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            onToggleTodayCheckin={onToggleTodayCheckin}
            onToggleDateCheckin={onToggleDateCheckin}
            onNavigateToLogger={() => setGymSubTab('logger')}
            onNavigateToBadges={() => setGymSubTab('badges')}
            onTriggerTestReminder={onTriggerTestReminder}
          />
        )}

        {/* Tab 2: Workout Logger */}
        {gymSubTab === 'logger' && (
          <WorkoutLogger
            workouts={workouts}
            onSaveWorkout={onSaveWorkout}
            onOpenRestTimer={onOpenRestTimer}
          />
        )}

        {/* Tab 3: Progress Analytics */}
        {gymSubTab === 'stats' && (
          <Analytics
            profile={profile}
            checkins={checkins}
            workouts={workouts}
            weights={weights}
            onAddWeightRecord={onAddWeightRecord}
          />
        )}

        {/* Tab 4: Badges */}
        {gymSubTab === 'badges' && (
          <Gamification
            badges={badges}
            currentStreak={currentStreak}
            workouts={workouts}
          />
        )}
      </div>
    </div>
  );
};
