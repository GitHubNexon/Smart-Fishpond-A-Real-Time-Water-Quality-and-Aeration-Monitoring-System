'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  getAssetAcquisitionDateAnalytics,
  AssetAcquisitionDateAnalytics,
} from '@/api/protected/assets-api/asset-analytics.api';
import HorizontalBarCharts from '@/components/customs/charts/horizontal-bar-chart';
import { Skeleton } from '@/components/ui/skeleton';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

interface MonthlyAggregatedData {
  month: string;
  count: number;
  monthNumber: number;
}

export default function MBAssetAcquisitionAnalytics() {
  const [allData, setAllData] = useState<AssetAcquisitionDateAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data without filters
  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        const response = await getAssetAcquisitionDateAnalytics();
        setAllData(response);
      } catch (err) {
        setError('Failed to load asset acquisition analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  // Aggregate data by month across all years
  const aggregatedData = useMemo(() => {
    if (!allData || allData.length === 0) return [];

    // Create a map to store aggregated counts by month
    const monthMap = new Map<number, number>();

    // Initialize all 12 months with 0
    for (let i = 1; i <= 12; i++) {
      monthMap.set(i, 0);
    }

    // Aggregate counts by month
    allData.forEach((item) => {
      // Parse the month string (assuming format: "YYYY-MM" or "YYYY-M")
      const parts = item.month.split('-');
      const monthNumber = parseInt(parts[1], 10);

      const currentCount = monthMap.get(monthNumber) || 0;
      monthMap.set(monthNumber, currentCount + item.count);
    });

    // Convert map to array and sort by month
    const result: MonthlyAggregatedData[] = [];
    for (let i = 1; i <= 12; i++) {
      result.push({
        month: MONTH_NAMES[i - 1],
        count: monthMap.get(i) || 0,
        monthNumber: i,
      });
    }

    return result;
  }, [allData]);

  // Calculate total acquisitions
  const totalAcquisitions = aggregatedData.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  // Find peak month
  const peakMonth =
    aggregatedData.length > 0
      ? aggregatedData.reduce(
          (max, item) => (item.count > max.count ? item : max),
          aggregatedData[0],
        )
      : null;

  if (loading) {
    return (
      <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-80 w-full" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error || !aggregatedData || aggregatedData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 text-sm">{error || 'No data available'}</p>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow space-y-4">
      <div>
        <h3 className="text-base font-semibold mb-1">
          Asset Acquisition by Month (All Years Combined)
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Total assets acquired per month across all years
        </p>
      </div>

      <HorizontalBarCharts
        data={aggregatedData}
        bars={[
          {
            dataKey: 'count',
            fill: '#8884d8',
            name: 'Assets Acquired',
          },
        ]}
        yAxisKey="month"
        title=""
        height={350}
        showLegend={false}
        showGrid={true}
        xAxisLabel="Number of Assets"
        yAxisLabel=""
        tooltipFormatter={(value, name) => `${value} assets`}
      />


    </div>
  );
}
