export interface PushNotification {
  id: string;
  title: string;
  body: string;
  category: 'deadline' | 'advisor' | 'event' | 'streak' | 'course';
  icon: string;
  timestamp: string;
  targetTab: 'home' | 'tasks' | 'calendar' | 'events' | 'profile';
  read: boolean;
}

// Gentle pleasant Web Audio chime synthesizer
function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Tone 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    gain1.gain.setValueAtTime(0.12, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Tone 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
    gain2.gain.setValueAtTime(0.15, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.55);
  } catch {
    // Audio context may be restricted before user gesture
  }
}

// Check notification permission
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

// Request notification permission
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

// Show native OS notification if permitted
export function showNativeNotification(title: string, body: string, icon = 'https://lh3.googleusercontent.com/aida/AEtjO1XNPYyiiR1gF6FInkgvRZnv9wBtQ3VjaBDLTzOsDjLz6MgW7eM-5VCrGWDOD2uvslDp5GTm_UjN_y7goN3xwvE53dU7lUdTemJ7dXHAjpbM1fzqnFEI-m02vaUKBY5_GYXIJ0jUhXLUHY-OD3PpIppoJayuzZcp_fzI6HDBlRZypU8EaVuVToT2NTybal2zWweRMHKyjRcv2iDS6TjnOaMoWiwp7Xu3l895OTVRPChs8NAIIBv1z8c4VwI') {
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon,
        badge: icon,
      });
    } catch {
      // Fallback inside sandboxed iframes
    }
  }
}

// Fetch all notifications from backend
export async function fetchNotifications(): Promise<PushNotification[]> {
  try {
    const res = await fetch('/api/notifications');
    const data = await res.json();
    return data.notifications || [];
  } catch (err) {
    console.error('Error fetching notifications:', err);
    return [];
  }
}

// Mark single notification as read
export async function markNotificationAsRead(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    const data = await res.json();
    return data.success;
  } catch {
    return false;
  }
}

// Mark all as read
export async function markAllNotificationsAsRead(): Promise<boolean> {
  try {
    const res = await fetch('/api/notifications/read-all', { method: 'POST' });
    const data = await res.json();
    return data.success;
  } catch {
    return false;
  }
}

// Trigger predefined key events from server
export async function triggerKeyEvent(
  eventType: 'deadline_urgent' | 'advisor_reply' | 'event_reminder' | 'streak_milestone' | 'course_grade'
): Promise<PushNotification | null> {
  try {
    const res = await fetch('/api/notifications/trigger-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType }),
    });
    const data = await res.json();
    return data.notification || null;
  } catch (err) {
    console.error('Error triggering push event:', err);
    return null;
  }
}

// Send custom notification through server
export async function sendCustomNotification(payload: {
  title: string;
  body: string;
  category?: PushNotification['category'];
  targetTab?: PushNotification['targetTab'];
}): Promise<PushNotification | null> {
  try {
    const res = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data.notification || null;
  } catch (err) {
    console.error('Error sending custom push notification:', err);
    return null;
  }
}

// Subscribe to real-time push stream via SSE
export function subscribeToPushStream(onNotificationReceived: (notification: PushNotification) => void) {
  if (typeof window === 'undefined' || !('EventSource' in window)) {
    return () => {};
  }

  const eventSource = new EventSource('/api/notifications/stream');

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data && data.id && data.title) {
        playNotificationChime();
        showNativeNotification(data.title, data.body);
        onNotificationReceived(data as PushNotification);
      }
    } catch {
      // heartbeats or connect messages
    }
  };

  eventSource.onerror = () => {
    // Reconnects automatically
  };

  return () => {
    eventSource.close();
  };
}
