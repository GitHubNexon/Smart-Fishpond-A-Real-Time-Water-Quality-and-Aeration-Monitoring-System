import React from 'react';
import HelpPageContent from '@/components/pages/help-page.content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Help Page',
  description:
    'Access guides and instructions on how to use the Smart Fishpond system effectively, including monitoring sensors and managing aeration.',
};

export default function HelpPage() {
  return (
    <div>
      <HelpPageContent />
    </div>
  );
}
