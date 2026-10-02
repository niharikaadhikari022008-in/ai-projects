import React, { useState } from 'react';
import { CalendarEvent } from '../types';

interface CalendarScreenProps {
  events: CalendarEvent[];
  onOpenQuickAdd: () => void;
  onNavigateTab: (tab: 'home' | 'tasks' | 'calendar' | 'events' | 'profile') => void;
}

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ events }) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(3); // 3 = Thu 1
  const [viewDensity, setViewDensity] = useState<'day' | 'week' | 'month'>('week');
  const [monthName, setMonthName] = useState('October 2026');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const daysOfWeek = [
    { day: 'Mon', num: 28, dots: ['bg-[#4648d4]', 'bg-[#10B981]'] },
    { day: 'Tue', num: 29, dots: ['bg-[#6063ee]'] },
    { day: 'Wed', num: 30, dots: ['bg-[#10B981]', 'bg-[#e29100]'] },
    { day: 'Thu', num: 1, dots: ['bg-white', 'bg-white/80', 'bg-white/60'] },
    { day: 'Fri', num: 2, dots: ['bg-[#4648d4]', 'bg-[#10B981]'] },
    { day: 'Sat', num: 3, dots: ['bg-[#e29100]'] },
    { day: 'Sun', num: 4, dots: ['bg-[#bbcabf]'] },
  ];

  // Events for selected day
  const dayEvents = events.filter((e) => {
    const matchesDay = e.dayIndex === selectedDayIndex;
    const matchesFilter = filterType === 'all' || e.type === filterType;
    return matchesDay && matchesFilter;
  });

  return (
    <main className="flex-1 w-full max-w-[430px] mx-auto pt-11 pb-28 px-4 flex flex-col space-y-6">
      <div className="flex flex-col w-full pb-4">
        {/* Month & View Selector Section */}
        <section className="flex flex-col gap-3.5 mb-1 pt-3">
          <div className="flex items-center justify-between">
            {/* Month Dropdown Trigger */}
            <button
              aria-label="Select month"
              onClick={() => {
                setMonthName((prev) =>
                  prev === 'October 2026' ? 'November 2026' : 'October 2026'
                );
              }}
              className="flex items-center gap-1.5 active:scale-98 transition-transform group text-left"
              type="button"
            >
              <h2 className="text-[22px] font-bold text-[#131b2e] dark:text-white tracking-tight">
                {monthName}
              </h2>
              <span className="material-symbols-outlined text-[20px] text-[#6c7a71] group-hover:text-[#131b2e] dark:group-hover:text-white transition-colors mt-0.5">
                keyboard_arrow_down
              </span>
            </button>

            {/* Today Pill Quick Action */}
            <button
              aria-label="Go to today"
              onClick={() => {
                setSelectedDayIndex(3);
                setMonthName('October 2026');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eaedff] dark:bg-slate-800 hover:bg-[#e2e7ff] active:scale-95 transition-all text-[#131b2e] dark:text-white shadow-xs"
              type="button"
            >
              <span
                className="material-symbols-outlined text-[16px] text-[#006c49] dark:text-[#4edea3]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                calendar_today
              </span>
              <span className="text-xs font-semibold text-[#006c49] dark:text-[#4edea3]">Today</span>
            </button>
          </div>

          {/* Segmented View Mode Switcher */}
          <div
            aria-label="Calendar view density"
            className="flex p-1 bg-[#eaedff] dark:bg-slate-800 rounded-full shadow-inner"
            role="tablist"
          >
            {(['day', 'week', 'month'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewDensity(mode)}
                aria-selected={viewDensity === mode}
                className={`flex-1 py-1.5 rounded-full text-center text-xs font-semibold capitalize transition-all ${
                  viewDensity === mode
                    ? 'bg-white dark:bg-slate-700 text-[#131b2e] dark:text-white shadow-sm font-bold'
                    : 'text-[#6c7a71] dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
                role="tab"
                type="button"
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        {/* Horizontal Weekly Date Picker Strip */}
        <section className="py-2.5 -mx-1 px-1 overflow-x-auto no-scrollbar">
          <div
            aria-label="Select date in week"
            className="flex items-center justify-between gap-1.5 min-w-[345px]"
            role="radiogroup"
          >
            {daysOfWeek.map((d, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <button
                  key={`${d.day}-${d.num}`}
                  onClick={() => setSelectedDayIndex(idx)}
                  aria-checked={isSelected}
                  className={`flex flex-col items-center justify-between py-2 px-1.5 rounded-2xl transition-all ${
                    isSelected
                      ? 'bg-[#10B981] text-white shadow-[0_4px_12px_rgba(16,185,129,0.35)] scale-105 min-w-[46px] h-[72px]'
                      : 'bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 min-w-[44px] h-[70px]'
                  }`}
                  role="radio"
                  type="button"
                >
                  <span
                    className={`text-[11px] font-semibold ${
                      isSelected ? 'text-white/90 font-bold' : 'text-[#6c7a71] dark:text-slate-400'
                    }`}
                  >
                    {d.day}
                  </span>
                  <span
                    className={`text-base font-semibold ${
                      isSelected
                        ? 'text-white font-extrabold text-[17px]'
                        : 'text-[#131b2e] dark:text-white'
                    }`}
                  >
                    {d.num}
                  </span>
                  <div className="flex items-center gap-0.5 h-1.5">
                    {d.dots.map((dotColor, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          isSelected ? 'bg-white' : dotColor
                        }`}
                      ></span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Schedule Summary Banner & Filter */}
        <section className="flex items-center justify-between bg-[#f2f3ff] dark:bg-slate-800/80 px-3.5 py-2.5 rounded-xl shadow-sm mt-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            <p className="text-xs text-[#131b2e] dark:text-slate-200 font-medium">
              <span className="font-bold text-[#131b2e] dark:text-white">
                {selectedDayIndex === 3 ? '3 classes & 1 study session today' : `${dayEvents.length} events scheduled`}
              </span>
            </p>
          </div>
          <button
            aria-label="Filter schedule types"
            onClick={() => setShowFilterOptions(!showFilterOptions)}
            className="p-1 rounded-lg text-[#6c7a71] hover:text-[#131b2e] dark:hover:text-white hover:bg-[#e2e7ff] dark:hover:bg-slate-700 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[19px]">tune</span>
          </button>
        </section>

        {showFilterOptions && (
          <div className="p-2.5 mt-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-xs flex-wrap">
            <span className="text-slate-500 font-medium">Filter:</span>
            {['all', 'lecture', 'seminar', 'study_group', 'office_hours'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-full capitalize font-semibold transition-colors ${
                  filterType === type
                    ? 'bg-[#10B981] text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        )}

        {/* View Density: MONTH VIEW PREVIEW */}
        {viewDensity === 'month' && (
          <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3 text-center">
              October 2026 Monthly Overview
            </h3>
            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                <span key={i} className="text-slate-400 font-bold py-1">
                  {d}
                </span>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((dayNum) => (
                <button
                  key={dayNum}
                  onClick={() => {
                    if (dayNum >= 28 || dayNum <= 4) {
                      setViewDensity('week');
                    }
                  }}
                  className={`h-9 rounded-lg flex flex-col items-center justify-center font-medium ${
                    dayNum === 1
                      ? 'bg-[#10B981] text-white font-bold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{dayNum}</span>
                  {[1, 2, 8, 10, 15, 22].includes(dayNum) && dayNum !== 1 && (
                    <span className="w-1 h-1 rounded-full bg-[#10B981]"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Time-Block Schedule Grid (Week & Day Views) */}
        {viewDensity !== 'month' && (
          <section className="relative mt-2 flex flex-col">
            {/* Hour Row: 08:00 AM */}
            <div className="relative flex items-start min-h-[58px]">
              <div className="w-16 shrink-0 pt-0.5 text-right pr-3.5">
                <span className="text-[11px] text-[#6c7a71] dark:text-slate-400 font-medium">08:00 AM</span>
              </div>
              <div className="flex-1 h-full pt-2.5">
                <div className="w-full h-px bg-[#e2e7ff] dark:bg-slate-800"></div>
              </div>
            </div>

            {/* Hour Row: 09:00 AM (CS 301 Event 9:00 - 10:30) */}
            <div className="relative flex items-start min-h-[128px]">
              <div className="w-16 shrink-0 pt-0.5 text-right pr-3.5">
                <span className="text-[11px] text-[#6c7a71] dark:text-slate-400 font-medium">09:00 AM</span>
              </div>
              <div className="flex-1 relative pb-2 pt-2.5">
                <div className="w-full h-px bg-[#e2e7ff] dark:bg-slate-800 absolute top-2.5 left-0"></div>

                {/* Event Card: Database Systems */}
                {selectedDayIndex === 3 && (
                  <div className="relative z-10 w-full rounded-xl bg-[#dae2fd]/60 dark:bg-indigo-950/40 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e1e0ff] text-[#2f2ebe] dark:bg-indigo-900/60 dark:text-indigo-300 text-[11px] font-semibold">
                        CS 301 • Lecture
                      </span>
                      <span className="text-[11px] text-[#4648d4] dark:text-indigo-400 font-semibold">90 min</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#131b2e] dark:text-white tracking-tight">
                      Database Systems Lecture
                    </h3>
                    <div className="flex items-center justify-between mt-2.5 pt-2 bg-white/60 dark:bg-slate-900/60 rounded-lg px-2 py-1.5">
                      <div className="flex items-center gap-1 text-[#3c4a42] dark:text-slate-300 text-xs">
                        <span className="material-symbols-outlined text-[15px] text-[#4648d4]">location_on</span>
                        <span className="text-xs font-semibold">Hall 101</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <img
                          className="w-5 h-5 rounded-full object-cover"
                          alt="Prof. Miller"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiWqodmUIHWwhhlXxlizQmfUjiOuODbJpT40lPeXwWcqYNx592igvZzgX-XSfgq55RhRV4Hx8DZzeW2FganXoIg5nFuNhYuSjQD_UpH1CG-o9eBU6HZP0OPyP6OLLX_E9FcYJr0FDD6t0hclZf6xsFusa_oV7H9847Gm2dSEy9pAZFji87QmIkhyhjRFhd_T-NX1UWkr89vXw7OQ8vgl7Z4r-pjo54_JIYJGmmiALLVY38D5mGHyqP"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[11px] text-[#3c4a42] dark:text-slate-300 font-medium">Prof. Miller</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hour Row: 10:00 AM */}
            <div className="relative flex items-start min-h-[46px]">
              <div className="w-16 shrink-0 pt-0.5 text-right pr-3.5">
                <span className="text-[11px] text-[#6c7a71] dark:text-slate-400 font-medium">10:00 AM</span>
              </div>
              <div className="flex-1 h-full pt-2.5">
                <div className="w-full h-px bg-[#e2e7ff] dark:bg-slate-800"></div>
              </div>
            </div>

            {/* Hour Row: 11:00 AM (Study Group + Live Indicator at 11:45) */}
            <div className="relative flex items-start min-h-[110px]">
              <div className="w-16 shrink-0 pt-0.5 text-right pr-3.5">
                <span className="text-[11px] text-[#6c7a71] dark:text-slate-400 font-medium">11:00 AM</span>
              </div>
              <div className="flex-1 relative pb-2 pt-2.5">
                <div className="w-full h-px bg-[#e2e7ff] dark:bg-slate-800 absolute top-2.5 left-0"></div>

                {/* Event Card: Group Study */}
                {selectedDayIndex === 3 && (
                  <div className="relative z-10 w-full rounded-xl bg-[#e1e0ff]/50 dark:bg-indigo-950/40 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#6063ee] text-white text-[11px] font-semibold">
                        Study Group
                      </span>
                      <div className="flex items-center gap-1 text-[#2f2ebe] dark:text-indigo-300">
                        <span className="material-symbols-outlined text-[14px]">groups</span>
                        <span className="text-[11px] font-semibold">4 members</span>
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-[#131b2e] dark:text-white tracking-tight">
                      Group Study Session
                    </h3>
                    <div className="flex items-center gap-1.5 mt-2 text-[#3c4a42] dark:text-slate-300 text-xs">
                      <span className="material-symbols-outlined text-[15px] text-[#4648d4]">meeting_room</span>
                      <span className="font-semibold">Library Room B</span>
                      <span className="text-[#6c7a71] dark:text-slate-400">• Table 4</span>
                    </div>
                  </div>
                )}

                {/* Live Current Time Marker (11:45 AM) */}
                <div className="absolute left-[-64px] right-0 top-[78%] z-20 flex items-center pointer-events-none">
                  <div className="flex items-center justify-end w-16 pr-2">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#ba1a1a] text-white text-[10px] tracking-tight font-bold shadow-sm">
                      11:45
                    </span>
                  </div>
                  <div className="relative flex-1 flex items-center">
                    <span className="absolute -left-1 w-2.5 h-2.5 rounded-full bg-[#ba1a1a] ring-4 ring-[#ffdad6] animate-pulse"></span>
                    <div className="w-full h-[1.5px] bg-[#ba1a1a] shadow-sm"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hour Row: 12:00 PM */}
            <div className="relative flex items-start min-h-[58px]">
              <div className="w-16 shrink-0 pt-0.5 text-right pr-3.5">
                <span className="text-[11px] text-[#6c7a71] dark:text-slate-400 font-medium">12:00 PM</span>
              </div>
              <div className="flex-1 h-full pt-2.5">
                <div className="w-full h-px bg-[#e2e7ff] dark:bg-slate-800"></div>
              </div>
            </div>

            {/* Hour Row: 01:00 PM (Lunch Break Suggestion) */}
            <div className="relative flex items-start min-h-[78px]">
              <div className="w-16 shrink-0 pt-0.5 text-right pr-3.5">
                <span className="text-[11px] text-[#6c7a71] dark:text-slate-400 font-medium">01:00 PM</span>
              </div>
              <div className="flex-1 relative pb-2 pt-2.5">
                <div className="w-full h-px bg-[#e2e7ff] dark:bg-slate-800 absolute top-2.5 left-0"></div>

                {/* Free Time Card */}
                {selectedDayIndex === 3 && (
                  <div className="relative z-10 w-full rounded-xl bg-[#f2f3ff] dark:bg-slate-800 p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#ffddb8] flex items-center justify-center text-[#2a1700]">
                        <span className="material-symbols-outlined text-[16px]">restaurant</span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-[#131b2e] dark:text-white">Lunch &amp; Campus Walk</p>
                        <p className="text-[11px] text-[#6c7a71] dark:text-slate-400">45 min free interval</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert('Searching nearby campus cafes: Campus Hub Cafe, Green Leaf Bistro, Library Lounge')}
                      className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-[#006c49] dark:text-[#4edea3] text-[11px] font-semibold shadow-xs hover:bg-slate-100 transition-colors"
                      type="button"
                    >
                      Find Cafe
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Hour Row: 02:00 PM (Linear Algebra 2:00 - 3:30) */}
            <div className="relative flex items-start min-h-[128px]">
              <div className="w-16 shrink-0 pt-0.5 text-right pr-3.5">
                <span className="text-[11px] text-[#6c7a71] dark:text-slate-400 font-medium">02:00 PM</span>
              </div>
              <div className="flex-1 relative pb-2 pt-2.5">
                <div className="w-full h-px bg-[#e2e7ff] dark:bg-slate-800 absolute top-2.5 left-0"></div>

                {/* Event Card: Linear Algebra */}
                {selectedDayIndex === 3 && (
                  <div className="relative z-10 w-full rounded-xl bg-[#6ffbbe]/40 dark:bg-emerald-950/40 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981] text-white text-[11px] font-semibold">
                        MATH 201 • Seminar
                      </span>
                      <span className="text-[11px] text-[#006c49] dark:text-emerald-400 font-semibold">90 min</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#131b2e] dark:text-white tracking-tight">
                      Linear Algebra Seminar
                    </h3>
                    <div className="flex items-center justify-between mt-2.5 pt-2 bg-white/60 dark:bg-slate-900/60 rounded-lg px-2 py-1.5">
                      <div className="flex items-center gap-1 text-[#3c4a42] dark:text-slate-300 text-xs">
                        <span className="material-symbols-outlined text-[15px] text-[#006c49]">pin_drop</span>
                        <span className="text-xs font-semibold">Math Building 202</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <img
                          className="w-5 h-5 rounded-full object-cover"
                          alt="Dr. Alistair"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjUm9yf2K6lX0XMdW_Upx0-ffnN9PnMblS5lPWWmldk3XsmDhwwIoe6GOo_jlpFeZrZwYZtbpEwP0dmb1ikUz2dWEgF3WLrbsdykrz7hoBlIs005h41_qxX1Im7f6Z4_6rgNreU8n57SPpQPLlOlARAmym-x3AryfMYkSZV9vRisg2zxhShL4WxYiTUd4cNjIsNUaoBIPC8cBKGv8ukLGQH2gGDCoFX9JZHTVToAb5X0KkTpXULDYp"
                          referrerPolicy="no-referrer"
                        />
                        <span className="text-[11px] text-[#3c4a42] dark:text-slate-300 font-medium">Dr. Alistair</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hour Row: 03:00 PM */}
            <div className="relative flex items-start min-h-[46px]">
              <div className="w-16 shrink-0 pt-0.5 text-right pr-3.5">
                <span className="text-[11px] text-[#6c7a71] dark:text-slate-400 font-medium">03:00 PM</span>
              </div>
              <div className="flex-1 h-full pt-2.5">
                <div className="w-full h-px bg-[#e2e7ff] dark:bg-slate-800"></div>
              </div>
            </div>

            {/* Hour Row: 04:00 PM (Office Hours 04:00 - 05:00) */}
            <div className="relative flex items-start min-h-[96px]">
              <div className="w-16 shrink-0 pt-0.5 text-right pr-3.5">
                <span className="text-[11px] text-[#6c7a71] dark:text-slate-400 font-medium">04:00 PM</span>
              </div>
              <div className="flex-1 relative pb-2 pt-2.5">
                <div className="w-full h-px bg-[#e2e7ff] dark:bg-slate-800 absolute top-2.5 left-0"></div>

                {/* Event Card: Office Hours */}
                {selectedDayIndex === 3 && (
                  <div className="relative z-10 w-full rounded-xl bg-[#ffddb8]/40 dark:bg-amber-950/40 p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e29100] text-white text-[11px] font-semibold">
                        Office Hours
                      </span>
                      <span className="text-[11px] text-[#855300] dark:text-amber-400 font-semibold">Upcoming</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#131b2e] dark:text-white tracking-tight">
                      Prof. Chen • Room 304
                    </h3>
                    <div className="flex items-center justify-between mt-2 text-[#3c4a42] dark:text-slate-300 text-xs">
                      <span className="text-xs">Drop-in questions for Midterm review</span>
                      <span className="material-symbols-outlined text-[16px] text-[#855300]">chevron_right</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hour Row: 05:00 PM */}
            <div className="relative flex items-start min-h-[44px]">
              <div className="w-16 shrink-0 pt-0.5 text-right pr-3.5">
                <span className="text-[11px] text-[#6c7a71] dark:text-slate-400 font-medium">05:00 PM</span>
              </div>
              <div className="flex-1 h-full pt-2.5">
                <div className="w-full h-px bg-[#e2e7ff] dark:bg-slate-800"></div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
};
