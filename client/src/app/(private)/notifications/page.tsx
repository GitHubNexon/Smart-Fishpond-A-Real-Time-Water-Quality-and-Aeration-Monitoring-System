import React from 'react';
import type { Metadata } from 'next';
import NotificationComponent from './components/notification.component';

export const metadata: Metadata = {
  title: 'Notifications | RVTM AMS',
  description:
    'Stay updated with real-time notifications and alerts from the RVTM AMS system.',
};

export default function NotificationPage() {
  return <NotificationComponent />;
}
