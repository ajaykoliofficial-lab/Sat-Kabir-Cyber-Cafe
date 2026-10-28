import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { SuperNavbar, SuperTab } from './components/SuperNavbar';
import { SuperBottomNav } from './components/SuperBottomNav';
import { TickerBar } from './components/TickerBar';
import { HeroSection } from './components/HeroSection';
import { ServicesGrid } from './components/ServicesGrid';
import { SarkariResultSection } from './components/SarkariResultSection';
import { JobDetailModal } from './components/JobDetailModal';
import { TypingTestTool } from './components/TypingTestTool';
import { BillingTool } from './components/BillingTool';
import { CommunitySection } from './components/CommunitySection';
import { QuickLinksSection } from './components/QuickLinksSection';
import { ServiceRequestForm } from './components/ServiceRequestForm';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { GymTrackerView } from './components/GymTrackerView';
import { UnifiedProfile } from './components/UnifiedProfile';
import { SuperDevSpecsModal } from './components/SuperDevSpecsModal';
import { RestTimerModal } from './components/RestTimerModal';
import { ApkTopBanner } from './components/ApkTopBanner';
import { ApkDownloadModal } from './components/ApkDownloadModal';
import { ApkShowcaseSection } from './components/ApkShowcaseSection';
import { CSCServiceItem, SarkariJobItem, TickerAlert } from './types/csc';
import { SARKARI_RESULTS_DATA, CSC_SERVICES } from './data/cscData';
import {
  UserProfile,
  DailyCheckIn,
  WorkoutSession,
  Badge,
  WeightRecord,
} from './types';
import {
  loadProfile,
  saveProfile,
  loadCheckins,
  saveCheckins,
  loadWorkouts,
  saveWorkouts,
  loadBadges,
  saveBadges,
  loadWeights,
  saveWeights,
  calculateStreak,
  updateBadgesEvaluation,
  getTodayDateString,
  getInitialCheckins,
  getInitialWorkouts,
  getInitialWeights,
  INITIAL_PROFILE,
  INITIAL_BADGES,
} from './utils/storage';
import { soundManager, triggerHaptic } from './utils/audio';

export default function App() {
  // App Navigation & Language State
  const [activeTab, setActiveTab] = useState<SuperTab>('csc_home');
  const [currentLang, setCurrentLang] = useState<'hi' | 'en'>('hi');
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [showDevSpecs, setShowDevSpecs] = useState(false);
  const [showApkModal, setShowApkModal] = useState(false);
  const [showApkFeatures, setShowApkFeatures] = useState<boolean>(() => {
    return localStorage.getItem('satkabir_show_apk_features') !== 'false';
  });

  const handleToggleApkFeatures = (enabled: boolean) => {
    setShowApkFeatures(enabled);
    localStorage.setItem('satkabir_show_apk_features', enabled ? 'true' : 'false');
  };

  // CSC & Jobs State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<SarkariJobItem | null>(null);
  const [preselectedService, setPreselectedService] = useState<CSCServiceItem | null>(null);

  // Gym Tracker State
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const [checkins, setCheckins] = useState<DailyCheckIn[]>(loadCheckins);
  const [workouts, setWorkouts] = useState<WorkoutSession[]>(loadWorkouts);
  const [badges, setBadges] = useState<Badge[]>(loadBadges);
  const [weights, setWeights] = useState<WeightRecord[]>(loadWeights);
  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null);

  // Notification Toast state
  const [notificationToast, setNotificationToast] = useState<{
    title: string;
    message: string;
  } | null>(null);

  // Unlocked Badge Toast
  const [unlockedToast, setUnlockedToast] = useState<Badge | null>(null);

  // Sync sound settings
  useEffect(() => {
    soundManager.setEnabled(profile.soundEnabled);
  }, [profile.soundEnabled]);

  // Current consecutive streaks
  const { currentStreak, longestStreak } = calculateStreak(checkins);

  // Badge unlock evaluator
  const evaluateBadges = (updatedStreak: number, updatedWorkouts: WorkoutSession[]) => {
    const { updatedBadges, newlyUnlocked } = updateBadgesEvaluation(
      updatedStreak,
      updatedWorkouts,
      badges
    );

    if (newlyUnlocked.length > 0) {
      setBadges(updatedBadges);
      saveBadges(updatedBadges);

      const newBadge = newlyUnlocked[0];
      setUnlockedToast(newBadge);
      soundManager.playBadgeUnlock();
      triggerHaptic('success');

      try {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#fbbf24', '#a3e635', '#ffffff'],
        });
      } catch {
        // Fallback
      }

      setTimeout(() => setUnlockedToast(null), 5000);
    } else {
      setBadges(updatedBadges);
      saveBadges(updatedBadges);
    }
  };

  // Toggle Today's Checkin
  const handleToggleTodayCheckin = () => {
    const todayStr = getTodayDateString();
    let isCompletedNow = false;

    const updatedCheckins = checkins.map((c) => {
      if (c.date === todayStr) {
        isCompletedNow = !c.completed;
        return {
          ...c,
          completed: isCompletedNow,
          completedAt: isCompletedNow ? new Date().toISOString() : undefined,
        };
      }
      return c;
    });

    if (!checkins.some((c) => c.date === todayStr)) {
      isCompletedNow = true;
      updatedCheckins.push({
        date: todayStr,
        completed: true,
        completedAt: new Date().toISOString(),
      });
    }

    setCheckins(updatedCheckins);
    saveCheckins(updatedCheckins);

    const streakInfo = calculateStreak(updatedCheckins);
    evaluateBadges(streakInfo.currentStreak, workouts);
  };

  // Toggle Date Checkin
  const handleToggleDateCheckin = (dateStr: string) => {
    const existing = checkins.find((c) => c.date === dateStr);
    let updatedCheckins: DailyCheckIn[];

    if (existing) {
      updatedCheckins = checkins.map((c) =>
        c.date === dateStr ? { ...c, completed: !c.completed } : c
      );
    } else {
      updatedCheckins = [...checkins, { date: dateStr, completed: true }];
    }

    setCheckins(updatedCheckins);
    saveCheckins(updatedCheckins);

    const streakInfo = calculateStreak(updatedCheckins);
    evaluateBadges(streakInfo.currentStreak, workouts);
  };

  // Save Workout from Logger
  const handleSaveWorkout = (newSession: WorkoutSession) => {
    const updatedWorkouts = [newSession, ...workouts];
    setWorkouts(updatedWorkouts);
    saveWorkouts(updatedWorkouts);

    // Also mark today as checked-in
    const todayStr = getTodayDateString();
    let updatedCheckins = [...checkins];
    const todayEntry = updatedCheckins.find((c) => c.date === todayStr);

    if (todayEntry) {
      if (!todayEntry.completed) {
        updatedCheckins = updatedCheckins.map((c) =>
          c.date === todayStr
            ? { ...c, completed: true, workoutTitle: newSession.title, durationMinutes: newSession.durationMinutes }
            : c
        );
      }
    } else {
      updatedCheckins.push({
        date: todayStr,
        completed: true,
        workoutTitle: newSession.title,
        durationMinutes: newSession.durationMinutes,
      });
    }

    setCheckins(updatedCheckins);
    saveCheckins(updatedCheckins);

    const streakInfo = calculateStreak(updatedCheckins);
    evaluateBadges(streakInfo.currentStreak, updatedWorkouts);
  };

  // Add Weight Record
  const handleAddWeight = (record: WeightRecord) => {
    const updated = [...weights, record];
    setWeights(updated);
    saveWeights(updated);

    const updatedProfile = { ...profile, currentWeight: record.weightKg };
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
  };

  // Save Profile
  const handleSaveProfile = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    saveProfile(updatedProfile);
  };

  // Reset Demo Data
  const handleResetData = () => {
    localStorage.clear();
    const initialCheckins = getInitialCheckins();
    const initialWorkouts = getInitialWorkouts();
    const initialWeights = getInitialWeights();

    setProfile(INITIAL_PROFILE);
    setCheckins(initialCheckins);
    setWorkouts(initialWorkouts);
    setBadges(INITIAL_BADGES);
    setWeights(initialWeights);

    saveProfile(INITIAL_PROFILE);
    saveCheckins(initialCheckins);
    saveWorkouts(initialWorkouts);
    saveBadges(INITIAL_BADGES);
    saveWeights(initialWeights);

    soundManager.playClick();
  };

  // Trigger Push Reminder Test
  const handleTriggerTestReminder = () => {
    soundManager.playTimerAlert();
    triggerHaptic('medium');

    const reminderTime = profile.preferredGymTime;
    const msg = `Time to lock in! Your workout is scheduled for ${reminderTime}. Keep your ${currentStreak}-day streak alive! 🔥`;

    setNotificationToast({
      title: 'SatKabir Plus — Gym Reminder (30m Prior)',
      message: msg,
    });

    setTimeout(() => {
      setNotificationToast(null);
    }, 5000);
  };

  // When clicking an alert on ticker
  const handleSelectTickerAlert = (alert: TickerAlert) => {
    const foundJob = SARKARI_RESULTS_DATA.find(
      (j) =>
        j.postName.toLowerCase().includes(alert.title.toLowerCase().slice(0, 8)) ||
        alert.title.toLowerCase().includes(j.postName.toLowerCase().slice(0, 8))
    );

    if (foundJob) {
      setSelectedJob(foundJob);
      return;
    }

    setActiveTab('csc_home');
    const el = document.getElementById('services');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Service Apply trigger
  const handleSelectServiceToApply = (service: CSCServiceItem) => {
    setPreselectedService(service);
    setActiveTab('csc_home');
    const formEl = document.getElementById('service-request');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isDarkCanvas = activeTab === 'gym_tracker';

  return (
    <div
      className={`min-h-screen transition-colors duration-200 flex flex-col font-sans antialiased selection:bg-orange-500 selection:text-white ${
        isDarkCanvas ? 'bg-[#090b0e] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* TOP STICKY PROMINENT APK DOWNLOAD BANNER (Can be dismissed permanently) */}
      {showApkFeatures && (
        <ApkTopBanner
          currentLang={currentLang}
          onOpenDownloadModal={() => setShowApkModal(true)}
          onDismissPermanently={() => handleToggleApkFeatures(false)}
        />
      )}

      {/* 1. SUPER NAVBAR */}
      <SuperNavbar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          soundManager.playClick();
          setActiveTab(tab);
        }}
        currentLang={currentLang}
        onToggleLang={() => setCurrentLang(currentLang === 'hi' ? 'en' : 'hi')}
        currentStreak={currentStreak}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
        onOpenDevSpecs={() => setShowDevSpecs(true)}
        onOpenDownloadModal={showApkFeatures ? () => setShowApkModal(true) : undefined}
        soundEnabled={profile.soundEnabled}
        onToggleSound={() => {
          const next = !profile.soundEnabled;
          setProfile({ ...profile, soundEnabled: next });
          soundManager.setEnabled(next);
          saveProfile({ ...profile, soundEnabled: next });
        }}
      />

      {/* 2. BREAKING UPDATES TICKER (Always visible for quick alerts) */}
      <TickerBar
        currentLang={currentLang}
        onSelectAlert={handleSelectTickerAlert}
      />

      {/* NOTIFICATION TOAST POPUP */}
      {notificationToast && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 bg-slate-900 text-white border-2 border-cyan-400 rounded-2xl p-4 shadow-2xl max-w-sm animate-in slide-in-from-top-4">
          <h4 className="text-xs font-bold text-cyan-300">{notificationToast.title}</h4>
          <p className="text-xs text-slate-200 mt-1">{notificationToast.message}</p>
        </div>
      )}

      {/* NEW BADGE CELEBRATION TOAST */}
      {unlockedToast && (
        <div className="fixed top-16 right-4 sm:right-6 z-50 bg-[#161c28] border-2 border-amber-400 rounded-2xl p-4 shadow-2xl max-w-sm animate-in slide-in-from-top-4 text-white">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
            Milestone Badge Unlocked!
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">
            {unlockedToast.icon} {unlockedToast.title}
          </h4>
          <p className="text-xs text-slate-400 mt-1">{unlockedToast.description}</p>
        </div>
      )}

      {/* MAIN VIEW CONTAINER: Full Width or Mobile Phone Frame Preview */}
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        <div
          className={`w-full transition-all duration-300 ${
            isMobileFrame
              ? 'max-w-[430px] bg-white dark:bg-[#0c0e14] border-4 border-slate-700 rounded-[44px] shadow-2xl overflow-hidden my-4 min-h-[820px] pb-16'
              : 'w-full pb-20'
          }`}
        >
          {/* TAB 1: CSC HOME */}
          {activeTab === 'csc_home' && (
            <div className="animate-in fade-in duration-200">
              <HeroSection
                currentLang={currentLang}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onNavigateSection={handleNavigateSection}
                onSelectCategory={setSelectedCategory}
                onOpenDownloadModal={showApkFeatures ? () => setShowApkModal(true) : undefined}
              />

              {/* Dedicated Android APK Download Showcase */}
              {showApkFeatures && (
                <ApkShowcaseSection
                  currentLang={currentLang}
                  onOpenModal={() => setShowApkModal(true)}
                />
              )}

              <ServicesGrid
                currentLang={currentLang}
                searchQuery={searchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onSelectServiceToApply={handleSelectServiceToApply}
              />

              <TypingTestTool currentLang={currentLang} />

              <BillingTool currentLang={currentLang} />

              <CommunitySection currentLang={currentLang} />

              <QuickLinksSection currentLang={currentLang} />

              <ServiceRequestForm
                currentLang={currentLang}
                preselectedService={preselectedService}
              />

              <Footer
                currentLang={currentLang}
                onNavigate={handleNavigateSection}
              />
            </div>
          )}

          {/* TAB 2: SARKARI JOBS & RESULTS */}
          {activeTab === 'sarkari_jobs' && (
            <div className="animate-in fade-in duration-200 bg-slate-50 min-h-[85vh]">
              <SarkariResultSection
                currentLang={currentLang}
                onSelectJob={(job) => setSelectedJob(job)}
              />

              <div className="py-6 px-4 max-w-4xl mx-auto">
                <ServiceRequestForm
                  currentLang={currentLang}
                  preselectedService={preselectedService}
                />
              </div>

              <Footer
                currentLang={currentLang}
                onNavigate={handleNavigateSection}
              />
            </div>
          )}

          {/* TAB 3: GYM TRACKER (Dedicated Dark Athletic Module) */}
          {activeTab === 'gym_tracker' && (
            <div className="animate-in fade-in duration-200">
              <GymTrackerView
                profile={profile}
                checkins={checkins}
                workouts={workouts}
                badges={badges}
                weights={weights}
                currentStreak={currentStreak}
                longestStreak={longestStreak}
                currentLang={currentLang}
                onToggleTodayCheckin={handleToggleTodayCheckin}
                onToggleDateCheckin={handleToggleDateCheckin}
                onSaveWorkout={handleSaveWorkout}
                onAddWeightRecord={handleAddWeight}
                onOpenRestTimer={(sec) => setRestTimerSeconds(sec)}
                onTriggerTestReminder={handleTriggerTestReminder}
              />
            </div>
          )}

          {/* TAB 4: UNIFIED PROFILE */}
          {activeTab === 'profile' && (
            <div className="animate-in fade-in duration-200 bg-slate-50 min-h-[85vh]">
              <UnifiedProfile
                profile={profile}
                currentLang={currentLang}
                currentStreak={currentStreak}
                onSaveProfile={handleSaveProfile}
                onResetData={handleResetData}
                onTriggerTestReminder={handleTriggerTestReminder}
                onOpenDownloadModal={() => setShowApkModal(true)}
                showApkFeatures={showApkFeatures}
                onToggleApkFeatures={handleToggleApkFeatures}
              />

              <Footer
                currentLang={currentLang}
                onNavigate={handleNavigateSection}
              />
            </div>
          )}
        </div>
      </main>

      {/* FLOATING REST TIMER WIDGET (When active during gym workouts) */}
      {restTimerSeconds !== null && (
        <RestTimerModal
          initialSeconds={restTimerSeconds}
          onClose={() => setRestTimerSeconds(null)}
        />
      )}

      {/* FLOATING WHATSAPP CHAT BUTTON (Active in CSC/Jobs tabs) */}
      {activeTab !== 'gym_tracker' && (
        <FloatingWhatsApp currentLang={currentLang} />
      )}

      {/* SARKARI JOB DETAIL MODAL */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          currentLang={currentLang}
        />
      )}

      {/* SUPER APP BOTTOM NAVIGATION BAR */}
      <SuperBottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          soundManager.playClick();
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentLang={currentLang}
        currentStreak={currentStreak}
      />

      {/* SUPER APP DEVELOPER SPECS MODAL */}
      {showDevSpecs && (
        <SuperDevSpecsModal onClose={() => setShowDevSpecs(false)} />
      )}

      {/* ANDROID APK DOWNLOAD & INSTALLATION MODAL */}
      {showApkModal && (
        <ApkDownloadModal
          onClose={() => setShowApkModal(false)}
          currentLang={currentLang}
          onDisableApkFeatures={() => handleToggleApkFeatures(false)}
        />
      )}
    </div>
  );
}
