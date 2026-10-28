import React from 'react';
import { Home, Dumbbell, BarChart3, Award, User } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  unlockedBadgesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Today', icon: Home },
    { id: 'logger', label: 'Workout', icon: Dumbbell },
    { id: 'analytics', label: 'Stats', icon: BarChart3 },
    { id: 'badges', label: 'Badges', icon: Award },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0e1117]/95 backdrop-blur-lg border-t border-[#1e2430] pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center h-full min-h-[44px] relative group select-none touch-manipulation transition-all"
            >
              {/* Active glow top bar */}
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635]" />
              )}
              
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-lime-400 scale-110'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 transition-transform duration-150" />
              </div>
              <span
                className={`text-[10px] font-semibold tracking-tight transition-colors ${
                  isActive ? 'text-lime-400 font-bold' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
