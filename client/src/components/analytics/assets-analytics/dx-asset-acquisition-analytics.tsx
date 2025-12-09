//src/components/analytics/asset-analytics/asset-acquistion-analytics.tsx
'use client';

import React, { useEffect, useState, useMemo } from 'react';
import {
  getAssetAcquisitionDateAnalytics,
  AssetAcquisitionDateAnalytics,
} from '@/api/protected/assets-api/asset-analytics.api';
import LongBarCharts from '@/components/customs/charts/long-bar-chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export default function DXAssetAcquisitionAnalytics() {
  const [data, setData] = useState<AssetAcquisitionDateAnalytics[]>([]);
  const [allData, setAllData] = useState<AssetAcquisitionDateAnalytics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const handleClearFilters = () => {
    setSelectedYear('all');
    setSelectedMonth('all');
  };
  const hasActiveFilters = selectedYear !== 'all' || selectedMonth !== 'all';

  // Fetch all data initially to extract available years
  useEffect(() => {
    async function fetchAllData() {
      try {
        setLoading(true);
        const response = await getAssetAcquisitionDateAnalytics();
        setAllData(response);
        setData(response);
      } catch (err) {
        setError('Failed to load asset acquisition analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  // Extract unique years from all data
  const years = useMemo(() => {
    const yearSet = new Set<string>();
    allData.forEach((item) => {
      const parts = item.month.split('-');
      const year = parts[0];
      yearSet.add(year);
    });
    return Array.from(yearSet).sort();
  }, [allData]);

  // Fetch filtered data when filters change
  useEffect(() => {
    async function fetchFilteredData() {
      try {
        setLoading(true);
        const month = selectedMonth !== 'all' ? selectedMonth : undefined;
        const year = selectedYear !== 'all' ? selectedYear : undefined;

        const response = await getAssetAcquisitionDateAnalytics(month, year);
        setData(response);
      } catch (err) {
        setError('Failed to load asset acquisition analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    // Only fetch if we have initial data
    if (allData.length > 0) {
      fetchFilteredData();
    }
  }, [selectedYear, selectedMonth, allData.length]);

  const handleYearChange = (value: string) => {
    setSelectedYear(value);
  };

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value);
  };

  if (loading && allData.length === 0) {
    return (
      <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="flex gap-4">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>

        <Skeleton className="h-96 w-full" />

        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !data || (data.length === 0 && allData.length === 0)) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-500">{error || 'No data available'}</p>
      </div>
    );
  }

  // Calculate total acquisitions
  const totalAcquisitions = data.reduce((sum, item) => sum + item.count, 0);

  // Find peak month
  const peakMonth =
    data.length > 0
      ? data.reduce(
          (max, item) => (item.count > max.count ? item : max),
          data[0],
        )
      : null;

  return (
    <div className="w-full p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">
          Asset Acquisition Timeline
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Number of assets acquired per month
        </p>
      </div>

      <div className="flex gap-4">
        <Select value={selectedYear} onValueChange={handleYearChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedMonth} onValueChange={handleMonthChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            {MONTHS.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="flex items-center gap-2 p-4.5"
          >
            <X className="h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
        </div>
      ) : data.length > 0 ? (
        <>
          <LongBarCharts
            data={data}
            bars={[
              {
                dataKey: 'count',
                fill: '#8884d8',
                name: 'Assets Acquired',
              },
            ]}
            xAxisKey="month"
            title=""
            height={400}
            showLegend={false}
            showGrid={true}
            xAxisLabel="Month"
            yAxisLabel="Number of Assets"
            tooltipFormatter={(value, name) => `${value} assets`}
          />


        </>
      ) : (
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">
            No data available for the selected filters
          </p>
        </div>
      )}
    </div>
  );
}
