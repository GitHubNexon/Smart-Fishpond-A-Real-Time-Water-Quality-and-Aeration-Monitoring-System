//src/components/analytics/asset-analytics/asset-status-analytics.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  getAssetStatusAnalytics,
  StatusAnalyticResponse,
} from '@/api/protected/assets-api/asset-analytics.api';
import PieCharts from '@/components/customs/charts/pie-chart';

export default function AssetStatusAnalytics() {
  const [data, setData] = useState<StatusAnalyticResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await getAssetStatusAnalytics();
        setData(response);
      } catch (err) {
        setError('Failed to load asset status analytics');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-500">{error || 'No data available'}</p>
      </div>
    );
  }

  const chartData = [
    { name: 'Draft', value: Number(data.draftCount), color: '#ffc658' },
    { name: 'Verified', value: Number(data.verifiedCount), color: '#82ca9d' },
    { name: 'Approved', value: Number(data.approvedCount), color: '#8884d8' },
  ];

  const totalAssets =
    Number(data.draftCount) +
    Number(data.verifiedCount) +
    Number(data.approvedCount);

  return (
    <div className="w-full p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
      <PieCharts
        data={chartData}
        dataKey="value"
        nameKey="name"
        title="Asset Status Distribution"
        description="Overview of asset statuses across the system"
        height={400}
        showLegend={true}
        customColors={['#ffc658', '#82ca9d', '#8884d8']}
        innerRadius={60}
        outerRadius={120}
        showLabels={true}
        tooltipFormatter={(value, name) => `${value} assets`}
      />

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Total Assets: <span className="font-semibold">{totalAssets}</span>
        </p>
      </div>
    </div>
  );
}
