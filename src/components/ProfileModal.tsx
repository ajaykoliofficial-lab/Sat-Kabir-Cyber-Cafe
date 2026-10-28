import React, { useState } from 'react';
import {
  User,
  Target,
  Clock,
  Bell,
  Scale,
  Save,
  Volume2,
  VolumeX,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { FitnessGoal, UserProfile } from '../types';
import { soundManager, triggerHaptic } from '../utils/audio';

interface ProfileModalProps {
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onResetData: () => void;
  onTriggerTestReminder: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  profile,
  onSaveProfile,
  onResetData,
  onTriggerTestReminder,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const goalOptions: { id: FitnessGoal; label: string; desc: string }[] = [
    { id: 'muscle_gain', label: 'Muscle Gain & Hypertrophy', desc: 'Build lean muscle mass and progressive overload' },
    { id: 'weight_loss', label: 'Fat Loss & Shred', desc: 'Burn calories, stay consistent, and lean down' },
    { id: 'strength', label: 'Strength & Power', desc: 'Boost 1-rep maximums on compound lifts' },
    { id: 'endurance', label: 'Endurance & Stamina', desc: 'Improve cardiovascular capacity and high rep work' },
    { id: 'general_fitness', label: 'General Health & Energy', desc: 'Daily functional vitality and healthy habit streak' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playCheckin();
    triggerHaptic('success');
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportData = () => {
    soundManager.playClick();
    const dataToExport = {
      profile: formData,
      exportDate: new Date().toISOString(),
      app: 'FitStreak',
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitstreak-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 pb-8 animate-in fade-in duration-200">
      <div className="bg-[#12161f] border border-[#1f2633] rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#1c222e]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-lime-500 to-emerald-400 flex items-center justify-center text-black font-extrabold text-xl shadow-lg">
              {formData.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{formData.name}</h2>
              <span className="text-xs text-slate-400">{formData.email}</span>
            </div>
          </div>

          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-lime-400 bg-lime-950/80 border border-lime-500/40 px-2.5 py-1 rounded-lg animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* 1. Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#161b24] border border-[#242c3b] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#161b24] border border-[#242c3b] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
              />
            </div>
          </div>

          {/* 2. Fitness Goal Selector */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-lime-400" />
              <span>Primary Fitness Goal</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {goalOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setFormData({ ...formData, goal: opt.id });
                  }}
                  className={`p-3 rounded-xl text-left border transition-all ${
                    formData.goal === opt.id
                      ? 'bg-lime-950/40 border-lime-500/60 shadow-sm'
                      : 'bg-[#161b24] border-[#222a38] text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span
                    className={`text-xs font-bold block ${
                      formData.goal === opt.id ? 'text-lime-400' : 'text-white'
                    }`}
                  >
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Weight Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                <span>Current Weight (kg)</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.currentWeight}
                onChange={(e) => setFormData({ ...formData, currentWeight: Number(e.target.value) })}
                className="w-full bg-[#161b24] border border-[#242c3b] rounded-xl px-3 py-2 text-sm text-white font-data focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>Target Goal Weight (kg)</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.targetWeight}
                onChange={(e) => setFormData({ ...formData, targetWeight: Number(e.target.value) })}
                className="w-full bg-[#161b24] border border-[#242c3b] rounded-xl px-3 py-2 text-sm text-white font-data focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* 4. Schedule & Push Notification Settings */}
          <div className="p-4 rounded-xl bg-[#151923] border border-[#222a38] space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-lime-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Gym Timing &amp; Reminders
                </h4>
              </div>
              <button
                type="button"
                onClick={onTriggerTestReminder}
                className="text-[11px] font-semibold text-lime-400 hover:underline flex items-center gap-1"
              >
                <Bell className="w-3 h-3" /> Test Push Alert
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Preferred Gym Time
                </label>
                <input
                  type="time"
                  required
                  value={formData.preferredGymTime}
                  onChange={(e) => setFormData({ ...formData, preferredGymTime: e.target.value })}
                  className="w-full bg-[#161b24] border border-[#242c3b] rounded-xl px-3 py-2 text-sm text-white font-data focus:outline-none focus:border-lime-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Days Per Week Goal
                </label>
                <select
                  value={formData.targetDaysPerWeek}
                  onChange={(e) => setFormData({ ...formData, targetDaysPerWeek: Number(e.target.value) })}
                  className="w-full bg-[#161b24] border border-[#242c3b] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-lime-400"
                >
                  <option value={3}>3 Days (Casual Consistency)</option>
                  <option value={4}>4 Days (Balanced Split)</option>
                  <option value={5}>5 Days (Optimal Hypertrophy)</option>
                  <option value={6}>6 Days (Advanced PPL)</option>
                  <option value={7}>7 Days (Every Single Day)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1d2330]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-400" />
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Push Notifications (30m Before)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Get pre-workout motivational alerts before your gym time
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={formData.notificationsEnabled}
                onChange={(e) =>
                  setFormData({ ...formData, notificationsEnabled: e.target.checked })
                }
                className="w-5 h-5 accent-lime-400 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1d2330]">
              <div className="flex items-center gap-2">
                {formData.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-lime-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-400" />
                )}
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Synthesizer Sound Effects
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Play celebratory chimes on check-in and timer finish
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={formData.soundEnabled}
                onChange={(e) => {
                  const val = e.target.checked;
                  setFormData({ ...formData, soundEnabled: val });
                  soundManager.setEnabled(val);
                }}
                className="w-5 h-5 accent-lime-400 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-lime-400 hover:bg-lime-300 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile &amp; Preferences</span>
            </button>
          </div>
        </form>

        {/* Data Management Section */}
        <div className="mt-8 pt-5 border-t border-[#1c222e]">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
            Data Backup &amp; Reset
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#161b24] hover:bg-[#1e2532] text-xs font-semibold text-slate-200 border border-[#242c3b] transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON Backup</span>
            </button>
            <button
              onClick={() => {
                if (window.confirm('Reset all demo data back to default?')) {
                  onResetData();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-950/60 text-xs font-semibold text-red-400 border border-red-500/30 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
