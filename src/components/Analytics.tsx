import React, { useState } from 'react';
import {
  TrendingUp,
  Scale,
  Calendar,
  Plus,
  Dumbbell,
  CheckCircle2,
  PieChart,
} from 'lucide-react';
import { DailyCheckIn, UserProfile, WeightRecord, WorkoutSession } from '../types';
import { formatDate, getTodayDateString } from '../utils/storage';
import { soundManager, triggerHaptic } from '../utils/audio';

interface AnalyticsProps {
  profile: UserProfile;
  checkins: DailyCheckIn[];
  workouts: WorkoutSession[];
  weights: WeightRecord[];
  onAddWeightRecord: (record: WeightRecord) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({
  profile,
  checkins,
  workouts,
  weights,
  onAddWeightRecord,
}) => {
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [newWeight, setNewWeight] = useState(profile.currentWeight || 72.8);
  const [weightDate, setWeightDate] = useState(getTodayDateString());
  const [weightNote, setWeightNote] = useState('');

  // 1. Calculate consistency over last 30 days
  const last30DaysCheckins = checkins.slice(-30);
  const activeDaysCount = last30DaysCheckins.filter((c) => c.completed).length;
  const adherenceRate = Math.round((activeDaysCount / (last30DaysCheckins.length || 30)) * 100);

  // 2. Weight delta
  const sortedWeights = [...weights].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestWeight = sortedWeights.length > 0 ? sortedWeights[sortedWeights.length - 1].weightKg : profile.currentWeight;
  const initialWeight = sortedWeights.length > 0 ? sortedWeights[0].weightKg : profile.currentWeight;
  const weightDiff = +(latestWeight - initialWeight).toFixed(1);
  const targetDiff = +(profile.targetWeight - latestWeight).toFixed(1);

  // 3. Muscle distribution calculation
  const muscleCounts: Record<string, number> = {
    Chest: 0,
    Back: 0,
    Legs: 0,
    Shoulders: 0,
    Arms: 0,
    Core: 0,
  };
  let totalSetsCount = 0;

  workouts.forEach((w) => {
    w.exercises?.forEach((ex) => {
      const group = ex.muscleGroup || 'Chest';
      const sets = ex.sets?.filter((s) => s.completed).length || ex.sets?.length || 0;
      if (muscleCounts[group] !== undefined) {
        muscleCounts[group] += sets;
        totalSetsCount += sets;
      }
    });
  });

  // Handle adding weight record
  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    triggerHaptic('medium');

    const entry: WeightRecord = {
      id: `w_${Date.now()}`,
      date: weightDate,
      weightKg: Number(newWeight),
      note: weightNote.trim() || undefined,
    };
    onAddWeightRecord(entry);
    setShowAddWeight(false);
    setWeightNote('');
  };

  // Generate simple SVG path points for weight graph
  const getWeightGraphPoints = () => {
    if (sortedWeights.length < 2) return null;
    const minW = Math.min(...sortedWeights.map((w) => w.weightKg)) - 1;
    const maxW = Math.max(...sortedWeights.map((w) => w.weightKg)) + 1;
    const range = maxW - minW || 1;

    const width = 320;
    const height = 120;
    const padding = 20;

    const points = sortedWeights.map((item, idx) => {
      const x = padding + (idx / (sortedWeights.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((item.weightKg - minW) / range) * (height - 2 * padding);
      return { x, y, weight: item.weightKg, date: item.date };
    });

    const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
    return { points, pathD, width, height };
  };

  const graphData = getWeightGraphPoints();

  // Total volume calculation
  const totalVolumeAllTime = workouts.reduce((acc, w) => acc + (w.totalVolumeKg || 0), 0);
  const avgVolumePerWorkout = workouts.length > 0 ? Math.round(totalVolumeAllTime / workouts.length) : 0;

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      {/* 1. TOP OVERVIEW METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Consistency
          </span>
          <span className="text-2xl font-extrabold font-data text-lime-400 block mt-1">
            {adherenceRate}%
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {activeDaysCount} / {last30DaysCheckins.length} Days
          </span>
        </div>

        <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Current Weight
          </span>
          <span className="text-2xl font-extrabold font-data text-white block mt-1">
            {latestWeight} <span className="text-xs font-normal text-slate-400">kg</span>
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            {weightDiff >= 0 ? `+${weightDiff}` : weightDiff} kg since start
          </span>
        </div>

        <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Total Volume
          </span>
          <span className="text-2xl font-extrabold font-data text-cyan-400 block mt-1">
            {(totalVolumeAllTime / 1000).toFixed(1)} <span className="text-xs font-normal text-slate-400">tons</span>
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            ~{avgVolumePerWorkout.toLocaleString()} kg / session
          </span>
        </div>

        <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Workouts Logged
          </span>
          <span className="text-2xl font-extrabold font-data text-white block mt-1">
            {workouts.length}
          </span>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Completed sessions
          </span>
        </div>
      </div>

      {/* 2. 30-DAY WORKOUT CONSISTENCY HEAT-GRID */}
      <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-lime-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">30-Day Activity Matrix</h3>
          </div>
          <span className="text-xs text-lime-400 font-data font-bold">
            {activeDaysCount} Days Active
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 sm:gap-2">
          {last30DaysCheckins.map((checkin) => {
            const dayNum = new Date(checkin.date + 'T00:00:00').getDate();
            return (
              <div
                key={checkin.date}
                title={`${checkin.date}: ${checkin.completed ? 'Workout Done' : 'Rest'}`}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                  checkin.completed
                    ? 'bg-lime-950/50 border-lime-500/40 text-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.15)]'
                    : 'bg-[#161b24] border-[#222a38] text-slate-500'
                }`}
              >
                <span className="text-[10px] font-semibold font-data">{dayNum}</span>
                <div className="mt-1">
                  {checkin.completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-lime-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600 block my-1" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. BODY WEIGHT PROGRESSION & TREND CHART */}
      <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Body Weight Progression</h3>
          </div>
          <button
            onClick={() => setShowAddWeight(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Weight</span>
          </button>
        </div>

        {/* Target summary strip */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#161b24] border border-[#222a38] mb-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Start</span>
            <span className="font-data font-bold text-white">{initialWeight} kg</span>
          </div>
          <div className="text-center">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Current</span>
            <span className="font-data font-bold text-lime-400">{latestWeight} kg</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Target</span>
            <span className="font-data font-bold text-cyan-400">{profile.targetWeight} kg</span>
          </div>
        </div>

        {/* SVG Curve Chart */}
        {graphData && (
          <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[320px] relative bg-[#151923] p-4 rounded-xl border border-[#202735]">
              <svg viewBox={`0 0 ${graphData.width} ${graphData.height}`} className="w-full h-32 overflow-visible">
                {/* Horizontal guide lines */}
                <line x1="15" y1="20" x2="305" y2="20" stroke="#232a38" strokeDasharray="3 3" />
                <line x1="15" y1="60" x2="305" y2="60" stroke="#232a38" strokeDasharray="3 3" />
                <line x1="15" y1="100" x2="305" y2="100" stroke="#232a38" strokeDasharray="3 3" />

                {/* Main line */}
                <path
                  d={graphData.pathD}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data points */}
                {graphData.points.map((p, idx) => (
                  <g key={idx}>
                    <circle cx={p.x} cy={p.y} r="4" fill="#0b0d10" stroke="#38bdf8" strokeWidth="2" />
                    <text
                      x={p.x}
                      y={p.y - 8}
                      fontSize="9"
                      fill="#94a3b8"
                      textAnchor="middle"
                      className="font-data font-bold"
                    >
                      {p.weight}
                    </text>
                  </g>
                ))}
              </svg>

              <div className="flex justify-between text-[10px] text-slate-500 font-data mt-2 px-2">
                <span>{sortedWeights[0]?.date}</span>
                <span>{sortedWeights[sortedWeights.length - 1]?.date}</span>
              </div>
            </div>
          </div>
        )}

        {/* Recent Weight Log Rows */}
        <div className="mt-4 space-y-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Recent Weigh-ins
          </span>
          {sortedWeights.slice(-4).reverse().map((rec) => (
            <div
              key={rec.id}
              className="flex items-center justify-between p-2 rounded-lg bg-[#161b24] text-xs"
            >
              <div className="flex items-center gap-2">
                <span className="font-data text-slate-400">{rec.date}</span>
                {rec.note && <span className="text-slate-500 italic">· {rec.note}</span>}
              </div>
              <span className="font-data font-bold text-white">{rec.weightKg} kg</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. MUSCLE GROUP TRAINING DISTRIBUTION */}
      <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-lime-400" />
            <h3 className="text-sm font-bold text-white tracking-tight">Muscle Group Focus</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {totalSetsCount} Total Sets Completed
          </span>
        </div>

        <div className="space-y-2.5">
          {Object.entries(muscleCounts).map(([muscle, count]) => {
            const percentage = totalSetsCount > 0 ? Math.round((count / totalSetsCount) * 100) : 0;
            return (
              <div key={muscle} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">{muscle}</span>
                  <span className="font-data text-slate-400">
                    {count} sets ({percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-[#181f2b] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-lime-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ADD WEIGHT MODAL */}
      {showAddWeight && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#12161f] border border-[#242c3b] rounded-2xl p-5 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Scale className="w-4 h-4 text-cyan-400" />
              <span>Log Body Weight</span>
            </h3>

            <form onSubmit={handleSaveWeight} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={newWeight}
                  onChange={(e) => setNewWeight(Number(e.target.value))}
                  className="w-full bg-[#161b24] border border-[#242c3b] rounded-xl px-3 py-2 text-white font-bold font-data text-lg focus:outline-none focus:border-cyan-400 text-center"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={weightDate}
                  onChange={(e) => setWeightDate(e.target.value)}
                  className="w-full bg-[#161b24] border border-[#242c3b] rounded-xl px-3 py-2 text-white text-xs font-data focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Note (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Morning fasted weigh-in"
                  value={weightNote}
                  onChange={(e) => setWeightNote(e.target.value)}
                  className="w-full bg-[#161b24] border border-[#242c3b] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddWeight(false)}
                  className="flex-1 py-2 rounded-xl bg-[#181f2b] text-slate-300 text-xs font-semibold hover:bg-[#20293a]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-cyan-400 text-black text-xs font-bold hover:bg-cyan-300"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
