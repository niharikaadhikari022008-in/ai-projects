import React from 'react';

interface HeaderStatusBarProps {
  showDynamicIsland?: boolean;
  time?: string;
  isDarkMode?: boolean;
}

export const HeaderStatusBar: React.FC<HeaderStatusBarProps> = ({
  showDynamicIsland = false,
  time = '9:41',
}) => {
  return (
    <div className="h-11 px-6 flex items-center justify-between text-xs font-semibold select-none relative z-50 text-[#0F172A] dark:text-[#EEF0FF]">
      <span className="tracking-tight text-[15px] font-bold w-12 text-left">{time}</span>

      {showDynamicIsland ? (
        <div className="h-6 w-28 bg-black/90 dark:bg-black/95 rounded-full flex items-center justify-center px-2 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
        </div>
      ) : (
        <div className="flex-1"></div>
      )}

      <div className="flex items-center justify-end gap-1.5 w-12 text-[#0F172A] dark:text-[#EEF0FF]">
        <span className="material-symbols-outlined text-[17px]">signal_cellular_4_bar</span>
        <span className="material-symbols-outlined text-[17px]">wifi</span>
        <div className="w-5 h-2.5 rounded-[4px] border border-current p-0.5 flex items-center">
          <div className="h-full w-3 bg-current rounded-[1px]"></div>
        </div>
      </div>
    </div>
  );
};
