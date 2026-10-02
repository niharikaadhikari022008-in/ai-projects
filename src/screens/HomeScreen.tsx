import React from 'react';
import { Task, UserProfile } from '../types';

interface HomeScreenProps {
  userProfile: UserProfile;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onNavigateTab: (tab: 'home' | 'tasks' | 'calendar' | 'events' | 'profile') => void;
  onOpenNotifications: () => void;
  onOpenQuickAdd: () => void;
  unreadNotificationsCount?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  tasks,
  onToggleTask,
  onNavigateTab,
  onOpenNotifications,
  onOpenQuickAdd,
  unreadNotificationsCount = 0,
}) => {
  // Urgent deadlines list (urgent non-completed items)
  const urgentTasks = tasks.filter(
    (t) => !t.completed && (t.priority === 'High' || t.categorySection === 'today' || t.categorySection === 'overdue')
  );

  // Dynamic progress calculation
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const percentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 67;

  // SVG circle math: circumference = 2 * PI * 36 = 226.19
  const circumference = 226.19;
  const strokeOffset = circumference - (percentage / 100) * circumference;

  return (
    <main className="flex-1 w-full max-w-[430px] mx-auto pt-[68px] pb-28 px-4 flex flex-col space-y-6">
      {/* 1. Header Bar */}
      <section className="flex items-center justify-between pt-2">
        <div className="flex flex-col">
          <h1 className="text-[22px] font-bold leading-tight text-[#0F172A] dark:text-white tracking-tight flex items-center gap-1.5">
            Good morning, {userProfile.name.split(' ')[0]} <span className="text-xl">👋</span>
          </h1>
          <p className="text-[14px] font-medium text-[#64748B] dark:text-slate-400 mt-0.5">Thursday, Oct 1</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Bell Icon with Red Dot Badge */}
          <button
            type="button"
            aria-label="Notifications"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center justify-center text-[#334155] dark:text-slate-200 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[21px]">notifications</span>
            {/* Red notification badge dot / count */}
            {unreadNotificationsCount > 0 ? (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#EF4444] text-white text-[10px] font-extrabold flex items-center justify-center ring-2 ring-white dark:ring-slate-800 shadow-xs">
                {unreadNotificationsCount}
              </span>
            ) : (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#EF4444] ring-2 ring-white dark:ring-slate-800"></span>
            )}
          </button>

          {/* 36px Circular User Avatar with Soft Border */}
          <button
            type="button"
            onClick={() => onNavigateTab('profile')}
            className="relative w-9 h-9 rounded-full ring-2 ring-[#10B981]/25 p-0.5 shadow-sm overflow-hidden bg-white dark:bg-slate-800"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          </button>
        </div>
      </section>

      {/* 2. Daily Progress Summary Card */}
      <section className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#E6F4EA] via-white to-white dark:from-[#064E3B]/20 dark:via-[#131B2E] dark:to-[#131B2E] border border-[#D1FAE5] dark:border-emerald-900/50 p-5 shadow-[0_4px_16px_-4px_rgba(16,185,129,0.12)]">
        {/* Decorative background blur orb */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-[#10B981]/10 blur-2xl pointer-events-none"></div>

        <div className="relative flex items-center justify-between gap-4 z-10">
          <div className="flex flex-col">
            {/* Motivational streak chip */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/90 dark:bg-slate-800 border border-[#A7F3D0] dark:border-emerald-800 shadow-xs self-start mb-2">
              <span
                className="material-symbols-outlined text-[#10B981] text-[15px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                bolt
              </span>
              <span className="text-[11px] font-bold text-[#065F46] dark:text-emerald-400 tracking-wide uppercase">
                {userProfile.streakDays}-day streak!
              </span>
            </div>

            <h2 className="text-[18px] font-bold text-[#0F172A] dark:text-white tracking-tight">Today's Focus</h2>
            <p className="text-[14px] text-[#475569] dark:text-slate-300 font-medium mt-0.5">
              {completedTasksCount} of {totalTasks} tasks completed
            </p>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-[#059669] dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              <span>{urgentTasks.length} urgent deadlines left</span>
            </div>
          </div>

          {/* Clean Circular Progress Ring Displaying Percentage */}
          <div className="relative w-[92px] h-[92px] shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 88 88" aria-hidden="true">
              {/* Background track ring */}
              <circle
                cx="44"
                cy="44"
                r="36"
                className="text-[#E2E8F0] dark:text-slate-700"
                strokeWidth="7.5"
                stroke="currentColor"
                fill="none"
              />
              {/* Mint green progress stroke */}
              <circle
                cx="44"
                cy="44"
                r="36"
                className="text-[#10B981] transition-all duration-700 ease-out"
                strokeWidth="7.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[20px] font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-none">
                {percentage}%
              </span>
              <span className="text-[10px] font-semibold text-[#64748B] dark:text-slate-400 uppercase tracking-wider mt-0.5">
                Done
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section: Urgent Deadlines (Horizontal Scroll Cards) */}
      <section className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></span>
            <h2 className="text-[17px] font-bold text-[#0F172A] dark:text-white tracking-tight">Urgent Deadlines</h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('tasks')}
            className="text-xs font-bold text-[#10B981] hover:text-[#059669] active:opacity-75 flex items-center gap-0.5"
          >
            <span>See all</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>

        {/* Horizontal Scrollable Container */}
        <div className="flex gap-3.5 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory no-scrollbar">
          {/* Card 1: CS101 Midterm Quiz */}
          <article className="snap-start shrink-0 w-[245px] bg-white dark:bg-[#131B2E] rounded-[18px] p-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.06)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEE2E2] dark:bg-rose-950/60 text-[#DC2626] dark:text-rose-400 text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[13px]">alarm</span>
                  <span>Due in 2h</span>
                </span>
                <span className="text-[11px] font-semibold text-[#94A3B8]">High</span>
              </div>

              <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-white mt-3 leading-snug">
                CS101 Midterm Quiz
              </h3>
              <p className="text-[12px] text-[#64748B] dark:text-slate-400 mt-0.5">Chapters 1–4 Multiple Choice</p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 dark:border-slate-800">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F1F5F9] dark:bg-slate-800 text-[#334155] dark:text-slate-300 text-[11px] font-semibold">
                Computer Science
              </span>
              <button
                type="button"
                aria-label="Mark complete"
                onClick={() => onToggleTask('task-4')}
                className="w-7 h-7 rounded-full border-2 border-[#CBD5E1] dark:border-slate-600 hover:border-[#10B981] hover:bg-[#ECFDF5] flex items-center justify-center text-transparent hover:text-[#10B981] transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
              </button>
            </div>
          </article>

          {/* Card 2: Calculus Problem Set 4 */}
          <article className="snap-start shrink-0 w-[245px] bg-white dark:bg-[#131B2E] rounded-[18px] p-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.06)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FEF3C7] dark:bg-amber-950/60 text-[#D97706] dark:text-amber-400 text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[13px]">schedule</span>
                  <span>Due Today, 11:59 PM</span>
                </span>
                <span className="text-[11px] font-semibold text-[#94A3B8]">Med</span>
              </div>

              <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-white mt-3 leading-snug">
                Calculus Problem Set 4
              </h3>
              <p className="text-[12px] text-[#64748B] dark:text-slate-400 mt-0.5">Integration by Parts &amp; Trig</p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 dark:border-slate-800">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#FEF3C7]/60 dark:bg-amber-950/40 text-[#B45309] dark:text-amber-300 text-[11px] font-semibold">
                MATH 201
              </span>
              <button
                type="button"
                aria-label="Mark complete"
                onClick={() => onToggleTask('task-5')}
                className="w-7 h-7 rounded-full border-2 border-[#CBD5E1] dark:border-slate-600 hover:border-[#10B981] hover:bg-[#ECFDF5] flex items-center justify-center text-transparent hover:text-[#10B981] transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
              </button>
            </div>
          </article>

          {/* Card 3: Literature Review Draft */}
          <article className="snap-start shrink-0 w-[245px] bg-white dark:bg-[#131B2E] rounded-[18px] p-4 border border-slate-100 dark:border-slate-800 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.06)] flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-start justify-between">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EEF2FF] dark:bg-indigo-950/60 text-[#4F46E5] dark:text-indigo-400 text-[11px] font-bold">
                  <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                  <span>Due Tomorrow, 5 PM</span>
                </span>
                <span className="text-[11px] font-semibold text-[#94A3B8]">Normal</span>
              </div>

              <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-white mt-3 leading-snug">
                Literature Review Draft
              </h3>
              <p className="text-[12px] text-[#64748B] dark:text-slate-400 mt-0.5">Modern Narrative Analysis</p>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 dark:border-slate-800">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#EEF2FF] dark:bg-indigo-950/40 text-[#4338CA] dark:text-indigo-300 text-[11px] font-semibold">
                ENG 102
              </span>
              <button
                type="button"
                aria-label="Mark complete"
                onClick={() => onToggleTask('task-7')}
                className="w-7 h-7 rounded-full border-2 border-[#CBD5E1] dark:border-slate-600 hover:border-[#10B981] hover:bg-[#ECFDF5] flex items-center justify-center text-transparent hover:text-[#10B981] transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">check</span>
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* 4. Section: Today's Schedule (Vertical Timeline) */}
      <section className="flex flex-col space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-bold text-[#0F172A] dark:text-white tracking-tight">Today's Schedule</h2>
          <button
            onClick={() => onNavigateTab('calendar')}
            className="text-xs font-semibold text-[#64748B] dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 px-2.5 py-0.5 rounded-full transition-colors"
          >
            3 events
          </button>
        </div>

        {/* Vertical Timeline Component */}
        <div className="relative pl-6 space-y-4 before:absolute before:left-[11px] before:top-2.5 before:bottom-3 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-700">
          {/* Timeline Item 1: 10:00 AM – 11:30 AM */}
          <div className="relative">
            <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-[#10B981] ring-4 ring-[#D1FAE5] dark:ring-emerald-950 z-10 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            </span>

            <div 
              onClick={() => onNavigateTab('calendar')}
              className="bg-white dark:bg-[#131B2E] rounded-[18px] p-4 border border-emerald-200/80 dark:border-emerald-800/80 shadow-[0_2px_12px_-2px_rgba(16,185,129,0.12)] cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#10B981] uppercase tracking-wide">10:00 AM – 11:30 AM</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#ECFDF5] dark:bg-emerald-950 text-[#059669] dark:text-emerald-400 text-[10px] font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
                    Active
                  </span>
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#EFF6FF] dark:bg-blue-950/60 text-[#1D4ED8] dark:text-blue-400 text-[11px] font-semibold">
                  Blue Tag
                </span>
              </div>

              <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mt-1.5">
                Algorithms &amp; Data Structures
              </h3>

              <div className="flex items-center gap-3 mt-2.5 text-xs text-[#64748B] dark:text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[15px] text-[#94A3B8]">meeting_room</span>
                  Room 304
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[15px] text-[#94A3B8]">person</span>
                  Prof. Chen
                </span>
              </div>
            </div>
          </div>

          {/* Active Time Line Indicator */}
          <div className="relative -my-1 py-1">
            <div className="flex items-center gap-2 -ml-6">
              <div className="w-3.5 h-3.5 rounded-full bg-[#EF4444] border-2 border-white dark:border-slate-800 shadow-xs shrink-0 z-20"></div>
              <div className="h-[1.5px] bg-[#EF4444] flex-1"></div>
              <span className="text-[10px] font-extrabold text-[#EF4444] bg-[#FEE2E2] dark:bg-rose-950/80 px-1.5 py-0.5 rounded-full tracking-wider uppercase shrink-0">
                NOW • 10:45 AM
              </span>
            </div>
          </div>

          {/* Timeline Item 2: 01:00 PM – 02:30 PM */}
          <div className="relative">
            <span className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-900 z-10"></span>

            <div 
              onClick={() => onNavigateTab('calendar')}
              className="bg-white dark:bg-[#131B2E] rounded-[18px] p-4 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-slate-200 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#64748B] dark:text-slate-400">01:00 PM – 02:30 PM</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#FAF5FF] dark:bg-purple-950/60 text-[#7E22CE] dark:text-purple-400 text-[11px] font-semibold">
                  Purple Tag
                </span>
              </div>

              <h3 className="text-[16px] font-bold text-[#0F172A] dark:text-white mt-1.5">
                UI/UX Design Workshop
              </h3>

              <div className="flex items-center gap-3 mt-2.5 text-xs text-[#64748B] dark:text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[15px] text-[#94A3B8]">desktop_mac</span>
                  Studio B
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[15px] text-[#94A3B8]">group</span>
                  Group Work
                </span>
              </div>
            </div>
          </div>

          {/* Timeline Item 3: 03:30 PM – 04:45 PM */}
          <div className="relative">
            <span className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-slate-300 dark:bg-slate-600 ring-4 ring-white dark:ring-slate-900 z-10"></span>

            <div 
              onClick={() => onNavigateTab('calendar')}
              className="bg-white dark:bg-[#131B2E] rounded-[18px] p-4 border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#64748B] dark:text-slate-400">03:30 PM – 04:45 PM</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#F0FDF4] dark:bg-emerald-950/60 text-[#15803D] dark:text-emerald-400 text-[11px] font-semibold">
                  Study Group
                </span>
              </div>

              <h3 className="text-[15px] font-bold text-[#0F172A] dark:text-white mt-1.5">
                Linear Algebra Review
              </h3>

              <div className="flex items-center gap-3 mt-2.5 text-xs text-[#64748B] dark:text-slate-400">
                <span className="flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-[15px] text-[#94A3B8]">local_library</span>
                  Library 2nd Floor
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
