//src/providers/socket-provider.tsx

'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { io, Socket } from 'socket.io-client';

export interface OnlineUser {
  userId?: string;
  username?: string;
  connectedAt: string;
}

export interface Notification {
  title: string;
  description?: string;
  data?: any;
  severity?: string;
  timestamp?: number;
  [key: string]: any;
}

interface SocketContextType {
  socket: Socket | null;
  onlineUsers: OnlineUser[];
  notifications: Notification[];
  shownNotificationIds: Set<string>;
  disconnectUser: () => void;
  notificationCount: number;
  setNotificationCount: React.Dispatch<React.SetStateAction<number>>;
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  onlineUsers: [],
  notifications: [],
  shownNotificationIds: new Set(),
  disconnectUser: () => {},
  notificationCount: 0,
  setNotificationCount: () => {},
});

let globalSocket: Socket | null = null;
let globalOnlineUsers: OnlineUser[] = [];
let globalNotifications: Notification[] = [];
let globalShownNotificationIds = new Set<string>();
let subscribers: ((users: OnlineUser[]) => void)[] = [];
let notificationSubscribers: ((notifs: Notification[]) => void)[] = [];

export function SocketProvider({ children }: { children: ReactNode }) {
  const [onlineUsers, setOnlineUsers] =
    useState<OnlineUser[]>(globalOnlineUsers);
  const [notifications, setNotifications] =
    useState<Notification[]>(globalNotifications);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const userData = localStorage.getItem('user');
    if (!userData) return;
    const { id: userId, username } = JSON.parse(userData);

    if (!globalSocket) {
      const socket = io(
        process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3005',
        {
          transports: ['websocket'],
          auth: { userId, username },
        },
      );

      socket.on('connect', () => console.log('Socket connected', socket.id));
      socket.on('connect_error', (err) => console.error('Socket error', err));

      // Subscribe **before requesting** the list
      // Update online users
      socket.on('users:online', (users: OnlineUser[]) => {
        globalOnlineUsers = users;
        subscribers.forEach((cb) => cb(users));
      });

      // Listen for global notifications - ADD TIMESTAMP HERE
      socket.on('notifications:global', (notif: Notification) => {
        const notifWithTimestamp = {
          ...notif,
          timestamp: notif.timestamp || Date.now(),
        };
        globalNotifications = [notifWithTimestamp, ...globalNotifications];
        notificationSubscribers.forEach((cb) => cb(globalNotifications));
        setNotificationCount((prev) => prev + 1);
      });

      // Listen for personal notifications - ADD TIMESTAMP HERE
      socket.on('notifications:personal', (notif: Notification) => {
        const notifWithTimestamp = {
          ...notif,
          timestamp: notif.timestamp || Date.now(),
        };
        globalNotifications = [notifWithTimestamp, ...globalNotifications];
        notificationSubscribers.forEach((cb) => cb(globalNotifications));
        setNotificationCount((prev) => prev + 1);
      });

      globalSocket = socket;
    }

    // Subscribe local component to updates
    const userSubscriber = (users: OnlineUser[]) => setOnlineUsers(users);
    const notifSubscriber = (notifs: Notification[]) =>
      setNotifications(notifs);

    subscribers.push(userSubscriber);
    notificationSubscribers.push(notifSubscriber);

    setOnlineUsers(globalOnlineUsers);
    setNotifications(globalNotifications);

    return () => {
      subscribers = subscribers.filter((cb) => cb !== userSubscriber);
      notificationSubscribers = notificationSubscribers.filter(
        (cb) => cb !== notifSubscriber,
      );
    };
  }, []);

  const disconnectUser = () => {
    if (!globalSocket) return;

    globalSocket.disconnect();
    globalSocket = null;

    globalOnlineUsers = [];
    globalNotifications = [];
    globalShownNotificationIds.clear();
    subscribers.forEach((cb) => cb(globalOnlineUsers));
    notificationSubscribers.forEach((cb) => cb(globalNotifications));
  };

  return (
    <SocketContext.Provider
      value={{
        socket: globalSocket,
        onlineUsers,
        notifications,
        shownNotificationIds: globalShownNotificationIds,
        disconnectUser,
        notificationCount,
        setNotificationCount,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

// Hook for components
export function useOnlineUsers() {
  const { onlineUsers, disconnectUser } = useContext(SocketContext);
  return { onlineUsers, disconnectUser };
}

// Hook for notifications
export function useNotifications() {
  const {
    notifications,
    shownNotificationIds,
    notificationCount,
    setNotificationCount,
  } = useContext(SocketContext);
  return {
    notifications,
    shownNotificationIds,
    notificationCount,
    setNotificationCount,
  };
}

// Helper to mark notification as shown
export function markNotificationAsShown(id: string) {
  globalShownNotificationIds.add(id);
}
