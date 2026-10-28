import React from 'react';
import { Building2, FileText, Dumbbell, User, Flame } from 'lucide-react';
import { SuperTab } from './SuperNavbar';

interface SuperBottomNavProps {
  activeTab: SuperTab;
  onSelectTab: (tab: SuperTab) => void;
  currentLang: 'hi' | 'en';
  currentStreak: number;
}

export const SuperBottomNav: React.FC<SuperBottomNavProps> = ({
  activeTab,
  onSelectTab,
  currentLang,
  currentStreak,
}) => {
  const isGymActive = activeTab === 'gym_tracker';

  const tabs: {
    id: SuperTab;
    labelEn: string;
    labelHi: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    badge?: string;
  }[] = [
    {
      id: 'csc_home',
      labelEn: 'CSC Home',
      labelHi: 'सीएससी होम',
      icon: Building2,
      accentColor: 'text-blue-600',
    },
    {
      id: 'sarkari_jobs',
      labelEn: 'Sarkari Jobs',
      labelHi: 'सरकारी नौकरी',
      icon: FileText,
      accentColor: 'text-red-600',
      badge: 'LIVE',
    },
    {
      id: 'gym_tracker',
      labelEn: 'Gym Tracker',
      labelHi: 'जिम ट्रैकर',
      icon: Dumbbell,
      accentColor: 'text-lime-400',
      badge: `${currentStreak}🔥`,
    },
    {
      id: 'profile',
      labelEn: 'Profile',
      labelHi: 'प्रोफाइल',
      icon: User,
      accentColor: 'text-amber-500',
    },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 border-t pb-safe transition-colors duration-200 ${
        isGymActive
          ? 'bg-[#0b0e14]/95 border-[#1e2536] text-white backdrop-blur-lg'
          : 'bg-white/95 border-slate-200 text-slate-800 backdrop-blur-lg shadow-lg'
      }`}
    >
      <div className="max-w-md mx-auto grid grid-cols-4 items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center h-full min-h-[44px] relative select-none touch-manipulation group"
            >
              {/* Active top line */}
              {isActive && (
                <span
                  className={`absolute top-0 w-8 h-1 rounded-full ${
                    tab.id === 'gym_tracker'
                      ? 'bg-lime-400 shadow-[0_0_8px_#a3e635]'
                      : tab.id === 'sarkari_jobs'
                      ? 'bg-red-600'
                      : tab.id === 'csc_home'
                      ? 'bg-blue-600'
                      : 'bg-slate-900'
                  }`}
                />
              )}

              {/* Icon Container with Badge */}
              <div className="relative">
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive
                      ? tab.id === 'gym_tracker'
                        ? 'text-lime-400 scale-110'
                        : tab.id === 'sarkari_jobs'
                        ? 'text-red-600 scale-110'
                        : 'text-blue-700 scale-110'
                      : isGymActive
                      ? 'text-slate-400 group-hover:text-slate-200'
                      : 'text-slate-500 group-hover:text-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5 transition-transform duration-150" />
                </div>

                {tab.badge && (
                  <span
                    className={`absolute -top-1 -right-3 text-[8px] font-black px-1 rounded-full ${
                      tab.id === 'gym_tracker'
                        ? 'bg-orange-500 text-black'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Caption */}
              <span
                className={`text-[10px] font-bold tracking-tight mt-0.5 font-hindi transition-colors ${
                  isActive
                    ? tab.id === 'gym_tracker'
                      ? 'text-lime-400'
                      : tab.id === 'sarkari_jobs'
                      ? 'text-red-600'
                      : 'text-blue-800 font-black'
                    : isGymActive
                    ? 'text-slate-400'
                    : 'text-slate-500'
                }`}
              >
                {currentLang === 'hi' ? tab.labelHi : tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
