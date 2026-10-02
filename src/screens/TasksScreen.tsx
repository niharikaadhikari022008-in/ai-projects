import React, { useState } from 'react';
import { CourseCategory, Task } from '../types';

interface TasksScreenProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onOpenNewTaskModal: () => void;
  onNavigateTab: (tab: 'home' | 'tasks' | 'calendar' | 'events' | 'profile') => void;
}

export const TasksScreen: React.FC<TasksScreenProps> = ({
  tasks,
  onToggleTask,
  onOpenNewTaskModal,
  onNavigateTab,
}) => {
  const [selectedCourse, setSelectedCourse] = useState<CourseCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'course'>('date');
  const [hideCompleted, setHideCompleted] = useState(false);

  // Filter tasks based on course filter & search query
  const filteredTasks = tasks.filter((t) => {
    const matchesCourse = selectedCourse === 'All' || t.course === selectedCourse;
    const matchesQuery =
      searchQuery.trim() === '' ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesQuery;
  });

  // Calculate course counts
  const courseCounts = {
    All: tasks.length,
    'CS 101': tasks.filter((t) => t.course === 'CS 101').length,
    'MATH 201': tasks.filter((t) => t.course === 'MATH 201').length,
    'ENG 110': tasks.filter((t) => t.course === 'ENG 110').length,
    Personal: tasks.filter((t) => t.course === 'Personal').length,
  };

  // Group filtered tasks
  const overdueTasks = filteredTasks.filter((t) => !t.completed && t.categorySection === 'overdue');
  const dueTodayTasks = filteredTasks.filter((t) => !t.completed && t.categorySection === 'today');
  const upcomingTasks = filteredTasks.filter((t) => !t.completed && t.categorySection === 'upcoming');
  const completedTasks = filteredTasks.filter((t) => t.completed);

  return (
    <main className="flex-1 w-full max-w-[430px] mx-auto pt-[68px] pb-28 px-4 flex flex-col space-y-6">
      <div className="flex flex-col w-full space-y-5">
        {/* Top Header & Action Row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            <span className="font-label-sm text-[#006c49] dark:text-[#4edea3] tracking-wider uppercase font-bold flex items-center gap-1.5 mb-0.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
              Fall Semester 2024
            </span>
            <h1 className="text-[24px] font-bold text-[#0F172A] dark:text-white tracking-tight">
              My Tasks &amp; Assignments
            </h1>
          </div>
          <button
            aria-label="Quick add task"
            onClick={onOpenNewTaskModal}
            className="h-10 px-3.5 rounded-xl bg-[#006c49] hover:bg-[#005236] text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>New</span>
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6c7a71]">
            <span className="material-symbols-outlined text-[20px]">search</span>
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-11 bg-[#f2f3ff] dark:bg-slate-800 text-[#131b2e] dark:text-white placeholder:text-[#6c7a71] dark:placeholder:text-slate-400 text-sm rounded-full shadow-sm focus:outline-none focus:bg-white dark:focus:bg-slate-700/80 transition-all"
            placeholder="Search assignments, tags, or topics..."
            type="text"
          />
          <button
            aria-label="Search filter modal"
            onClick={() => {
              setSortBy((prev) => (prev === 'date' ? 'priority' : prev === 'priority' ? 'course' : 'date'));
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#6c7a71] hover:text-[#131b2e] dark:hover:text-white transition-colors"
            type="button"
            title={`Sorted by: ${sortBy}`}
          >
            <span className="material-symbols-outlined text-[19px]">tune</span>
          </button>
        </div>

        {/* Course Filter Row (Horizontal Scrollable Chips) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
          {/* All */}
          <button
            onClick={() => setSelectedCourse('All')}
            className={`shrink-0 h-8 px-3.5 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all ${
              selectedCourse === 'All'
                ? 'bg-[#131b2e] text-white dark:bg-white dark:text-slate-900'
                : 'bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
            type="button"
          >
            <span>All</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#dae2fd] dark:bg-slate-700 text-[#131b2e] dark:text-white text-[10px] font-bold">
              {courseCounts.All}
            </span>
          </button>

          {/* CS 101 */}
          <button
            onClick={() => setSelectedCourse('CS 101')}
            className={`shrink-0 h-8 px-3.5 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all ${
              selectedCourse === 'CS 101'
                ? 'bg-[#4648d4] text-white ring-2 ring-[#4648d4]/30'
                : 'bg-[#e1e0ff] text-[#07006c] dark:bg-indigo-950/60 dark:text-indigo-300'
            }`}
            type="button"
          >
            <span className="w-2 h-2 rounded-full bg-[#4648d4]"></span>
            <span>CS 101</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#6063ee] text-white text-[10px] font-bold">
              {courseCounts['CS 101']}
            </span>
          </button>

          {/* MATH 201 */}
          <button
            onClick={() => setSelectedCourse('MATH 201')}
            className={`shrink-0 h-8 px-3.5 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all ${
              selectedCourse === 'MATH 201'
                ? 'bg-[#e29100] text-white ring-2 ring-[#e29100]/30'
                : 'bg-[#ffddb8] text-[#2a1700] dark:bg-amber-950/60 dark:text-amber-300'
            }`}
            type="button"
          >
            <span className="w-2 h-2 rounded-full bg-[#e29100]"></span>
            <span>MATH 201</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#ffb95f] text-[#653e00] text-[10px] font-bold">
              {courseCounts['MATH 201']}
            </span>
          </button>

          {/* ENG 110 */}
          <button
            onClick={() => setSelectedCourse('ENG 110')}
            className={`shrink-0 h-8 px-3.5 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all ${
              selectedCourse === 'ENG 110'
                ? 'bg-[#6063ee] text-white ring-2 ring-[#6063ee]/30'
                : 'bg-[#e2e7ff] text-[#4648d4] dark:bg-blue-950/60 dark:text-blue-300'
            }`}
            type="button"
          >
            <span className="w-2 h-2 rounded-full bg-[#4648d4]"></span>
            <span>ENG 110</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#eaedff] text-[#131b2e] dark:bg-slate-700 dark:text-white text-[10px] font-bold">
              {courseCounts['ENG 110']}
            </span>
          </button>

          {/* Personal */}
          <button
            onClick={() => setSelectedCourse('Personal')}
            className={`shrink-0 h-8 px-3.5 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-all ${
              selectedCourse === 'Personal'
                ? 'bg-[#10B981] text-white ring-2 ring-[#10B981]/30'
                : 'bg-[#ECFDF5] text-[#064E3B] dark:bg-emerald-950/60 dark:text-emerald-300'
            }`}
            type="button"
          >
            <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
            <span>Personal</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#D1FAE5] text-[#064E3B] text-[10px] font-bold">
              {courseCounts.Personal}
            </span>
          </button>
        </div>

        {/* View Switcher & Sort Toolbar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Segmented Control */}
          <div className="flex p-0.5 rounded-xl bg-[#e2e7ff] dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-inner">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-700 text-[#131b2e] dark:text-white shadow-sm'
                  : 'text-[#6c7a71] dark:text-slate-400 hover:text-slate-900'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                view_list
              </span>
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'board'
                  ? 'bg-white dark:bg-slate-700 text-[#131b2e] dark:text-white shadow-sm'
                  : 'text-[#6c7a71] dark:text-slate-400 hover:text-slate-900'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span>Board</span>
            </button>
          </div>

          {/* Sort Trigger */}
          <button
            onClick={() => {
              setSortBy((prev) => (prev === 'date' ? 'priority' : prev === 'priority' ? 'course' : 'date'));
            }}
            className="h-8 px-3 rounded-lg bg-white dark:bg-slate-800 text-[#131b2e] dark:text-white hover:bg-slate-50 font-semibold text-xs flex items-center gap-1 shadow-sm active:scale-95 transition-all"
            type="button"
          >
            <span className="text-[#6c7a71] font-normal">Sort:</span>
            <span className="font-bold capitalize">{sortBy === 'date' ? 'Due Date' : sortBy}</span>
            <span className="material-symbols-outlined text-[16px] text-[#6c7a71]">expand_more</span>
          </button>
        </div>

        {/* Motivational Micro-Insight / Streak Delight Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6ffbbe] to-[#dae2fd] dark:from-emerald-950 dark:to-indigo-950 p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-[#006c49] dark:text-[#4edea3] shadow-sm shrink-0">
              <span
                className="material-symbols-outlined text-[24px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                local_fire_department
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-[#002113] dark:text-emerald-300">
                Study Momentum: 4-Day Streak!
              </p>
              <p className="text-xs text-[#005236] dark:text-emerald-400">
                3 items left to conquer today's study goals.
              </p>
            </div>
          </div>
          <span className="px-2 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 text-[#006c49] dark:text-emerald-300 text-xs font-bold shadow-xs">
            82%
          </span>
        </div>

        {/* View Mode: LIST */}
        {viewMode === 'list' ? (
          <div className="flex flex-col space-y-6">
            {/* SECTION 1: Overdue */}
            {overdueTasks.length > 0 && (
              <div className="flex flex-col space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
                    <h2 className="text-base font-bold text-[#ba1a1a]">Overdue</h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-bold">
                      {overdueTasks.length}
                    </span>
                  </div>
                  <span className="text-xs text-[#ba1a1a] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">warning</span>
                    Needs action
                  </span>
                </div>

                {overdueTasks.map((task) => (
                  <div
                    key={task.id}
                    className="relative rounded-2xl bg-white dark:bg-[#131B2E] p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col space-y-3"
                  >
                    <div className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full bg-[#ba1a1a]"></div>
                    <div className="flex items-start gap-3 pl-1.5">
                      <button
                        aria-label="Mark task done"
                        onClick={() => onToggleTask(task.id)}
                        className="mt-0.5 w-6 h-6 rounded-full bg-[#ffdad6] hover:bg-[#ba1a1a] text-transparent hover:text-white flex items-center justify-center shrink-0 transition-all"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-bold text-[#131b2e] dark:text-white truncate group-hover:text-[#ba1a1a] transition-colors">
                            {task.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#93000a] text-[11px] font-bold shrink-0">
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-xs text-[#3c4a42] dark:text-slate-400 mt-0.5 line-clamp-1">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 pl-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-[#e2e7ff] dark:bg-indigo-950 text-[#4648d4] dark:text-indigo-400 text-xs font-semibold">
                          {task.course}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-[#ba1a1a] bg-[#ffdad6]/60 px-2 py-0.5 rounded-md font-semibold">
                          <span className="material-symbols-outlined text-[13px]">schedule</span>
                          {task.dueDateText}
                        </span>
                      </div>
                      {task.collaborator && (
                        <div className="flex -space-x-1.5 overflow-hidden">
                          <div className="w-6 h-6 rounded-full bg-[#e1e0ff] text-[#07006c] text-[10px] font-bold flex items-center justify-center">
                            {task.collaborator}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECTION 2: Due Today */}
            <div className="flex flex-col space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#131b2e] dark:text-white">Due Today</h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#eaedff] dark:bg-slate-700 text-[#131b2e] dark:text-white text-[11px] font-bold">
                    {dueTodayTasks.length}
                  </span>
                </div>
                <span className="text-xs text-[#6c7a71] dark:text-slate-400">Oct 24, Thursday</span>
              </div>

              {dueTodayTasks.map((task) => (
                <div
                  key={task.id}
                  className="relative rounded-2xl bg-white dark:bg-[#131B2E] p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <button
                      aria-label="Mark task done"
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-[#10B981] hover:text-white text-transparent flex items-center justify-center shrink-0 transition-all"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#131b2e] dark:text-white truncate group-hover:text-[#10B981] transition-colors">
                          {task.title}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                            task.course === 'CS 101'
                              ? 'bg-[#e1e0ff] text-[#07006c] dark:bg-indigo-950 dark:text-indigo-400'
                              : 'bg-[#ffddb8] text-[#2a1700] dark:bg-amber-950 dark:text-amber-400'
                          }`}
                        >
                          {task.course}
                        </span>
                      </div>
                      <p className="text-xs text-[#3c4a42] dark:text-slate-400 mt-0.5">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  {/* Subtask Progress Bar Visual (e.g. for Lab Report) */}
                  {task.subtasks && task.subtasks.length > 0 && (
                    <div className="w-full bg-[#f2f3ff] dark:bg-slate-800/80 rounded-xl p-2.5 flex flex-col space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#3c4a42] dark:text-slate-300 flex items-center gap-1 font-semibold">
                          <span className="material-symbols-outlined text-[14px]">checklist</span>
                          Subtasks
                        </span>
                        <span className="text-[#006c49] dark:text-[#4edea3] font-bold">
                          {task.subtasks.filter((s) => s.completed).length} of {task.subtasks.length} done
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#e2e7ff] dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#10B981] rounded-full transition-all"
                          style={{
                            width: `${
                              (task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      {task.attachment && (
                        <span className="flex items-center gap-1 text-xs text-[#3c4a42] dark:text-slate-300 bg-[#f2f3ff] dark:bg-slate-800 px-2 py-0.5 rounded-md font-medium">
                          <span className="material-symbols-outlined text-[13px]">attach_file</span>
                          {task.attachment}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-[#855300] dark:text-amber-400 bg-[#ffddb8]/60 dark:bg-amber-950/60 px-2 py-0.5 rounded-md font-medium">
                        <span className="material-symbols-outlined text-[14px]">timer</span>
                        {task.dueDateText}
                      </span>
                      {task.commentsCount && (
                        <span className="flex items-center gap-1 text-xs text-[#6c7a71] dark:text-slate-400">
                          <span className="material-symbols-outlined text-[14px]">forum</span>
                          {task.commentsCount}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => alert(`Task options for: ${task.title}`)}
                      className="text-[#6c7a71] hover:text-[#131b2e] dark:hover:text-white p-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">more_horiz</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION 3: Upcoming */}
            <div className="flex flex-col space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#131b2e] dark:text-white">Upcoming</h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#eaedff] dark:bg-slate-700 text-[#131b2e] dark:text-white text-[11px] font-bold">
                    {upcomingTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => onNavigateTab('calendar')}
                  className="text-xs text-[#006c49] dark:text-[#4edea3] hover:underline font-semibold"
                  type="button"
                >
                  View Calendar
                </button>
              </div>

              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="relative rounded-2xl bg-white dark:bg-[#131B2E] p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col space-y-2.5"
                >
                  <div className="flex items-start gap-3">
                    <button
                      aria-label="Mark task done"
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-[#10B981] hover:text-white text-transparent flex items-center justify-center shrink-0 transition-all"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-[#131b2e] dark:text-white truncate group-hover:text-[#10B981] transition-colors">
                          {task.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#e1e0ff] dark:bg-indigo-950 text-[#07006c] dark:text-indigo-400 text-[11px] font-bold shrink-0">
                          {task.course}
                        </span>
                      </div>
                      <p className="text-xs text-[#3c4a42] dark:text-slate-400 mt-0.5">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1 text-xs text-[#6c7a71] dark:text-slate-400">
                      <span className="material-symbols-outlined text-[14px]">event</span>
                      {task.dueDateText}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] dark:bg-slate-800 text-[#3c4a42] dark:text-slate-300 text-[11px] font-medium">
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* SECTION 4: Completed Today */}
            <div className="flex flex-col space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#6c7a71] dark:text-slate-400">
                    Completed Today
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#D1FAE5] dark:bg-emerald-950 text-[#064E3B] dark:text-emerald-400 text-[11px] font-bold">
                    {completedTasks.length}
                  </span>
                </div>
                <button
                  onClick={() => setHideCompleted(!hideCompleted)}
                  className="text-xs text-[#6c7a71] hover:text-[#131b2e] dark:hover:text-white font-medium"
                  type="button"
                >
                  {hideCompleted ? 'Show' : 'Hide'}
                </button>
              </div>

              {!hideCompleted &&
                completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="relative rounded-2xl bg-[#ECFDF5] dark:bg-emerald-950/40 p-4 shadow-xs flex items-center justify-between gap-3 group transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-[#10B981] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-[#6c7a71] dark:text-slate-400 line-through truncate">
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="px-2 py-0.2 rounded-full bg-[#A7F3D0] text-[#064E3B] dark:bg-emerald-900 dark:text-emerald-200 text-[10px] font-bold">
                            {task.course}
                          </span>
                          <span className="text-xs text-[#6c7a71] dark:text-slate-400 flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">done_all</span>
                            {task.completedAtText || 'Completed'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      aria-label="Undo task completion"
                      onClick={() => onToggleTask(task.id)}
                      className="h-8 px-2.5 rounded-lg bg-white dark:bg-slate-800 text-[#3c4a42] dark:text-slate-200 hover:text-[#006c49] text-xs font-semibold shrink-0 shadow-xs transition-colors"
                      type="button"
                    >
                      Undo
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ) : (
          /* View Mode: BOARD (Kanban Columns) */
          <div className="flex flex-col space-y-4">
            {/* Column 1: Overdue & Today */}
            <div className="p-3.5 rounded-2xl bg-[#f2f3ff] dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    In Progress / Due Soon
                  </h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-white">
                  {dueTodayTasks.length + overdueTasks.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {[...overdueTasks, ...dueTodayTasks].map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm cursor-pointer hover:border-[#10B981] border border-transparent transition-all"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {task.course}
                      </span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                        {task.dueDateText}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{task.title}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 2: Upcoming */}
            <div className="p-3.5 rounded-2xl bg-[#f2f3ff] dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    Upcoming
                  </h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-white">
                  {upcomingTasks.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 shadow-sm cursor-pointer hover:border-[#10B981] border border-transparent transition-all"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {task.course}
                      </span>
                      <span className="text-[10px] text-slate-500">{task.dueDateText}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{task.title}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Column 3: Completed */}
            <div className="p-3.5 rounded-2xl bg-[#ECFDF5] dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h3 className="text-xs font-bold text-[#064E3B] dark:text-emerald-300 uppercase tracking-wider">
                    Completed
                  </h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300">
                  {completedTasks.length}
                </span>
              </div>
              <div className="space-y-2.5">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => onToggleTask(task.id)}
                    className="p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-xs cursor-pointer hover:border-emerald-500 border border-transparent transition-all"
                  >
                    <h4 className="text-xs font-bold text-slate-500 line-through">{task.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
