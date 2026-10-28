import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Flame,
  CheckCircle2,
  Calendar,
  Clock,
  Dumbbell,
  Bell,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  Zap,
} from 'lucide-react';
import { DailyCheckIn, UserProfile, WorkoutSession, Badge } from '../types';
import { formatDate, getTodayDateString } from '../utils/storage';
import { soundManager, triggerHaptic } from '../utils/audio';

interface DashboardProps {
  profile: UserProfile;
  checkins: DailyCheckIn[];
  workouts: WorkoutSession[];
  badges: Badge[];
  currentStreak: number;
  longestStreak: number;
  onToggleTodayCheckin: () => void;
  onToggleDateCheckin: (dateStr: string) => void;
  onNavigateToLogger: () => void;
  onNavigateToBadges: () => void;
  onTriggerTestReminder: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  checkins,
  workouts,
  badges,
  currentStreak,
  longestStreak,
  onToggleTodayCheckin,
  onToggleDateCheckin,
  onNavigateToLogger,
  onNavigateToBadges,
  onTriggerTestReminder,
}) => {
  const todayStr = getTodayDateString();
  const todayCheckin = checkins.find((c) => c.date === todayStr);
  const isDoneToday = Boolean(todayCheckin?.completed);

  const [isPressing, setIsPressing] = useState(false);

  // Today's workout session if logged
  const todaysWorkout = workouts.find((w) => w.date === todayStr);

  // Calculate consistency rate over past 30 days
  const completedCount = checkins.filter((c) => c.completed).length;
  const totalDays = checkins.length || 30;
  const consistencyRate = Math.round((completedCount / totalDays) * 100);

  // Next badge to unlock
  const nextBadge = badges.find((b) => !b.isUnlocked) || badges[0];

  // Fire confetti and sound celebration on check-in
  const handleCheckinClick = () => {
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 200);

    if (!isDoneToday) {
      // Trigger sound, haptic, and confetti burst
      soundManager.playCheckin();
      triggerHaptic('success');

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#a3e635', '#22c55e', '#10b981', '#ffffff', '#38bdf8'],
        });
      } catch {
        // Confetti fallback
      }
    } else {
      soundManager.playClick();
      triggerHaptic('light');
    }

    onToggleTodayCheckin();
  };

  // Generate current week dates (Monday to Sunday)
  const getWeekDates = () => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday
    // Distance from Monday (1)
    const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today);
    monday.setDate(today.getDate() + distanceToMonday);

    const week = [];
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = formatDate(d);
      const checkin = checkins.find((c) => c.date === dateStr);
      const isToday = dateStr === todayStr;

      week.push({
        dayName: dayNames[i],
        dayNumber: d.getDate(),
        dateStr,
        isCompleted: Boolean(checkin?.completed),
        isToday,
      });
    }

    return week;
  };

  const weekDays = getWeekDates();

  // Motivational quote pool
  const motivationalQuotes = [
    "Consistency is the only bridge between goals and reality.",
    "Show up, put in the reps, let the streak speak.",
    "Your future self will thank you for today's sweat.",
    "Discipline weighs ounces, regret weighs tons.",
    "The workout you didn't feel like doing is the one that counts the most.",
  ];
  const quote = motivationalQuotes[currentStreak % motivationalQuotes.length];

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      {/* 1. STREAK HERO CARD */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#141820] to-[#0e1218] border border-[#202735] p-5 shadow-xl">
        {/* Ambient neon backdrop glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Animated fire flame avatar */}
            <div className="relative w-16 h-16 rounded-2xl bg-[#1b212c] border border-orange-500/30 flex items-center justify-center shadow-inner group">
              <Flame className="w-10 h-10 text-orange-400 fill-orange-400 drop-shadow-[0_0_12px_rgba(251,146,60,0.6)] animate-pulse" />
              <div className="absolute -bottom-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-orange-500 text-black">
                ON FIRE
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>Current Streak</span>
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 inline-block" />
                <span className="text-lime-400 font-bold">Goal: {profile.targetDaysPerWeek}d/wk</span>
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-baseline gap-2">
                <span className="font-data text-white">{currentStreak}</span>
                <span className="text-lg font-bold text-slate-400">Days</span>
              </div>
            </div>
          </div>

          {/* Secondary stats strip */}
          <div className="grid grid-cols-2 gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1c222e]">
            <div className="bg-[#12161f] border border-[#1f2633] rounded-xl px-3.5 py-2">
              <span className="text-[11px] font-medium text-slate-400 block">Longest Run</span>
              <span className="text-base font-bold font-data text-white">{longestStreak} Days</span>
            </div>
            <div className="bg-[#12161f] border border-[#1f2633] rounded-xl px-3.5 py-2">
              <span className="text-[11px] font-medium text-slate-400 block">30d Consistency</span>
              <span className="text-base font-bold font-data text-lime-400">{consistencyRate}%</span>
            </div>
          </div>
        </div>

        {/* Motivational quote kicker */}
        <p className="mt-3.5 text-xs text-slate-400 italic border-t border-[#1c222e] pt-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-lime-400 shrink-0" />
          <span>&ldquo;{quote}&rdquo;</span>
        </p>
      </div>

      {/* 2. THE BIG "I WORKED OUT TODAY" SATISFYING BUTTON */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleCheckinClick}
          aria-pressed={isDoneToday}
          className={`w-full relative group overflow-hidden rounded-2xl p-6 transition-all duration-200 select-none touch-manipulation cursor-pointer border ${
            isDoneToday
              ? 'bg-gradient-to-r from-emerald-950/80 via-lime-950/70 to-emerald-950/80 border-lime-500/40 shadow-[0_0_30px_rgba(34,197,94,0.18)]'
              : 'bg-gradient-to-r from-lime-500 via-emerald-400 to-lime-400 text-black border-lime-300 shadow-[0_10px_35px_rgba(163,230,53,0.35)] hover:shadow-[0_12px_45px_rgba(163,230,53,0.5)] active:scale-[0.98]'
          } ${isPressing ? 'scale-[0.97]' : ''}`}
        >
          {/* Subtle neon animated highlight shimmer */}
          {!isDoneToday && (
            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-left">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-200 ${
                  isDoneToday
                    ? 'bg-lime-500/20 text-lime-400 border border-lime-500/40'
                    : 'bg-black text-lime-400 shadow-md group-hover:rotate-6'
                }`}
              >
                {isDoneToday ? (
                  <CheckCircle2 className="w-8 h-8 text-lime-400 fill-lime-400/20" />
                ) : (
                  <Dumbbell className="w-7 h-7" />
                )}
              </div>

              <div>
                <span
                  className={`text-xs font-bold uppercase tracking-wider block ${
                    isDoneToday ? 'text-lime-400' : 'text-emerald-950/80'
                  }`}
                >
                  {isDoneToday ? 'Daily Goal Achieved' : 'Daily Check-in'}
                </span>
                <span
                  className={`text-xl sm:text-2xl font-black tracking-tight leading-tight block ${
                    isDoneToday ? 'text-white' : 'text-black'
                  }`}
                >
                  {isDoneToday ? 'I Worked Out Today! 🔥' : 'I Worked Out Today'}
                </span>
                <span
                  className={`text-xs font-medium block mt-0.5 ${
                    isDoneToday ? 'text-slate-400' : 'text-black/80'
                  }`}
                >
                  {isDoneToday
                    ? 'Tap to undo or view session details'
                    : 'Tap to mark today completed & advance streak'}
                </span>
              </div>
            </div>

            {/* Checkmark indicator badge */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                isDoneToday
                  ? 'bg-lime-500/10 border-lime-500/30 text-lime-400'
                  : 'bg-black/10 border-black/20 text-black'
              }`}
            >
              {isDoneToday ? <RotateCcw className="w-4 h-4" /> : <Zap className="w-5 h-5 fill-current" />}
            </div>
          </div>
        </button>

        {isDoneToday && (
          <div className="flex items-center justify-between w-full mt-2.5 px-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-lime-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Checked in for today ({todayStr})
            </span>
            <button
              onClick={onNavigateToLogger}
              className="text-xs font-semibold text-slate-300 hover:text-lime-400 flex items-center gap-1 transition-colors"
            >
              Log exercises <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* 3. WEEKLY CALENDAR VIEW (Active vs Missed days) */}
      <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-lime-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Weekly Consistency</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Tap a day to toggle status
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map((day) => {
            return (
              <button
                key={day.dateStr}
                onClick={() => {
                  soundManager.playClick();
                  onToggleDateCheckin(day.dateStr);
                }}
                className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all border relative ${
                  day.isCompleted
                    ? 'bg-lime-950/40 border-lime-500/50 text-white shadow-[0_0_12px_rgba(163,230,53,0.15)]'
                    : 'bg-[#161b24] border-[#222a38] text-slate-400 hover:border-slate-600'
                } ${day.isToday ? 'ring-2 ring-lime-400 ring-offset-2 ring-offset-[#12161f]' : ''}`}
              >
                {day.isToday && (
                  <span className="absolute -top-1 text-[8px] font-bold uppercase tracking-wider text-black bg-lime-400 px-1 rounded-sm">
                    Today
                  </span>
                )}
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  {day.dayName}
                </span>
                <span className="text-sm font-bold font-data text-white my-1">
                  {day.dayNumber}
                </span>
                <div className="h-4 flex items-center justify-center">
                  {day.isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400 fill-lime-400/20" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 mt-3 pt-3 border-t border-[#1b212c] text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-lime-400 shadow-[0_0_6px_#a3e635]" />
            <span>Worked Out</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span>Rest / Missed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm border-2 border-lime-400" />
            <span>Current Day</span>
          </div>
        </div>
      </div>

      {/* 4. WORKOUT REMINDER & GYM SCHEDULE CARD */}
      <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Scheduled Gym Time
              </span>
              <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/20 px-1.5 py-0.2 rounded font-medium">
                {profile.reminderMinutesBefore}m Reminder
              </span>
            </div>
            <div className="text-sm font-semibold text-white mt-0.5">
              Target Time: <span className="text-cyan-300 font-data font-bold">{profile.preferredGymTime}</span>
              <span className="text-slate-400 text-xs font-normal ml-2">
                (Motivational push reminder active)
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onTriggerTestReminder}
          className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#191f2b] hover:bg-[#222a38] text-xs font-semibold text-cyan-300 border border-cyan-500/30 transition-colors shrink-0"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Test Reminder Alert</span>
        </button>
      </div>

      {/* 5. TODAY'S WORKOUT SUMMARY OR LOG CTA */}
      <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-lime-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Today&apos;s Workout Log</h3>
          </div>
          <button
            onClick={onNavigateToLogger}
            className="text-xs font-semibold text-lime-400 hover:underline flex items-center gap-1"
          >
            {todaysWorkout ? 'Edit Workout' : 'Start Logger'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {todaysWorkout ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-[#161b24] p-3 rounded-xl border border-[#222a38]">
              <div>
                <span className="text-sm font-bold text-white block">{todaysWorkout.title}</span>
                <span className="text-xs text-slate-400">
                  {todaysWorkout.exercises.length} Exercises · {todaysWorkout.durationMinutes} mins
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Volume</span>
                <span className="text-sm font-bold font-data text-lime-400">
                  {todaysWorkout.totalVolumeKg.toLocaleString()} kg
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {todaysWorkout.exercises.slice(0, 3).map((ex) => (
                <div key={ex.id} className="bg-[#151a23] p-2.5 rounded-lg border border-[#202735]">
                  <span className="text-[11px] font-semibold text-slate-300 block truncate">
                    {ex.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {ex.sets.filter((s) => s.completed).length} sets completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#151923] rounded-xl border border-[#202735]">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              No workout details logged for today yet. Record your sets, reps, and weights to calculate volume and trigger badge milestones!
            </p>
            <button
              onClick={onNavigateToLogger}
              className="px-4 py-2 rounded-xl bg-lime-400 hover:bg-lime-300 text-black text-xs font-bold transition-all shadow-md shrink-0"
            >
              Log Workout Now
            </button>
          </div>
        )}
      </div>

      {/* 6. UPCOMING BADGE MILESTONE SNIPPET */}
      <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-950/50 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0">
            {nextBadge.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">{nextBadge.title}</span>
              <span className="text-[10px] text-amber-400 font-semibold uppercase">
                {nextBadge.isUnlocked ? 'Unlocked' : 'In Progress'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{nextBadge.description}</p>
            {/* Progress bar */}
            {!nextBadge.isUnlocked && (
              <div className="w-36 sm:w-48 h-1.5 bg-[#1b222f] rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-lime-400 rounded-full transition-all duration-300"
                  style={{ width: `${nextBadge.progress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onNavigateToBadges}
          className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-[#181f2b] border border-[#222a38] transition-colors shrink-0"
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>View All Badges</span>
        </button>
      </div>
    </div>
  );
};
