'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardCards() {
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading (for now)
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // --- Dummy Data (to be replaced with real API data later) ---
  const data = [
    {
      title: 'Total Assets',
      value: '1,250',
      trend: '+12.5%',
      trendUp: true,
      subtitle: 'Inventory growth this month',
      description: 'Includes all registered assets',
    },
    {
      title: 'Checked-Out Items',
      value: '345',
      trend: '-8%',
      trendUp: false,
      subtitle: 'Slight decrease in usage',
      description: 'Fewer assets currently borrowed',
    },
    {
      title: 'Maintenance Requests',
      value: '27',
      trend: '+18%',
      trendUp: true,
      subtitle: 'Increase in reported issues',
      description: 'System is tracking all open requests',
    },
    {
      title: 'Depreciation Rate',
      value: '4.3%',
      trend: '+1.2%',
      trendUp: true,
      subtitle: 'Consistent asset value tracking',
      description: 'Based on average lifecycle data',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* --- Page Title --- */}
      <h2 className="text-2xl font-semibold text-zinc-800 dark:text-white mb-6">
        Asset Inventory Overview
      </h2>

      {/* --- Dashboard Cards --- */}
      <div className="grid grid-cols-1 max-md:grid-cols-1 max-lg:grid-cols-2 lg:grid-cols-4 gap-6 w-full ">
        {isLoading
          ? [...Array(4)].map((_, i) => (
              <Card
                key={i}
                className="bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shadow-lg"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-12 rounded-md" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-3 w-40" />
                </CardContent>
              </Card>
            ))
          : data.map((item, i) => (
              <Card
                key={i}
                className="bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-lg hover:scale-105 transition-transform duration-200"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {item.title}
                  </CardTitle>
                  <div
                    className={`text-xs px-2 py-1 rounded-md flex items-center gap-1 ${
                      item.trendUp
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}
                  >
                    {item.trendUp ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {item.trend}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <p
                    className={`text-sm font-medium mt-1 flex items-center gap-1 ${
                      item.trendUp
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-red-700 dark:text-red-400'
                    }`}
                  >
                    {item.subtitle}{' '}
                    {item.trendUp ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* --- Info / Disclaimer --- */}
      <p className="text-xs text-zinc-600 dark:text-zinc-500 mt-6 text-center">
        ⚠️ This is dummy data for presentation and UI demonstration purposes
        only.
      </p>
    </div>
  );
}
