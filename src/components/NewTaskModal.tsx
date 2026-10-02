import React, { useState } from 'react';
import { Task } from '../types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [course, setCourse] = useState<Task['course']>('CS 101');
  const [priority, setPriority] = useState<Task['priority']>('High');
  const [dueDateText, setDueDateText] = useState('Due Today, 5:00 PM');
  const [categorySection, setCategorySection] = useState<Task['categorySection']>('today');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim() || 'No additional details provided.',
      course,
      priority,
      dueDateText,
      categorySection,
      subtasks: [
        { id: `sub-${Date.now()}-1`, title: 'Review requirements and setup', completed: false },
        { id: `sub-${Date.now()}-2`, title: 'Draft main implementation', completed: false },
      ],
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-[430px] bg-white dark:bg-[#131B2E] rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Create New Task</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add an assignment, quiz, or project deadline</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Lab Report #4: Binary Search Trees"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Course / Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['CS 101', 'MATH 201', 'ENG 110', 'Personal'] as Task['course'][]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCourse(c)}
                  className={`h-9 px-3 rounded-lg text-xs font-semibold flex items-center justify-between border transition-all ${
                    course === c
                      ? 'border-[#10B981] bg-[#ECFDF5] text-[#047857] dark:bg-[#10B981]/20 dark:text-[#34D399]'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800'
                  }`}
                >
                  <span>{c}</span>
                  {course === c && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Timeline Section
              </label>
              <select
                value={categorySection}
                onChange={(e) => setCategorySection(e.target.value as Task['categorySection'])}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-[#10B981]"
              >
                <option value="today">Due Today</option>
                <option value="upcoming">Upcoming</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:border-[#10B981]"
              >
                <option value="High">High Priority</option>
                <option value="Med">Medium Priority</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Due Date & Time Description
            </label>
            <input
              type="text"
              placeholder="e.g. Due Today, 11:59 PM or Tomorrow, 2:00 PM"
              value={dueDateText}
              onChange={(e) => setDueDateText(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Add hints, submission portal instructions, or reference links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#10B981]"
            />
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-11 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm shadow-md shadow-[#10B981]/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Save Task</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
