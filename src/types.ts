export type TabType = 'home' | 'tasks' | 'calendar' | 'events' | 'profile';

export type CourseCategory = 'All' | 'CS 101' | 'MATH 201' | 'ENG 110' | 'Personal' | 'BIO 110';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  course: 'CS 101' | 'MATH 201' | 'ENG 110' | 'Personal' | 'BIO 110';
  categorySection: 'overdue' | 'today' | 'upcoming' | 'completed';
  dueDateText: string;
  priority: 'High' | 'Med' | 'Normal' | 'Medium Priority';
  completed: boolean;
  completedAtText?: string;
  subtasks?: Subtask[];
  commentsCount?: number;
  attachment?: string;
  collaborator?: string;
  courseBadgeClass?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  timeRange: string;
  startHour: number;
  durationLabel: string;
  type: 'lecture' | 'seminar' | 'study_group' | 'office_hours' | 'free_interval';
  typeTag: string;
  location: string;
  locationDetail?: string;
  instructor?: {
    name: string;
    avatar: string;
  };
  membersCount?: number;
  notes?: string;
  dayIndex: number; // 0=Mon 28, 1=Tue 29, 2=Wed 30, 3=Thu 1, 4=Fri 2, 5=Sat 3, 6=Sun 4
}

export interface CampusEvent {
  id: string;
  title: string;
  category: 'Clubs' | 'Academic' | 'Career' | 'Social & Parties';
  categoryLabel: string;
  dateTag: string;
  fullDateTime: string;
  location: string;
  attendeesCount: number;
  attendeesAvatars?: string[];
  isFeatured?: boolean;
  imageUrl?: string;
  iconName?: string;
  rsvpStatus: boolean;
  isSaved: boolean;
  description: string;
  organizer?: string;
}

export interface UserProfile {
  name: string;
  major: string;
  classYear: string;
  academicStanding: string;
  honors: string;
  studentId: string;
  streakDays: number;
  streakLevel: number;
  weeklyStreak: { day: string; state: 'done' | 'active' | 'locked' }[];
  weeklyAnalytics: {
    tasksDone: number;
    tasksDoneDiff: string;
    studyLoggedHours: number;
    studyCampusRank: string;
    onTimeRate: number;
    onTimeSubtext: string;
    targetGpa: string;
    currentGpa: string;
    gpaStatus: string;
  };
  avatarUrl: string;
  enrolledCourses: string[];
  notificationPreference: string;
  syncCalendars: string;
  darkMode: boolean;
}
