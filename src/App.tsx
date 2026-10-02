/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AdvisorChatModal } from './components/AdvisorChatModal';
import { EnrolledCoursesModal } from './components/EnrolledCoursesModal';
import { EventDetailModal } from './components/EventDetailModal';
import { HeaderStatusBar } from './components/HeaderStatusBar';
import { Navigation } from './components/Navigation';
import { NewTaskModal } from './components/NewTaskModal';
import { NotificationsModal } from './components/NotificationsModal';
import { PushNotificationToast } from './components/PushNotificationToast';
import { QuickAddModal } from './components/QuickAddModal';
import {
  initialCalendarEvents,
  initialCampusEvents,
  initialProfile,
  initialTasks,
} from './mockData';
import { CalendarScreen } from './screens/CalendarScreen';
import { EventsScreen } from './screens/EventsScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { TasksScreen } from './screens/TasksScreen';
import {
  fetchNotifications,
  PushNotification,
  subscribeToPushStream,
  triggerKeyEvent,
} from './services/notificationService';
import { CalendarEvent, CampusEvent, TabType, Task, UserProfile } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(initialCalendarEvents);
  const [campusEvents, setCampusEvents] = useState<CampusEvent[]>(initialCampusEvents);
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Push Notifications state
  const [pushNotifications, setPushNotifications] = useState<PushNotification[]>([]);
  const [activePushToast, setActivePushToast] = useState<PushNotification | null>(null);

  // Modals state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isEnrolledCoursesOpen, setIsEnrolledCoursesOpen] = useState(false);
  const [isAdvisorChatOpen, setIsAdvisorChatOpen] = useState(false);
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<CampusEvent | null>(null);

  // Load push notifications from backend on mount and subscribe to live SSE stream
  useEffect(() => {
    fetchNotifications().then((list) => {
      if (list && list.length > 0) {
        setPushNotifications(list);
      }
    });

    const unsubscribe = subscribeToPushStream((newNotif) => {
      setPushNotifications((prev) => [newNotif, ...prev.filter((n) => n.id !== newNotif.id)]);
      setActivePushToast(newNotif);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Refresh notifications list from server
  const handleRefreshNotifications = async () => {
    const list = await fetchNotifications();
    setPushNotifications(list);
  };

  // Toggle task completion
  const handleToggleTask = (id: string) => {
    let justCompleted = false;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          justCompleted = nextCompleted;
          return {
            ...t,
            completed: nextCompleted,
            categorySection: nextCompleted ? 'completed' : 'today',
            completedAtText: nextCompleted
              ? `Completed ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
              : undefined,
          };
        }
        return t;
      })
    );

    // Update user stats
    setUserProfile((prev) => ({
      ...prev,
      weeklyAnalytics: {
        ...prev.weeklyAnalytics,
        tasksDone: prev.weeklyAnalytics.tasksDone + 1,
      },
    }));

    // If user completed a task, trigger milestone push alert
    if (justCompleted) {
      setTimeout(() => {
        triggerKeyEvent('streak_milestone');
      }, 700);
    }
  };

  // Add new task
  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);

    // Send a push confirmation
    setTimeout(() => {
      triggerKeyEvent('deadline_urgent');
    }, 500);
  };

  // Toggle event RSVP
  const handleToggleRsvp = (eventId: string) => {
    let nowRsvpd = false;
    setCampusEvents((prev) =>
      prev.map((e) => {
        if (e.id === eventId) {
          const nextRsvp = !e.rsvpStatus;
          nowRsvpd = nextRsvp;
          return {
            ...e,
            rsvpStatus: nextRsvp,
            attendeesCount: nextRsvp ? e.attendeesCount + 1 : e.attendeesCount - 1,
          };
        }
        return e;
      })
    );

    if (nowRsvpd) {
      setTimeout(() => {
        triggerKeyEvent('event_reminder');
      }, 500);
    }
  };

  // Toggle event Save / Bookmark
  const handleToggleSaveEvent = (eventId: string) => {
    setCampusEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, isSaved: !e.isSaved } : e))
    );
  };

  // Add Campus Event to Calendar Timetable
  const handleAddEventToCalendar = (event: CampusEvent) => {
    const newCalEvent: CalendarEvent = {
      id: `cal-${Date.now()}`,
      title: event.title,
      timeRange: event.fullDateTime.split('•')[1]?.trim() || '02:00 PM – 04:00 PM',
      startHour: 14,
      durationLabel: '120 min',
      type: 'seminar',
      typeTag: event.categoryLabel,
      location: event.location,
      notes: event.description,
      dayIndex: 3, // Add to Thursday for immediate viewing in timetable
    };

    setCalendarEvents((prev) => [...prev, newCalEvent]);
  };

  // Quick Add action router
  const handleQuickAddAction = (action: 'task' | 'calendar' | 'event') => {
    if (action === 'task') {
      setIsNewTaskOpen(true);
    } else if (action === 'calendar') {
      const title = prompt('Enter study session or class name:', 'Independent Study Session');
      if (title) {
        const newCal: CalendarEvent = {
          id: `cal-${Date.now()}`,
          title,
          timeRange: '03:00 PM – 04:00 PM',
          startHour: 15,
          durationLabel: '60 min',
          type: 'study_group',
          typeTag: 'Study Session',
          location: 'Library Quiet Floor',
          dayIndex: 3,
        };
        setCalendarEvents((prev) => [...prev, newCal]);
        setActiveTab('calendar');
      }
    } else if (action === 'event') {
      const title = prompt('Enter campus gathering title:', 'Campus Hack Night');
      if (title) {
        const newEvt: CampusEvent = {
          id: `evt-${Date.now()}`,
          title,
          category: 'Clubs',
          categoryLabel: 'Club Meetup',
          dateTag: 'OCT 6',
          fullDateTime: 'Tue, Oct 6 • 6:00 PM | Tech Lounge',
          location: 'Tech Lounge 2nd Floor',
          attendeesCount: 15,
          rsvpStatus: true,
          isSaved: false,
          description: 'Peer coding session and lightning talks hosted by campus students.',
        };
        setCampusEvents((prev) => [newEvt, ...prev]);
        setActiveTab('events');
      }
    }
  };

  // Incomplete tasks count for badge
  const uncompletedCount = tasks.filter((t) => !t.completed).length;
  // Unread push notifications count
  const unreadPushCount = pushNotifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-[#0F172A] dark:text-[#EEF0FF] flex flex-col font-sans transition-colors duration-200">
      {/* Floating Push Notification Toast Banner */}
      <PushNotificationToast
        notification={activePushToast}
        onDismiss={() => setActivePushToast(null)}
        onActionClick={(targetTab) => {
          setActiveTab(targetTab);
        }}
      />

      {/* Top Header & Status Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#F8FAFC]/90 dark:bg-[#0B0F19]/90 backdrop-blur-md pt-safe border-b border-slate-100/50 dark:border-slate-800/50 shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="max-w-[430px] mx-auto">
          <HeaderStatusBar
            showDynamicIsland={activeTab === 'events'}
            time="9:41"
            isDarkMode={isDarkMode}
          />

          {/* Dedicated Profile Header bar as shown in Profile stitch screenshot */}
          {activeTab === 'profile' && (
            <div className="h-14 px-4 flex items-center justify-between border-t border-slate-100/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#10B981] flex items-center justify-center text-white shadow-xs">
                  <span className="material-symbols-outlined text-[18px]">school</span>
                </div>
                <span className="text-base font-bold text-[#131b2e] dark:text-white">Profile</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Push notifications hub"
                  onClick={() => setIsNotificationsOpen(true)}
                  className="relative w-9 h-9 flex items-center justify-center rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  {unreadPushCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444]" />
                  )}
                </button>
                <div className="w-8 h-8 rounded-full overflow-hidden shadow-xs ring-1 ring-slate-200 dark:ring-slate-700">
                  <img
                    alt={userProfile.name}
                    className="w-full h-full object-cover"
                    src={userProfile.avatarUrl}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Screen Router */}
      <div className="flex-1 flex flex-col relative w-full">
        {activeTab === 'home' && (
          <HomeScreen
            userProfile={userProfile}
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onNavigateTab={setActiveTab}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            unreadNotificationsCount={unreadPushCount}
          />
        )}

        {activeTab === 'tasks' && (
          <TasksScreen
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onOpenNewTaskModal={() => setIsNewTaskOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarScreen
            events={calendarEvents}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'events' && (
          <EventsScreen
            events={campusEvents}
            onToggleRsvp={handleToggleRsvp}
            onToggleSave={handleToggleSaveEvent}
            onSelectEvent={(evt) => setSelectedEventForDetail(evt)}
            onOpenQuickAdd={() => setIsQuickAddOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            userProfile={userProfile}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
            onOpenEnrolledCourses={() => setIsEnrolledCoursesOpen(true)}
            onOpenAdvisorChat={() => setIsAdvisorChatOpen(true)}
            onOpenSettings={() => setIsNotificationsOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        )}
      </div>

      {/* Floating Action Button (FAB) present across screens */}
      {activeTab !== 'profile' && (
        <div className="fixed bottom-24 right-5 z-40">
          <button
            type="button"
            aria-label="Add new task or event"
            onClick={() => setIsQuickAddOpen(true)}
            className="w-14 h-14 rounded-full bg-[#10B981] hover:bg-[#059669] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(16,185,129,0.4)] active:scale-90 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[28px] font-bold">add</span>
          </button>
        </div>
      )}

      {/* Sticky Bottom Navigation Bar (5 Tabs) */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tasksBadgeCount={uncompletedCount}
      />

      {/* Modals & Action Drawers */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onSelectAction={handleQuickAddAction}
      />

      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Push Notifications Hub & Key Events Trigger Center */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={pushNotifications}
        onRefreshNotifications={handleRefreshNotifications}
        onNavigateTab={setActiveTab}
      />

      <EnrolledCoursesModal
        isOpen={isEnrolledCoursesOpen}
        onClose={() => setIsEnrolledCoursesOpen(false)}
      />

      <AdvisorChatModal
        isOpen={isAdvisorChatOpen}
        onClose={() => setIsAdvisorChatOpen(false)}
      />

      <EventDetailModal
        event={selectedEventForDetail}
        onClose={() => setSelectedEventForDetail(null)}
        onToggleRsvp={handleToggleRsvp}
        onToggleSave={handleToggleSaveEvent}
        onAddToCalendar={handleAddEventToCalendar}
      />
    </div>
  );
}
