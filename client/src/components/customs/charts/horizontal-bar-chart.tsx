import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface BarConfig {
  dataKey: string;
  fill: string;
  name: string;
}

interface HorizontalBarChartsProps {
  data: any[];
  bars: BarConfig[];
  yAxisKey: string;
  title?: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  tooltipFormatter?: (value: any, name: string) => string;
  showLabels?: boolean;
  showMonthLabels?: boolean;
}

export default function HorizontalBarCharts({
  data,
  bars,
  yAxisKey,
  height = 400,
  showGrid = true,
  showLabels = true,
  showMonthLabels = true,
}: HorizontalBarChartsProps) {
  // Create chart config from bars
  const chartConfig: ChartConfig = bars.reduce((config, bar, index) => {
    config[bar.dataKey] = {
      label: bar.name,
      color: bar.fill,
    };
    return config;
  }, {} as ChartConfig);

  // Add label color
  if (showMonthLabels) {
    chartConfig.label = {
      color: 'hsl(var(--background))',
    };
  }

  return (
    <div className="w-full" style={{ height }}>
      <ChartContainer config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={data}
          layout="vertical"
          margin={{
            right: 16,
            left: 0,
          }}
        >
          {showGrid && <CartesianGrid horizontal={false} />}
          <YAxis
            dataKey={yAxisKey}
            type="category"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
            hide
          />
          <XAxis dataKey={bars[0].dataKey} type="number" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
          />
          {bars.map((bar, index) => (
            <Bar
              key={index}
              dataKey={bar.dataKey}
              layout="vertical"
              fill={bar.fill}
              radius={4}
            >
              {showMonthLabels && (
                <LabelList
                  dataKey={yAxisKey}
                  position="insideLeft"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              )}
              {showLabels && (
                <LabelList
                  dataKey={bar.dataKey}
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              )}
            </Bar>
          ))}
        </BarChart>
      </ChartContainer>
    </div>
  );
}
