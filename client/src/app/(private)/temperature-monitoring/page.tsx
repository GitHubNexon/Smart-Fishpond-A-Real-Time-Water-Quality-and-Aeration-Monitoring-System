import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TemperatueContent from './components/temperature.content';
import { AlertCircle } from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Temperature Monitoring',
  description:
    'Track water temperature in real time to ensure optimal conditions for your fish.',
};

export default function TemperatureMonitoringPage() {
  return (
    <div>
      <TemperatueContent />
    </div>
  );
}
