'use client';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import { SocketContext } from '@/providers/socket-provider';

export interface Notification {
  title: string;
  message: string;
  data?: any;
  type?: 'global' | 'personal';
}

export function useNotifications() {
  const { socket } = useContext(SocketContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleGlobal = (notif: Notification) =>
      setNotifications((prev) => [...prev, { ...notif, type: 'global' }]);

    const handlePersonal = (notif: Notification) =>
      setNotifications((prev) => [...prev, { ...notif, type: 'personal' }]);

    socket.on('notifications:global', handleGlobal);
    socket.on('notifications:personal', handlePersonal);

    return () => {
      socket.off('notifications:global', handleGlobal);
      socket.off('notifications:personal', handlePersonal);
    };
  }, [socket]);

  return { notifications };
}
