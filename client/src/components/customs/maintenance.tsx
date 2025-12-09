'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function MaintenancePage() {
  const endTime = process.env.NEXT_PUBLIC_END_TIME || process.env.END_TIME;
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    const end = new Date(endTime as string).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = end - now;

      if (diff <= 0) {
        setRemaining(
          'The maintenance period has concluded. The system is currently restarting and will be available shortly. Thank you for your patience.',
        );
        clearInterval(interval);
        return;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      setRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white text-center px-4">
      <Card className="bg-gray-800 border-gray-700 p-8 max-w-md mx-auto rounded-2xl shadow-lg">
        <CardContent>
          <h1 className="text-4xl font-bold mb-2">
            🛠️ System Under Maintenance
          </h1>
          <Separator className="my-4 bg-gray-600" />
          <p className="text-lg mb-6">
            We’re performing scheduled maintenance. We’ll be back soon!
          </p>
          <div className="text-2xl font-mono mb-4">{remaining}</div>
          <p className="text-sm text-gray-400">
            Expected back at: {new Date(endTime || '').toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
