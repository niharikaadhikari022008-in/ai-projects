import React from 'react';
import { TabType } from '../types';

interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  tasksBadgeCount?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  tasksBadgeCount,
}) => {
  const tabs: { id: TabType; label: string; icon: string; filledIcon?: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'tasks', label: 'Tasks', icon: 'checklist' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_month' },
    { id: 'events', label: 'Events', icon: 'celebration' },
    { id: 'profile', label: 'Profile', icon: 'account_circle' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe bg-white/95 dark:bg-[#131B2E]/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 shadow-[0_-4px_20px_rgba(15,23,42,0.05)]">
      <div className="max-w-[430px] mx-auto h-16 px-4 flex items-center justify-between">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center justify-center min-w-[58px] min-h-[44px] gap-0.5 transition-all relative ${
                isActive
                  ? 'text-[#10B981] font-bold'
                  : 'text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-slate-200 font-medium'
              }`}
              type="button"
            >
              <div className="relative">
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {tab.icon}
                </span>
                {tab.id === 'tasks' && tasksBadgeCount && tasksBadgeCount > 0 ? (
                  <span className="absolute -top-1 -right-2 min-w-4 h-4 px-1 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center">
                    {tasksBadgeCount}
                  </span>
                ) : null}
              </div>

              <span className="text-[11px] tracking-tight">{tab.label}</span>

              {/* Active Indicator Dot matching Stitch Designs */}
              <span
                className={`w-1.5 h-1.5 rounded-full mt-0.5 transition-all ${
                  isActive ? 'bg-[#10B981] scale-100 opacity-100' : 'scale-0 opacity-0'
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};
