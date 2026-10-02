import React from 'react';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  userProfile: UserProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenEnrolledCourses: () => void;
  onOpenAdvisorChat: () => void;
  onOpenSettings: () => void;
  onOpenNotifications?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userProfile,
  isDarkMode,
  onToggleDarkMode,
  onOpenEnrolledCourses,
  onOpenAdvisorChat,
  onOpenSettings,
  onOpenNotifications,
}) => {
  return (
    <main className="flex-1 w-full max-w-[430px] mx-auto pt-16 pb-24 px-4 flex flex-col space-y-6">
      <div className="flex flex-col w-full gap-5">
        {/* Profile Header Block */}
        <section className="flex flex-col items-center text-center pt-2">
          {/* Student Avatar with Status Indicator */}
          <div className="relative mb-2">
            <div className="w-[72px] h-[72px] rounded-full overflow-hidden shadow-sm bg-white dark:bg-slate-800 ring-2 ring-emerald-500/20">
              <img
                alt={userProfile.name}
                className="w-full h-full object-cover"
                src={userProfile.avatarUrl}
                referrerPolicy="no-referrer"
              />
            </div>
            <span
              className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-[#10B981] rounded-full shadow-[0_0_0_2px_#ffffff] dark:shadow-[0_0_0_2px_#131B2E]"
              title="Active Student"
            ></span>
          </div>

          {/* Student Name & Academic Meta */}
          <h1 className="text-[22px] font-bold text-[#131b2e] dark:text-white tracking-tight">
            {userProfile.name}
          </h1>
          <p className="text-sm text-[#3c4a42] dark:text-slate-400 mt-0.5">
            {userProfile.major} • {userProfile.classYear}
          </p>

          {/* Badges Row */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#eaedff] dark:bg-slate-800 text-xs font-semibold text-[#131b2e] dark:text-white">
              {userProfile.academicStanding}
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ffddb8] text-[#2a1700] text-xs font-semibold">
              <span
                className="material-symbols-outlined text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                workspace_premium
              </span>
              {userProfile.honors}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#f2f3ff] dark:bg-slate-800 text-[#6c7a71] dark:text-slate-400 text-[11px] font-semibold">
              ID: {userProfile.studentId}
            </span>
          </div>
        </section>

        {/* Gamification & Streak Banner */}
        <section className="bg-gradient-to-br from-[#ffddb8] to-[#f2f3ff] dark:from-amber-950/60 dark:to-slate-800/80 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-[24px] text-[#e29100]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-[#523200] dark:text-amber-200">
                  {userProfile.streakDays}-Day Study Streak! 🔥
                </h2>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-[#855300] dark:text-amber-300 font-semibold shadow-xs">
                  Lv. {userProfile.streakLevel}
                </span>
              </div>
              <p className="text-xs text-[#523200]/90 dark:text-amber-300/90 mt-1">
                You've completed tasks {userProfile.streakDays} days in a row. Keep the momentum going through finals!
              </p>

              {/* Mini Weekly Streak Dots */}
              <div className="grid grid-cols-7 gap-1.5 mt-3 pt-1">
                {userProfile.weeklyStreak.map((item, idx) => (
                  <div key={idx} className={`flex flex-col items-center gap-1 ${item.state === 'active' ? 'opacity-75' : item.state === 'locked' ? 'opacity-50' : ''}`}>
                    <span className="text-[11px] text-[#523200]/80 dark:text-amber-200 font-medium">
                      {item.day}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shadow-xs ${
                        item.state === 'done'
                          ? 'bg-[#e29100] text-white'
                          : item.state === 'active'
                          ? 'bg-white dark:bg-slate-800 text-[#523200] dark:text-amber-200'
                          : 'bg-white/80 dark:bg-slate-800/80 text-[#523200] dark:text-slate-400'
                      }`}
                    >
                      {item.state === 'done' && (
                        <span
                          className="material-symbols-outlined text-[16px]"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          check
                        </span>
                      )}
                      {item.state === 'active' && (
                        <span className="material-symbols-outlined text-[14px]">bolt</span>
                      )}
                      {item.state === 'locked' && (
                        <span className="material-symbols-outlined text-[14px]">lock</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Metrics Grid (2x2 Grid) */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-0.5">
            <h2 className="text-base font-bold text-[#131b2e] dark:text-white">Weekly Analytics</h2>
            <button
              onClick={() => alert('Viewing detailed analytics breakdown for Fall Semester.')}
              className="text-xs text-[#006c49] dark:text-[#4edea3] font-semibold flex items-center gap-0.5 hover:opacity-80 transition-opacity"
            >
              <span>Details</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Card 1: Tasks Done */}
            <div className="bg-white dark:bg-[#131B2E] p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[#3c4a42] dark:text-slate-400 mb-2">
                <span
                  className="material-symbols-outlined text-[18px] text-[#10B981]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                <span className="text-xs font-semibold truncate">Tasks Done</span>
              </div>
              <div>
                <div className="text-[28px] font-bold text-[#131b2e] dark:text-white tracking-tight">
                  {userProfile.weeklyAnalytics.tasksDone}
                </div>
                <div className="inline-flex items-center gap-0.5 px-2 py-0.5 mt-2 rounded-full bg-[#6ffbbe] dark:bg-emerald-950 text-[#005236] dark:text-emerald-300 text-xs font-semibold">
                  <span className="material-symbols-outlined text-[13px]">trending_up</span>
                  <span>{userProfile.weeklyAnalytics.tasksDoneDiff}</span>
                </div>
              </div>
            </div>

            {/* Card 2: Study Time Logged */}
            <div className="bg-white dark:bg-[#131B2E] p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[#3c4a42] dark:text-slate-400 mb-2">
                <span className="material-symbols-outlined text-[18px] text-[#4648d4] dark:text-indigo-400">
                  schedule
                </span>
                <span className="text-xs font-semibold truncate">Study Logged</span>
              </div>
              <div>
                <div className="text-[28px] font-bold text-[#131b2e] dark:text-white tracking-tight">
                  {userProfile.weeklyAnalytics.studyLoggedHours}{' '}
                  <span className="text-sm text-[#3c4a42] dark:text-slate-400 font-normal">hrs</span>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 mt-2 rounded-full bg-[#e1e0ff] dark:bg-indigo-950 text-[#07006c] dark:text-indigo-300 text-xs font-semibold">
                  <span
                    className="material-symbols-outlined text-[12px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                  <span>{userProfile.weeklyAnalytics.studyCampusRank}</span>
                </div>
              </div>
            </div>

            {/* Card 3: On-Time Rate */}
            <div className="bg-white dark:bg-[#131B2E] p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[#3c4a42] dark:text-slate-400 mb-2">
                <span className="material-symbols-outlined text-[18px] text-[#855300] dark:text-amber-400">
                  track_changes
                </span>
                <span className="text-xs font-semibold truncate">On-Time Rate</span>
              </div>
              <div>
                <div className="text-[28px] font-bold text-[#131b2e] dark:text-white tracking-tight">
                  {userProfile.weeklyAnalytics.onTimeRate}%
                </div>
                <p className="text-[11px] text-[#3c4a42] dark:text-slate-400 mt-1 mb-1.5">
                  {userProfile.weeklyAnalytics.onTimeSubtext}
                </p>
                <div className="w-full h-1.5 rounded-full bg-[#eaedff] dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-[#10B981] rounded-full"
                    style={{ width: `${userProfile.weeklyAnalytics.onTimeRate}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Card 4: Target GPA Goal */}
            <div className="bg-white dark:bg-[#131B2E] p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
              <div className="flex items-center gap-1.5 text-[#3c4a42] dark:text-slate-400 mb-2">
                <span
                  className="material-symbols-outlined text-[18px] text-[#006c49] dark:text-[#4edea3]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  school
                </span>
                <span className="text-xs font-semibold truncate">Target GPA</span>
              </div>
              <div>
                <div className="text-[28px] font-bold text-[#131b2e] dark:text-white tracking-tight">
                  {userProfile.weeklyAnalytics.targetGpa}
                </div>
                <div className="inline-flex items-center gap-1 mt-2 text-[#006c49] dark:text-[#4edea3] text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                  <span>Current: {userProfile.weeklyAnalytics.currentGpa} • On Track</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Preferences & Account Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-[11px] tracking-wider uppercase text-[#3c4a42] dark:text-slate-400 font-bold px-0.5">
            Preferences &amp; Account
          </h2>

          <div className="bg-white dark:bg-[#131B2E] rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col">
            {/* Row 1: Courses */}
            <button
              onClick={onOpenEnrolledCourses}
              className="w-full flex items-center justify-between p-4 hover:bg-[#f2f3ff] dark:hover:bg-slate-800/60 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#e1e0ff] text-[#07006c] flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    menu_book
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-bold text-[#131b2e] dark:text-white block truncate">
                    My Enrolled Courses
                  </span>
                  <span className="text-xs text-[#3c4a42] dark:text-slate-400">
                    {userProfile.enrolledCourses.join(', ')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="px-2 py-0.5 rounded-full bg-[#6063ee] text-white text-[11px] font-semibold">
                  4 courses
                </span>
                <span className="material-symbols-outlined text-[#6c7a71] text-[20px]">chevron_right</span>
              </div>
            </button>

            <div className="h-[1px] bg-[#eaedff] dark:bg-slate-800 mx-4"></div>

            {/* Row 2: Notifications */}
            <button
              onClick={() => {
                if (onOpenNotifications) {
                  onOpenNotifications();
                } else {
                  onOpenSettings();
                }
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-[#f2f3ff] dark:hover:bg-slate-800/60 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#ffddb8] text-[#2a1700] flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    notifications
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-bold text-[#131b2e] dark:text-white block truncate">
                    Notification Preferences
                  </span>
                  <span className="text-xs text-[#3c4a42] dark:text-slate-400">
                    {userProfile.notificationPreference}
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#6c7a71] text-[20px] shrink-0 ml-2">chevron_right</span>
            </button>

            <div className="h-[1px] bg-[#eaedff] dark:bg-slate-800 mx-4"></div>

            {/* Row 3: Calendar Sync */}
            <button
              onClick={() => alert('Calendars connected: Google Calendar and Microsoft Outlook active and 2-way synced.')}
              className="w-full flex items-center justify-between p-4 hover:bg-[#f2f3ff] dark:hover:bg-slate-800/60 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#6ffbbe] text-[#002113] flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    sync_alt
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-bold text-[#131b2e] dark:text-white block truncate">
                    Sync External Calendars
                  </span>
                  <span className="text-xs text-[#3c4a42] dark:text-slate-400 truncate block">
                    {userProfile.syncCalendars}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                <span className="material-symbols-outlined text-[#6c7a71] text-[20px]">chevron_right</span>
              </div>
            </button>

            <div className="h-[1px] bg-[#eaedff] dark:bg-slate-800 mx-4"></div>

            {/* Row 4: Dark Mode Toggle */}
            <div className="w-full flex items-center justify-between p-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#dae2fd] dark:bg-slate-700 text-[#3c4a42] dark:text-slate-200 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">
                    {isDarkMode ? 'light_mode' : 'dark_mode'}
                  </span>
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-bold text-[#131b2e] dark:text-white block truncate">
                    Dark Mode
                  </span>
                  <span className="text-xs text-[#3c4a42] dark:text-slate-400">
                    {isDarkMode ? 'Dark theme enabled' : 'System default light'}
                  </span>
                </div>
              </div>

              {/* Custom iOS Toggle Switch */}
              <button
                aria-checked={isDarkMode}
                onClick={onToggleDarkMode}
                className={`relative inline-flex h-[28px] w-[48px] shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isDarkMode ? 'bg-[#10B981]' : 'bg-[#e2e7ff] dark:bg-slate-700'
                }`}
                role="switch"
                type="button"
              >
                <span
                  className={`pointer-events-none inline-block h-[24px] w-[24px] rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isDarkMode ? 'translate-x-[22px] translate-y-[2px]' : 'translate-x-[2px] translate-y-[2px]'
                  }`}
                />
              </button>
            </div>

            <div className="h-[1px] bg-[#eaedff] dark:bg-slate-800 mx-4"></div>

            {/* Row 5: Help & FAQ */}
            <button
              onClick={onOpenAdvisorChat}
              className="w-full flex items-center justify-between p-4 hover:bg-[#f2f3ff] dark:hover:bg-slate-800/60 transition-colors text-left"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#eaedff] dark:bg-slate-800 text-[#3c4a42] dark:text-slate-300 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">help_outline</span>
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-bold text-[#131b2e] dark:text-white block truncate">
                    Student Support &amp; FAQ
                  </span>
                  <span className="text-xs text-[#3c4a42] dark:text-slate-400">
                    24/7 academic advisor chat
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#6c7a71] text-[20px] shrink-0 ml-2">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Sign Out Button */}
        <div className="pt-1">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to sign out of CampusBuddy?')) {
                alert('Signed out successfully.');
              }
            }}
            className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#f2f3ff] dark:bg-slate-800 text-[#ba1a1a] hover:bg-rose-100/60 dark:hover:bg-rose-950/40 transition-colors font-bold text-sm"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            <span>Sign Out</span>
          </button>
          <p className="text-center text-xs text-[#6c7a71] dark:text-slate-500 mt-3">
            CampusBuddy v2.4.1 (Build 198) • Made for students
          </p>
        </div>
      </div>
    </main>
  );
};
