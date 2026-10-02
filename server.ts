import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  category: 'deadline' | 'advisor' | 'event' | 'streak' | 'course';
  icon: string;
  timestamp: string;
  targetTab: 'home' | 'tasks' | 'calendar' | 'events' | 'profile';
  read: boolean;
}

// In-memory notifications store with seed academic alerts
let notificationsStore: NotificationItem[] = [
  {
    id: 'push-seed-1',
    title: '⏰ CS101 Midterm Quiz in 2h',
    body: 'Review Chapters 1–4. Lecture Hall 101 doors open at 9:45 AM.',
    category: 'deadline',
    icon: 'alarm',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    targetTab: 'tasks',
    read: false,
  },
  {
    id: 'push-seed-2',
    title: '💬 Dr. Vance (Academic Advisor)',
    body: 'Your Spring 2025 degree audit clearance has been approved! Ready for registration.',
    category: 'advisor',
    icon: 'chat',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    targetTab: 'profile',
    read: false,
  },
  {
    id: 'push-seed-3',
    title: '🎉 Campus Hackathon 2026',
    body: '350+ students registered! Hardware lab kit pickup starts Friday at Student Union.',
    category: 'event',
    icon: 'celebration',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    targetTab: 'events',
    read: true,
  },
  {
    id: 'push-seed-4',
    title: '🔥 5-Day Study Streak Maintained!',
    body: 'Awesome work! You logged 18.5 hours this week, placing you in top 10% campus.',
    category: 'streak',
    icon: 'local_fire_department',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    targetTab: 'home',
    read: true,
  },
];

// Active Server-Sent Events (SSE) clients for real-time push streaming
type SSEClient = {
  id: string;
  res: Response;
};
let sseClients: SSEClient[] = [];

// Broadcast notification to all connected SSE push streams
function broadcastPushNotification(notification: NotificationItem) {
  const payload = `data: ${JSON.stringify(notification)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.res.write(payload);
    } catch {
      // client disconnected
    }
  });
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // --- API Endpoints ---

  // 1. Get all notifications
  app.get('/api/notifications', (req: Request, res: Response) => {
    res.json({
      success: true,
      notifications: notificationsStore,
    });
  });

  // 2. Mark notification as read
  app.post('/api/notifications/:id/read', (req: Request, res: Response) => {
    const { id } = req.params;
    notificationsStore = notificationsStore.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    res.json({ success: true });
  });

  // 3. Mark all notifications as read
  app.post('/api/notifications/read-all', (req: Request, res: Response) => {
    notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
    res.json({ success: true });
  });

  // 4. Send/Broadcast a new push notification from backend
  app.post('/api/notifications/send', (req: Request, res: Response) => {
    const { title, body, category, targetTab, icon } = req.body;

    if (!title || !body) {
      res.status(400).json({ error: 'title and body are required' });
      return;
    }

    const newNotification: NotificationItem = {
      id: `push-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title,
      body,
      category: category || 'deadline',
      icon: icon || (category === 'advisor' ? 'chat' : category === 'event' ? 'celebration' : 'notifications'),
      timestamp: new Date().toISOString(),
      targetTab: targetTab || 'home',
      read: false,
    };

    notificationsStore.unshift(newNotification);
    broadcastPushNotification(newNotification);

    res.status(201).json({
      success: true,
      notification: newNotification,
    });
  });

  // 5. Trigger predefined Key Events
  app.post('/api/notifications/trigger-event', (req: Request, res: Response) => {
    const { eventType } = req.body;

    let notificationData: Partial<NotificationItem> = {};

    switch (eventType) {
      case 'deadline_urgent':
        notificationData = {
          title: '⚠️ Urgent: CS101 Midterm Quiz in 1h',
          body: 'Chapters 1–4 Multiple Choice test begins at 10:00 AM. Room 304 opens in 30 minutes.',
          category: 'deadline',
          icon: 'alarm',
          targetTab: 'tasks',
        };
        break;

      case 'advisor_reply':
        notificationData = {
          title: '💬 Dr. Vance: Academic Consultation',
          body: 'I have added the CS 301 course override for next semester. Check your degree portal!',
          category: 'advisor',
          icon: 'chat',
          targetTab: 'profile',
        };
        break;

      case 'event_reminder':
        notificationData = {
          title: '🎟️ Fall Campus Music Festival Starts in 3h',
          body: 'Quad Lawn stage soundchecks underway! Free student admission with CampusBuddy ID.',
          category: 'event',
          icon: 'celebration',
          targetTab: 'events',
        };
        break;

      case 'streak_milestone':
        notificationData = {
          title: '🔥 Daily Goal Achieved: 100%!',
          body: 'You crushed all today’s assignments! 6-Day Study Streak streak unlocked.',
          category: 'streak',
          icon: 'local_fire_department',
          targetTab: 'home',
        };
        break;

      case 'course_grade':
        notificationData = {
          title: '🎓 New Grade Posted: MATH 201',
          body: 'Linear Transformations Problem Set 4 scored 98/100 (A+). Great work!',
          category: 'course',
          icon: 'school',
          targetTab: 'tasks',
        };
        break;

      default:
        notificationData = {
          title: '🔔 CampusBuddy Announcement',
          body: 'Library extended study floors 3 & 4 open 24/7 this week for midterm preparation.',
          category: 'deadline',
          icon: 'notifications',
          targetTab: 'home',
        };
    }

    const newNotification: NotificationItem = {
      id: `push-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: notificationData.title!,
      body: notificationData.body!,
      category: notificationData.category as NotificationItem['category'],
      icon: notificationData.icon!,
      timestamp: new Date().toISOString(),
      targetTab: notificationData.targetTab as NotificationItem['targetTab'],
      read: false,
    };

    notificationsStore.unshift(newNotification);
    broadcastPushNotification(newNotification);

    res.json({
      success: true,
      message: `Triggered event "${eventType}" successfully`,
      notification: newNotification,
    });
  });

  // 6. Real-time Push SSE Stream (Server-Sent Events)
  app.get('/api/notifications/stream', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const clientId = `client-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newClient: SSEClient = { id: clientId, res };
    sseClients.push(newClient);

    // Initial keep-alive ping
    res.write(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`);

    req.on('close', () => {
      sseClients = sseClients.filter((c) => c.id !== clientId);
    });
  });

  // --- Vite Middlewares for Development / Static Hosting for Production ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CampusBuddy server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
