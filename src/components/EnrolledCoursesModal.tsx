import React from 'react';
import { courseDetails } from '../mockData';

interface EnrolledCoursesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnrolledCoursesModal: React.FC<EnrolledCoursesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] bg-white dark:bg-[#131B2E] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">menu_book</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Enrolled Courses</h2>
              <p className="text-xs text-slate-500">Fall Semester 2024 • 15 Credits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-3">
          {courseDetails.map((course) => (
            <div
              key={course.code}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex flex-col gap-2 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <span
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold text-white shadow-xs"
                  style={{ backgroundColor: course.color }}
                >
                  {course.code}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                  Current Grade: {course.grade}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {course.name}
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">person</span>
                  <span className="truncate">{course.instructor}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">meeting_room</span>
                  <span className="truncate">{course.location}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <span className="material-symbols-outlined text-[15px] text-slate-400">schedule</span>
                  <span>{course.schedule}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                <span className="font-semibold text-slate-500">{course.credits} Academic Credits</span>
                <button
                  type="button"
                  onClick={() => alert(`Opening syllabus and lecture recordings for ${course.code}`)}
                  className="font-bold text-[#10B981] hover:underline flex items-center gap-0.5"
                >
                  <span>Syllabus &amp; Notes</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_outward</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
