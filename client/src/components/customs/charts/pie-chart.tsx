'use client';
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface PieChartsProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  title?: string;
  description?: string;
  height?: number;
  showLegend?: boolean;
  customColors?: string[];
  innerRadius?: number;
  outerRadius?: number;
  showLabels?: boolean;
  tooltipFormatter?: (value: any, name: string) => string;
  customTooltip?: React.ComponentType<any>;
  centerLabel?: string;
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

export default function PieCharts({
  data,
  dataKey,
  nameKey,
  title,
  description,
  height = 400,
  showLegend = true,
  customColors,
  innerRadius = 0,
  outerRadius = 80,
  showLabels = true,
  tooltipFormatter,
  customTooltip: CustomTooltip,
  centerLabel,
}: PieChartsProps) {
  const colors = customColors || DEFAULT_COLORS;
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive sizing
  const responsiveOuterRadius = isMobile
    ? Math.min(outerRadius * 0.7, 60)
    : outerRadius;
  const responsiveInnerRadius = isMobile ? innerRadius * 0.7 : innerRadius;
  const responsiveHeight = isMobile ? Math.min(height * 0.8, 300) : height;

  const CustomTooltipContent = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-gray-800 p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold mb-1 text-xs sm:text-sm">{data.name}</p>
          <p
            style={{ color: data.payload.fill }}
            className="text-xs sm:text-sm"
          >
            {tooltipFormatter
              ? tooltipFormatter(data.value, data.name)
              : `${data.value} (${(
                  (data.value / data.payload.total) *
                  100
                ).toFixed(1)}%)`}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLabel = (entry: any) => {
    // Hide labels on very small screens or show simplified labels
    if (isMobile && window.innerWidth < 480) {
      return '';
    }
    const percent = ((entry.value / entry.payload.total) * 100).toFixed(1);
    return isMobile ? `${percent}%` : `${entry[nameKey]}: ${percent}%`;
  };

  // Calculate total for percentage
  const dataWithTotal = data.map((item) => ({
    ...item,
    total: data.reduce((sum, d) => sum + Number(d[dataKey]), 0),
  }));

  // Custom legend with responsive text
  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <ul className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-4">
        {payload.map((entry: any, index: number) => (
          <li
            key={`legend-${index}`}
            className="flex items-center gap-1 sm:gap-2"
          >
            <span
              className="w-3 h-3 sm:w-4 sm:h-4 rounded-sm flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full space-y-2 sm:space-y-4">
      {(title || description) && (
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            {title && (
              <h3 className="text-base sm:text-lg font-semibold truncate">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {description}
              </p>
            )}
          </div>
          {description && (
            <TooltipProvider>
              <TooltipUI>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 cursor-help flex-shrink-0" />
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] sm:max-w-xs">
                  <p className="text-xs sm:text-sm">{description}</p>
                </TooltipContent>
              </TooltipUI>
            </TooltipProvider>
          )}
        </div>
      )}

      <ResponsiveContainer width="100%" height={responsiveHeight}>
        <PieChart>
          <Pie
            data={dataWithTotal}
            cx="50%"
            cy="50%"
            labelLine={showLabels && !isMobile}
            label={showLabels ? renderLabel : false}
            outerRadius={responsiveOuterRadius}
            innerRadius={responsiveInnerRadius}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
            style={{ fontSize: isMobile ? '10px' : '12px' }}
          >
            {dataWithTotal.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip content={CustomTooltip || (CustomTooltipContent as any)} />
          {showLegend && <Legend content={renderLegend} />}
        </PieChart>
      </ResponsiveContainer>

      {centerLabel && innerRadius > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-lg sm:text-2xl font-bold">{centerLabel}</p>
          </div>
        </div>
      )}
    </div>
  );
}
