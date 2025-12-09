'use client';
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface BarConfig {
  dataKey: string;
  fill?: string;
  name?: string;
  stackId?: string;
}

interface BarChartsProps {
  data: any[];
  bars: BarConfig[];
  xAxisKey: string;
  title?: string;
  description?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  customColors?: string[];
  stacked?: boolean;
  horizontal?: boolean;
  tooltipFormatter?: (value: any, name: string) => string;
  customTooltip?: React.ComponentType<any>;
}

const DEFAULT_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7c7c',
  '#a78bfa',
  '#fb923c',
  '#34d399',
  '#f472b6',
];

export default function LongBarCharts({
  data,
  bars,
  xAxisKey,
  title,
  description,
  height = 400,
  showLegend = true,
  showGrid = true,
  xAxisLabel,
  yAxisLabel,
  customColors,
  stacked = false,
  horizontal = false,
  tooltipFormatter,
  customTooltip: CustomTooltip,
}: BarChartsProps) {
  const colors = customColors || DEFAULT_COLORS;

  const CustomTooltipContent = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-w-[200px] sm:max-w-none">
          <p className="font-semibold mb-1 sm:mb-2 text-xs sm:text-sm truncate">
            {label}
          </p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              style={{ color: entry.color }}
              className="text-xs sm:text-sm truncate"
            >
              {entry.name}:{' '}
              {tooltipFormatter
                ? tooltipFormatter(entry.value, entry.name)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Responsive height based on screen size
  const responsiveHeight =
    typeof window !== 'undefined' && window.innerWidth < 640 ? 300 : height;

  return (
    <div className="w-full space-y-2 sm:space-y-4 px-2 sm:px-0">
      {(title || description) && (
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            {title && (
              <h3 className="text-base sm:text-lg md:text-xl font-semibold truncate">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 sm:line-clamp-none">
                {description}
              </p>
            )}
          </div>
          {description && (
            <TooltipProvider>
              <TooltipUI>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 cursor-help flex-shrink-0 mt-1" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs sm:text-sm">{description}</p>
                </TooltipContent>
              </TooltipUI>
            </TooltipProvider>
          )}
        </div>
      )}

      <div className="w-full overflow-x-auto -mx-2 sm:mx-0 px-2 sm:px-0">
        <div className="min-w-[300px] sm:min-w-0">
          <ResponsiveContainer width="100%" height={responsiveHeight}>
            <BarChart
              data={data}
              layout={horizontal ? 'vertical' : 'horizontal'}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 5,
                ...(typeof window !== 'undefined' &&
                  window.innerWidth >= 640 && {
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 20,
                  }),
              }}
            >
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              )}

              {horizontal ? (
                <>
                  <XAxis
                    type="number"
                    tick={{ fontSize: 10 }}
                    label={
                      xAxisLabel
                        ? {
                            value: xAxisLabel,
                            position: 'insideBottom',
                            offset: -10,
                            style: { fontSize: '12px' },
                          }
                        : undefined
                    }
                  />
                  <YAxis
                    type="category"
                    dataKey={xAxisKey}
                    width={60}
                    tick={{ fontSize: 10 }}
                    label={
                      yAxisLabel
                        ? {
                            value: yAxisLabel,
                            angle: -90,
                            position: 'insideLeft',
                            style: { fontSize: '12px' },
                          }
                        : undefined
                    }
                  />
                </>
              ) : (
                <>
                  <XAxis
                    dataKey={xAxisKey}
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={0}
                    label={
                      xAxisLabel
                        ? {
                            value: xAxisLabel,
                            position: 'insideBottom',
                            offset: -10,
                            style: { fontSize: '12px' },
                          }
                        : undefined
                    }
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    width={40}
                    label={
                      yAxisLabel
                        ? {
                            value: yAxisLabel,
                            angle: -90,
                            position: 'insideLeft',
                            style: { fontSize: '12px' },
                          }
                        : undefined
                    }
                  />
                </>
              )}

              <Tooltip
                content={CustomTooltip || (CustomTooltipContent as any)}
                cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
              />

              {showLegend && (
                <Legend wrapperStyle={{ fontSize: '12px' }} iconSize={10} />
              )}

              {bars.map((bar, index) => (
                <Bar
                  key={bar.dataKey}
                  dataKey={bar.dataKey}
                  fill={bar.fill || colors[index % colors.length]}
                  name={bar.name || bar.dataKey}
                  stackId={stacked ? bar.stackId || 'stack' : undefined}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
