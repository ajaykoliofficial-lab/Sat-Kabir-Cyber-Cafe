import React, { useState } from 'react';
import { Award, Lock, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { Badge, WorkoutSession } from '../types';
import { soundManager } from '../utils/audio';

interface GamificationProps {
  badges: Badge[];
  currentStreak: number;
  workouts: WorkoutSession[];
}

export const Gamification: React.FC<GamificationProps> = ({
  badges,
  currentStreak,
  workouts,
}) => {
  const [filter, setFilter] = useState<'all' | 'streak' | 'volume' | 'milestone'>('all');

  // Compute total volume
  const totalVolume = workouts.reduce((sum, w) => sum + (w.totalVolumeKg || 0), 0);
  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  // Compute gamer level & XP
  const xp = currentStreak * 150 + workouts.length * 200 + Math.floor(totalVolume / 50);
  const level = Math.max(1, Math.floor(xp / 1000) + 1);
  const currentLevelXp = xp % 1000;

  const levelTitles: Record<number, string> = {
    1: 'Iron Novice',
    2: 'Momentum Builder',
    3: 'Consistency Beast',
    4: 'Steel Discipline',
    5: 'Titan of the Gym',
    6: 'Legendary Lifter',
  };
  const title = levelTitles[Math.min(level, 6)] || 'Immortal Athlete';

  const filteredBadges = badges.filter((b) => {
    if (filter === 'all') return true;
    return b.category === filter;
  });

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      {/* 1. LEVEL & XP HERO BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#171c26] via-[#121620] to-[#1a202c] border border-amber-500/30 p-5 shadow-xl">
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1f2635] border border-amber-500/40 flex flex-col items-center justify-center text-amber-400 shadow-inner">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">LVL</span>
              <span className="text-2xl font-black font-data leading-none text-amber-400">{level}</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  Fitness Rank
                </span>
                <span className="text-slate-500">·</span>
                <span className="text-xs text-slate-300 font-medium">
                  {unlockedCount} of {badges.length} Badges Unlocked
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{title}</h2>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="sm:w-56 space-y-1.5 bg-[#12151c] p-3 rounded-xl border border-[#1e2533]">
            <div className="flex justify-between text-[11px] font-semibold">
              <span className="text-slate-400">Level {level} Progress</span>
              <span className="text-amber-400 font-data">{currentLevelXp} / 1000 XP</span>
            </div>
            <div className="w-full h-2 bg-[#1c222e] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-lime-400 rounded-full transition-all duration-300"
                style={{ width: `${(currentLevelXp / 1000) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY FILTER TABS */}
      <div className="flex items-center gap-2 p-1 bg-[#12161f] border border-[#1f2633] rounded-xl overflow-x-auto">
        {(['all', 'streak', 'volume', 'milestone'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              soundManager.playClick();
              setFilter(tab);
            }}
            className={`flex-1 min-w-[70px] py-1.5 px-3 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
              filter === tab
                ? 'bg-amber-400 text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'all' ? 'All Badges' : `${tab}s`}
          </button>
        ))}
      </div>

      {/* 3. BADGES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {filteredBadges.map((badge) => {
          return (
            <div
              key={badge.id}
              className={`relative overflow-hidden rounded-2xl p-4.5 border transition-all duration-200 ${
                badge.isUnlocked
                  ? 'bg-gradient-to-b from-[#161b24] to-[#12161f] border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.12)]'
                  : 'bg-[#12161f]/80 border-[#1e2533] opacity-80'
              }`}
            >
              {badge.isUnlocked && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/5 rounded-full blur-xl pointer-events-none" />
              )}

              <div className="flex items-start gap-3.5">
                {/* Badge Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 border ${
                    badge.isUnlocked
                      ? 'bg-amber-950/40 border-amber-500/50 shadow-md'
                      : 'bg-[#181e28] border-[#222a38] grayscale text-slate-500'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-white truncate">{badge.title}</h3>
                    {badge.isUnlocked ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider shrink-0 bg-amber-950/60 border border-amber-500/30 px-1.5 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 uppercase tracking-wider shrink-0">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{badge.description}</p>

                  <div className="mt-2.5 pt-2 border-t border-[#1a202c]">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">{badge.targetRequirement}</span>
                      {badge.isUnlocked ? (
                        <span className="text-[10px] text-slate-400 font-data">
                          Unlocked {badge.unlockedAt}
                        </span>
                      ) : (
                        <span className="font-data font-bold text-amber-400">{badge.progress}%</span>
                      )}
                    </div>

                    {!badge.isUnlocked && (
                      <div className="w-full h-1.5 bg-[#1a212e] rounded-full mt-1.5 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-lime-400 rounded-full"
                          style={{ width: `${badge.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
