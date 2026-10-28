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
  RotateCcw,
  CheckCircle2,
  Building2,
  Dumbbell,
  ShieldCheck,
  Flame,
  Smartphone,
} from 'lucide-react';
import { FitnessGoal, UserProfile } from '../types';
import { soundManager, triggerHaptic } from '../utils/audio';

interface UnifiedProfileProps {
  profile: UserProfile;
  currentLang: 'hi' | 'en';
  currentStreak: number;
  onSaveProfile: (profile: UserProfile) => void;
  onResetData: () => void;
  onTriggerTestReminder: () => void;
  onOpenDownloadModal?: () => void;
  showApkFeatures?: boolean;
  onToggleApkFeatures?: (enabled: boolean) => void;
}

export const UnifiedProfile: React.FC<UnifiedProfileProps> = ({
  profile,
  currentLang,
  currentStreak,
  onSaveProfile,
  onResetData,
  onTriggerTestReminder,
  onOpenDownloadModal,
  showApkFeatures = true,
  onToggleApkFeatures,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const goalOptions: { id: FitnessGoal; labelEn: string; labelHi: string; desc: string }[] = [
    {
      id: 'muscle_gain',
      labelEn: 'Muscle Gain & Hypertrophy',
      labelHi: 'मांसपेशियों का विकास (मसल गेन)',
      desc: 'Build lean muscle mass and strength',
    },
    {
      id: 'weight_loss',
      labelEn: 'Fat Loss & Shred',
      labelHi: 'वजन / चर्बी घटाना (फैट लॉस)',
      desc: 'Burn calories and maintain daily streak',
    },
    {
      id: 'strength',
      labelEn: 'Pure Strength & Power',
      labelHi: 'ताकत और भारी वजन (स्ट्रेंथ)',
      desc: 'Increase 1-rep max on compound lifts',
    },
    {
      id: 'general_fitness',
      labelEn: 'Daily Health & Vitality',
      labelHi: 'दैनिक फिटनेस व ऊर्जा (जनरल)',
      desc: 'Consistent exercise for lifelong wellness',
    },
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
      app: 'SatKabir Plus Super App',
      profile: formData,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `satkabir-plus-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-8 px-4 sm:px-6 max-w-3xl mx-auto space-y-6 pb-24">
      {/* Profile Card Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-900 via-indigo-900 to-slate-900 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {formData.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">{formData.name}</h2>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full border border-blue-200">
                Super App Citizen
              </span>
            </div>
            <p className="text-xs text-slate-500 font-data mt-0.5">{formData.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-orange-50 border border-orange-200 text-orange-700 px-3 py-1.5 rounded-xl text-center">
            <span className="text-[10px] font-bold uppercase block">Streak</span>
            <span className="text-base font-black font-data flex items-center justify-center gap-0.5">
              <Flame className="w-3.5 h-3.5 fill-current text-orange-500" />
              {currentStreak}d
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. PERSONAL & CSC IDENTITY */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building2 className="w-4 h-4 text-blue-700" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-hindi">
              {currentLang === 'hi' ? 'नागरिक व खाता विवरण' : 'Citizen & CSC Details'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {currentLang === 'hi' ? 'पूरा नाम' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {currentLang === 'hi' ? 'ईमेल आईडी' : 'Email Address'}
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>
        </div>

        {/* 2. FITNESS GOALS & GYM HABITS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-lime-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-hindi">
                {currentLang === 'hi' ? 'जिम व फिटनेस लक्ष्य (Gym Habits)' : 'Fitness Habit Goals'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onTriggerTestReminder}
              className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-1"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{currentLang === 'hi' ? 'टेस्ट जिम अलर्ट' : 'Test Reminder Alert'}</span>
            </button>
          </div>

          {/* Goal Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              {currentLang === 'hi' ? 'मुख्य फिटनेस लक्ष्य चुनें' : 'Select Primary Fitness Goal'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {goalOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setFormData({ ...formData, goal: opt.id });
                  }}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    formData.goal === opt.id
                      ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-bold block">
                    {currentLang === 'hi' ? opt.labelHi : opt.labelEn}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Weights & Timings */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {currentLang === 'hi' ? 'वर्तमान वजन (kg)' : 'Current Weight (kg)'}
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.currentWeight}
                onChange={(e) => setFormData({ ...formData, currentWeight: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-data text-slate-900 focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {currentLang === 'hi' ? 'लक्ष्य वजन (kg)' : 'Target Weight (kg)'}
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.targetWeight}
                onChange={(e) => setFormData({ ...formData, targetWeight: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-data text-slate-900 focus:outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                {currentLang === 'hi' ? 'जिम जाने का समय' : 'Gym Schedule'}
              </label>
              <input
                type="time"
                required
                value={formData.preferredGymTime}
                onChange={(e) => setFormData({ ...formData, preferredGymTime: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold font-data text-slate-900 focus:outline-none focus:border-blue-700"
              />
            </div>
          </div>

          {/* Days Per Week */}
          <div className="pt-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {currentLang === 'hi' ? 'साप्ताहिक वर्कआउट लक्ष्य (दिन)' : 'Workout Days Per Week'}
            </label>
            <div className="flex gap-2">
              {[3, 4, 5, 6, 7].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setFormData({ ...formData, targetDaysPerWeek: days });
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold font-data transition-all cursor-pointer ${
                    formData.targetDaysPerWeek === days
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {days}d/wk
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. NOTIFICATION & AUDIO SETTINGS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block font-hindi">
                {currentLang === 'hi' ? '30 मिनट पहले पुश रिमाइंडर' : '30-Min Workout Reminder Alert'}
              </span>
              <span className="text-[10px] text-slate-500">
                {currentLang === 'hi'
                  ? 'आपके निर्धारित जिम समय से 30 मिनट पूर्व प्रेरणादायक अलर्ट'
                  : 'Receive motivational alert 30m before your scheduled gym time'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.notificationsEnabled}
              onChange={(e) => setFormData({ ...formData, notificationsEnabled: e.target.checked })}
              className="w-5 h-5 accent-blue-900 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <span className="text-xs font-bold text-slate-900 block font-hindi">
                {currentLang === 'hi' ? 'ऑडियो सिंथेसाइज़र ध्वनि' : 'Audio Sound Cues (Web Audio)'}
              </span>
              <span className="text-[10px] text-slate-500">
                {currentLang === 'hi'
                  ? 'चेक-इन व टाइमर समाप्त होने पर सुखद चाइम'
                  : 'Play celebratory audio chimes upon habit check-in'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={formData.soundEnabled}
              onChange={(e) => {
                const val = e.target.checked;
                setFormData({ ...formData, soundEnabled: val });
                soundManager.setEnabled(val);
              }}
              className="w-5 h-5 accent-blue-900 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* 4. ANDROID APP (.APK) / MOBILE PWA SETTINGS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black uppercase text-slate-900 tracking-wider block">
                  {currentLang === 'hi' ? 'मोबाइल ऐप व APK विकल्प' : 'Mobile App & APK Features'}
                </span>
                <span className="text-[11px] text-slate-500 font-hindi">
                  {currentLang === 'hi'
                    ? 'होम स्क्रीन 1-क्लिक ऐप या APK डाउनलोड सुविधा'
                    : 'PWA Home Screen & APK package options'}
                </span>
              </div>
            </div>

            {onToggleApkFeatures && (
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <span className="text-[11px] text-slate-500">
                  {showApkFeatures ? (currentLang === 'hi' ? 'दिखाएं' : 'Visible') : (currentLang === 'hi' ? 'छिपाएं' : 'Hidden')}
                </span>
                <input
                  type="checkbox"
                  checked={showApkFeatures}
                  onChange={(e) => onToggleApkFeatures(e.target.checked)}
                  className="w-5 h-5 accent-emerald-600 rounded cursor-pointer"
                />
              </label>
            )}
          </div>

          {showApkFeatures ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-950">
                    {currentLang === 'hi' ? 'SatKabir Plus मोबाइल ऐप' : 'SatKabir Plus Mobile App'}
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-data">
                    v2.4.2
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 font-hindi">
                  {currentLang === 'hi'
                    ? 'सीधे 1-क्लिक में फोन स्क्रीन पर जोड़ें (PWA) या APK फाइल डाउनलोड करें।'
                    : 'Install directly to home screen (PWA) or download the offline APK package.'}
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onOpenDownloadModal}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>{currentLang === 'hi' ? 'इंस्टॉल / APK' : 'Install / APK'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-xs text-slate-500 flex items-center justify-between font-hindi">
              <span>
                {currentLang === 'hi'
                  ? 'APK डाउनलोड बैनर व विकल्प वर्तमान में छिपे हुए हैं।'
                  : 'APK download banner and options are currently hidden.'}
              </span>
              {onToggleApkFeatures && (
                <button
                  type="button"
                  onClick={() => onToggleApkFeatures(true)}
                  className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  {currentLang === 'hi' ? 'वापस चालू करें' : 'Turn On'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="flex-1 py-3.5 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{currentLang === 'hi' ? 'सेटिंग्स सुरक्षित करें' : 'Save Super App Settings'}</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{currentLang === 'hi' ? 'सभी परिवर्तन सुरक्षित कर लिए गए हैं!' : 'Settings successfully saved!'}</span>
          </div>
        )}

        {/* Data export / reset strip */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{currentLang === 'hi' ? 'डेटा बैकअप (JSON)' : 'Export Backup'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (window.confirm('Reset all demo data back to default?')) {
                onResetData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{currentLang === 'hi' ? 'डेटा रीसेट करें' : 'Reset All Demo Data'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
