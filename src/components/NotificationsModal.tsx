import React, { useState } from 'react';
import {
  getNotificationPermission,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  PushNotification,
  requestNotificationPermission,
  sendCustomNotification,
  triggerKeyEvent,
} from '../services/notificationService';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: PushNotification[];
  onRefreshNotifications: () => void;
  onNavigateTab: (tab: 'home' | 'tasks' | 'calendar' | 'events' | 'profile') => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onRefreshNotifications,
  onNavigateTab,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'feed' | 'triggers' | 'compose'>('feed');
  const [permission, setPermission] = useState(getNotificationPermission());
  const [customTitle, setCustomTitle] = useState('');
  const [customBody, setCustomBody] = useState('');
  const [customCategory, setCustomCategory] = useState<PushNotification['category']>('deadline');
  const [customTarget, setCustomTarget] = useState<PushNotification['targetTab']>('home');
  const [isTriggering, setIsTriggering] = useState(false);

  if (!isOpen) return null;

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
  };

  const handleTriggerKeyEvent = async (
    type: 'deadline_urgent' | 'advisor_reply' | 'event_reminder' | 'streak_milestone' | 'course_grade'
  ) => {
    setIsTriggering(true);
    await triggerKeyEvent(type);
    setIsTriggering(false);
    onRefreshNotifications();
  };

  const handleSendCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customBody.trim()) return;
    setIsTriggering(true);
    await sendCustomNotification({
      title: customTitle.trim(),
      body: customBody.trim(),
      category: customCategory,
      targetTab: customTarget,
    });
    setCustomTitle('');
    setCustomBody('');
    setIsTriggering(false);
    setActiveSubTab('feed');
    onRefreshNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsAsRead();
    onRefreshNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[430px] bg-white dark:bg-[#131B2E] rounded-3xl p-5 shadow-2xl border border-slate-100 dark:border-slate-800 mt-10 sm:mt-0 flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Push Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#EF4444] text-white text-[10px] font-extrabold">
                    {unreadCount} new
                  </span>
                )}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Real-time campus event triggers &amp; alerts
              </p>
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

        {/* Browser Permission Banner */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                permission === 'granted' ? 'bg-[#10B981]' : 'bg-amber-500'
              }`}
            ></span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">
              OS Alerts: <strong className="capitalize">{permission}</strong>
            </span>
          </div>
          {permission !== 'granted' && (
            <button
              onClick={handleRequestPermission}
              className="px-2.5 py-1 rounded-lg bg-[#10B981] text-white font-bold text-[11px] shadow-xs active:scale-95 transition-all"
            >
              Enable OS Push
            </button>
          )}
        </div>

        {/* Sub-Tabs: Feed | Key Events Triggers | Send Push */}
        <div className="flex p-0.5 mt-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveSubTab('feed')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'feed'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Alerts Feed ({notifications.length})
          </button>
          <button
            onClick={() => setActiveSubTab('triggers')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
              activeSubTab === 'triggers'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>Trigger Events</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
          </button>
          <button
            onClick={() => setActiveSubTab('compose')}
            className={`flex-1 py-1.5 rounded-lg transition-all ${
              activeSubTab === 'compose'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            + Compose
          </button>
        </div>

        {/* Tab 1: Alerts Feed */}
        {activeSubTab === 'feed' && (
          <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-0.5 no-scrollbar">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No active notifications. Trigger one below!
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={async () => {
                    await markNotificationAsRead(n.id);
                    onRefreshNotifications();
                    onClose();
                    onNavigateTab(n.targetTab);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    !n.read
                      ? 'bg-white dark:bg-slate-800 border-emerald-300 dark:border-emerald-700 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        n.category === 'deadline'
                          ? 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400'
                          : n.category === 'advisor'
                          ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
                          : n.category === 'event'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : n.category === 'streak'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400'
                          : 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[19px]">
                        {n.icon || 'notifications'}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {n.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(n.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                        {n.body}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-[#10B981] flex items-center gap-0.5">
                          <span>Open in {n.targetTab}</span>
                          <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                        </span>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Key Event Triggers */}
        {activeSubTab === 'triggers' && (
          <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-0.5 no-scrollbar">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tap any defined campus event to broadcast a push notification through the server:
            </p>

            {/* Event 1: Deadline */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">alarm</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Urgent Deadline Reminder
                  </h4>
                  <p className="text-[11px] text-slate-500">CS101 Midterm Quiz in 1h</p>
                </div>
              </div>
              <button
                disabled={isTriggering}
                onClick={() => handleTriggerKeyEvent('deadline_urgent')}
                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                Push
              </button>
            </div>

            {/* Event 2: Advisor Message */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">chat</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Academic Advisor Message
                  </h4>
                  <p className="text-[11px] text-slate-500">Dr. Vance degree clearance reply</p>
                </div>
              </div>
              <button
                disabled={isTriggering}
                onClick={() => handleTriggerKeyEvent('advisor_reply')}
                className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                Push
              </button>
            </div>

            {/* Event 3: Event Reminder */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">celebration</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Campus Event Reminder
                  </h4>
                  <p className="text-[11px] text-slate-500">Music Festival starting in 3h</p>
                </div>
              </div>
              <button
                disabled={isTriggering}
                onClick={() => handleTriggerKeyEvent('event_reminder')}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                Push
              </button>
            </div>

            {/* Event 4: Streak Milestone */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">local_fire_department</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Study Streak Milestone
                  </h4>
                  <p className="text-[11px] text-slate-500">100% Daily Goals &amp; Streak level up</p>
                </div>
              </div>
              <button
                disabled={isTriggering}
                onClick={() => handleTriggerKeyEvent('streak_milestone')}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                Push
              </button>
            </div>

            {/* Event 5: Grade Posted */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    New Grade Posted
                  </h4>
                  <p className="text-[11px] text-slate-500">MATH 201 Problem Set score 98/100</p>
                </div>
              </div>
              <button
                disabled={isTriggering}
                onClick={() => handleTriggerKeyEvent('course_grade')}
                className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
              >
                Push
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Custom Compose */}
        {activeSubTab === 'compose' && (
          <form onSubmit={handleSendCustom} className="flex-1 overflow-y-auto mt-3 space-y-3 pr-0.5 no-scrollbar">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notification Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Lab Section Room Change"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Notification Message *
              </label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Today's 2 PM discussion moves to Science Annex 104."
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#10B981]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as PushNotification['category'])}
                  className="w-full h-9 px-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <option value="deadline">Deadline Reminder</option>
                  <option value="advisor">Advisor Update</option>
                  <option value="event">Campus Event</option>
                  <option value="streak">Study Streak</option>
                  <option value="course">Course Grade</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Destination
                </label>
                <select
                  value={customTarget}
                  onChange={(e) => setCustomTarget(e.target.value as PushNotification['targetTab'])}
                  className="w-full h-9 px-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                >
                  <option value="home">Home Tab</option>
                  <option value="tasks">Tasks Tab</option>
                  <option value="calendar">Calendar Tab</option>
                  <option value="events">Events Tab</option>
                  <option value="profile">Profile Tab</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isTriggering}
              className="w-full h-10 mt-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-md shadow-[#10B981]/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              <span>Send Live Push Broadcast</span>
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center justify-between">
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
