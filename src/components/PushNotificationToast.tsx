import React, { useEffect } from 'react';
import { PushNotification } from '../services/notificationService';

interface PushNotificationToastProps {
  notification: PushNotification | null;
  onDismiss: () => void;
  onActionClick: (targetTab: PushNotification['targetTab']) => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  notification,
  onDismiss,
  onActionClick,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const categoryStyles: Record<
    PushNotification['category'],
    { bg: string; text: string; icon: string; border: string }
  > = {
    deadline: {
      bg: 'bg-rose-50 dark:bg-rose-950/80',
      text: 'text-rose-700 dark:text-rose-300',
      icon: 'alarm',
      border: 'border-rose-200 dark:border-rose-800',
    },
    advisor: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/80',
      text: 'text-indigo-700 dark:text-indigo-300',
      icon: 'chat',
      border: 'border-indigo-200 dark:border-indigo-800',
    },
    event: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/80',
      text: 'text-emerald-700 dark:text-emerald-300',
      icon: 'celebration',
      border: 'border-emerald-200 dark:border-emerald-800',
    },
    streak: {
      bg: 'bg-amber-50 dark:bg-amber-950/80',
      text: 'text-amber-700 dark:text-amber-300',
      icon: 'local_fire_department',
      border: 'border-amber-200 dark:border-amber-800',
    },
    course: {
      bg: 'bg-blue-50 dark:bg-blue-950/80',
      text: 'text-blue-700 dark:text-blue-300',
      icon: 'school',
      border: 'border-blue-200 dark:border-blue-800',
    },
  };

  const style = categoryStyles[notification.category] || categoryStyles.deadline;

  return (
    <div className="fixed top-12 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none animate-in slide-in-from-top-4 duration-300">
      <div
        onClick={() => {
          onActionClick(notification.targetTab);
          onDismiss();
        }}
        className={`pointer-events-auto w-full max-w-[410px] p-3.5 rounded-2xl bg-white dark:bg-[#131B2E] border ${style.border} shadow-[0_8px_30px_rgba(15,23,42,0.18)] flex items-start gap-3 cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform`}
      >
        <div
          className={`w-10 h-10 rounded-xl ${style.bg} ${style.text} flex items-center justify-center shrink-0 mt-0.5 shadow-xs`}
        >
          <span className="material-symbols-outlined text-[20px]">{notification.icon || style.icon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#10B981] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
              Live Push Alert
            </span>
            <span className="text-[10px] text-slate-400">Just now</span>
          </div>

          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug mt-0.5 truncate">
            {notification.title}
          </h4>

          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug mt-0.5 line-clamp-2">
            {notification.body}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] font-semibold text-[#10B981] hover:underline flex items-center gap-0.5">
              <span>View details in {notification.targetTab.toUpperCase()}</span>
              <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDismiss();
              }}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
