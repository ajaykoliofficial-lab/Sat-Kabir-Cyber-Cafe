import React from 'react';
import { Flame, Volume2, VolumeX, Smartphone, Monitor, Code2, Bell } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  currentStreak: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
  onOpenDevSchema: () => void;
  onOpenProfile: () => void;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onTriggerTestReminder: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStreak,
  soundEnabled,
  onToggleSound,
  isMobileFrame,
  onToggleMobileFrame,
  onOpenDevSchema,
  onOpenProfile,
  activeTab,
  onSelectTab,
  onTriggerTestReminder,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#1f242d] bg-[#0c0e12]/90 backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-lime-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-lime-500/20 text-black font-extrabold tracking-tight">
            <Flame className="w-5 h-5 text-black fill-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5 leading-none">
              FitStreak
              <span className="text-[10px] uppercase font-bold tracking-wider text-lime-400 bg-lime-950/80 border border-lime-500/30 px-1.5 py-0.5 rounded">
                PRO
              </span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Consistency Engine</span>
          </div>
        </div>

        {/* Zone 2: Navigation links on desktop */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`transition-colors hover:text-white ${activeTab === 'dashboard' ? 'text-lime-400' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onSelectTab('logger')}
            className={`transition-colors hover:text-white ${activeTab === 'logger' ? 'text-lime-400' : ''}`}
          >
            Workout Logger
          </button>
          <button
            onClick={() => onSelectTab('analytics')}
            className={`transition-colors hover:text-white ${activeTab === 'analytics' ? 'text-lime-400' : ''}`}
          >
            Analytics
          </button>
          <button
            onClick={() => onSelectTab('badges')}
            className={`transition-colors hover:text-white ${activeTab === 'badges' ? 'text-lime-400' : ''}`}
          >
            Milestones
          </button>
        </nav>

        {/* Zone 3: Primary action & utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active streak badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-950/50 border border-orange-500/30 text-orange-400 text-xs font-bold font-data">
            <Flame className="w-3.5 h-3.5 fill-orange-400 animate-pulse" />
            <span>{currentStreak}d Streak</span>
          </div>

          {/* Test Reminder Trigger */}
          <button
            onClick={onTriggerTestReminder}
            title="Simulate 30-min Gym Reminder"
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#151921] hover:bg-[#1c222c] border border-[#232936] transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-lime-400" />
            <span className="hidden lg:inline">Test Alert</span>
          </button>

          {/* Viewport Frame Toggle (Mobile Frame vs Full Width) */}
          <button
            onClick={onToggleMobileFrame}
            title={isMobileFrame ? "Switch to Wide Responsive View" : "Preview in Mobile Frame"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#151921] hover:bg-[#1c222c] border border-[#232936] transition-colors"
          >
            {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
          </button>

          {/* Audio toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? "Mute audio cues" : "Enable sound cues"}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-[#151921] hover:bg-[#1c222c] border border-[#232936] transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-lime-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Dev Project Structure & Database Schema button */}
          <button
            onClick={onOpenDevSchema}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#151921] hover:bg-[#1e2532] text-xs font-semibold text-lime-400 border border-lime-500/30 transition-all shadow-sm"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Schema &amp; Architecture</span>
            <span className="sm:hidden">Docs</span>
          </button>
        </div>
      </div>
    </header>
  );
};
