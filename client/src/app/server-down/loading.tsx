'use client';

import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        <Card className="border-gray-200 dark:border-gray-700 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Skeleton className="w-20 h-20 rounded-full" />
            </div>
            <CardTitle>
              <Skeleton className="h-8 w-60 mx-auto" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-48 mx-auto mt-2" />
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-32 mx-auto" />
          </CardContent>
        </Card>

        <div className="text-center">
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    </div>
  );
}
