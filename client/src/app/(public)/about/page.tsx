import React from "react";
import AboutPageContent from "@/components/pages/about-page-content";

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Page',
  description:
    'Learn about the Smart Fishpond system, its features, and how it helps maintain optimal water quality and fish health.',
};

export default function page() {
  return (
    <div>
      <AboutPageContent />
    </div>
  );
}
