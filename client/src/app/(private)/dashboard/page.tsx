import React from 'react';
import DashboardPageContent from './components/dashboard-page.content';
import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | RVTM AMS',
  description: 'View analytics, stats, and system overview',
};

export default function DashboardPage() {
  return (
    // <div>
    //   <DashboardPageContent />
    // </div>
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-[400px] text-center shadow-lg">
        <CardHeader>
          <AlertCircle className="mx-auto mb-2 text-red-500" size={48} />
          <CardTitle>Work in Progress</CardTitle>
        </CardHeader>
        <CardContent>
          This page is currently under development. Please check back later.
        </CardContent>
      </Card>
    </div>
  );
}
