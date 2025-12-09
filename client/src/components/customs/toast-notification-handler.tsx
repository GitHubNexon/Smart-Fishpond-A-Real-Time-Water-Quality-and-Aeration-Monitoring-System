// src/components/notifications/toast-notification-handler.tsx
'use client';

import { useEffect } from 'react';
import {
  useNotifications,
  markNotificationAsShown,
  Notification,
} from '@/providers/socket-provider';
import { toast } from '@/components/ui/sonner';

interface ToastNotificationHandlerProps {
  /** Custom handler for notifications. If not provided, uses default toast behavior */
  onNotification?: (notification: Notification) => void;
  /** Filter function to determine which notifications to show */
  filter?: (notification: Notification) => boolean;
  /** Position of the toast (if using default handler) */
  position?:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'top-center'
    | 'bottom-center';
}

export default function ToastNotificationHandler({
  onNotification,
  filter,
  position = 'top-right',
}: ToastNotificationHandlerProps = {}) {
  const { notifications, shownNotificationIds } = useNotifications();

  useEffect(() => {
    notifications.forEach((notif) => {
      const key = `${notif.title}-${notif.description}-${notif.timestamp}`;

      // Skip if already shown
      if (shownNotificationIds.has(key)) return;

      // Apply filter if provided
      if (filter && !filter(notif)) return;

      // Mark as shown
      markNotificationAsShown(key);

      // Use custom handler or default toast
      if (onNotification) {
        onNotification(notif);
      } else {
        // Build description with extra data if available
        let description = notif.description || '';
        if (notif.data?.author?.fullname) {
          description += ` ${notif.data.author.fullname}`;
        }

        // Default behavior: show toast based on severity

        const toastConfig = {
          title: notif.title,
          description,
          position,
        };

        // Map severity to success/error (your toast only has these two)
        const severity = notif.severity?.toLowerCase();
        if (
          severity === 'error' ||
          severity === 'critical' ||
          severity === 'warning'
        ) {
          toast.error(toastConfig);
        } else {
          // Default to success for info, success, or undefined severity
          toast.success(toastConfig);
        }
      }
    });
  }, [notifications, shownNotificationIds, onNotification, filter, position]);

  return null;
}

// Pre-configured handlers for common use cases
export function ErrorToastHandler(
  props?: Omit<ToastNotificationHandlerProps, 'filter'>,
) {
  return (
    <ToastNotificationHandler
      {...props}
      filter={(notif) =>
        notif.severity?.toLowerCase() === 'error' ||
        notif.severity?.toLowerCase() === 'critical'
      }
    />
  );
}

export function WarningToastHandler(
  props?: Omit<ToastNotificationHandlerProps, 'filter'>,
) {
  return (
    <ToastNotificationHandler
      {...props}
      filter={(notif) => notif.severity?.toLowerCase() === 'warning'}
    />
  );
}

export function InfoToastHandler(
  props?: Omit<ToastNotificationHandlerProps, 'filter'>,
) {
  return (
    <ToastNotificationHandler
      {...props}
      filter={(notif) =>
        notif.severity?.toLowerCase() === 'info' ||
        notif.severity?.toLowerCase() === 'success' ||
        !notif.severity
      }
    />
  );
}
