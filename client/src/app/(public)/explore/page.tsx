import React from 'react';
import ExplorePageContent from '@/components/pages/explore-page.content';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Page',
  description:
    'Discover the features and functionality of the Smart Fishpond system, and see how it monitors water quality and manages aeration in real time.',
};

export default function ExplorePage() {
  return (
    <div>
      <ExplorePageContent />
    </div>
  );
}
