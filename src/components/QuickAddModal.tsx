import React from 'react';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'task' | 'calendar' | 'event') => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose, onSelectAction }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] bg-white dark:bg-[#131B2E] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Add</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectAction('task');
            }}
            className="w-full p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/60 hover:bg-[#ECFDF5] dark:hover:bg-[#10B981]/15 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3.5 text-left transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-[24px]">assignment</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#059669]">
                New Assignment or Task
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Set deadline, priority, course tags, and checklist subtasks
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectAction('calendar');
            }}
            className="w-full p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/60 hover:bg-[#EEF2FF] dark:hover:bg-[#6063ee]/15 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3.5 text-left transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#EEF2FF] text-[#4648D4] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-[24px]">calendar_today</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#4648D4]">
                Schedule Study Session / Class
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Block timetable hours in the library or room reserve
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectAction('event');
            }}
            className="w-full p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800/60 hover:bg-[#FEF3C7] dark:hover:bg-[#e29100]/15 border border-slate-200/80 dark:border-slate-700/80 flex items-center gap-3.5 text-left transition-all group"
          >
            <div className="w-11 h-11 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <span className="material-symbols-outlined text-[24px]">celebration</span>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#D97706]">
                Publish Campus Event
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Announce club workshops, hackathons, and gatherings
              </p>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
