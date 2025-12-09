# BarCharts Component Documentation

A flexible and reusable bar chart component built with Recharts and shadcn/ui.

## Installation

Make sure you have the required dependencies:

```bash
npm install recharts
npx shadcn-ui@latest add tooltip
```

## Basic Usage

```tsx
import BarCharts from '@/components/customs/charts/bar-charts'

const data = [
  { month: 'Jan', sales: 4000, expenses: 2400 },
  { month: 'Feb', sales: 3000, expenses: 1398 },
  { month: 'Mar', sales: 2000, expenses: 9800 },
]

export default function MyComponent() {
  return (
    <BarCharts
      data={data}
      bars={[
        { dataKey: 'sales', name: 'Sales', fill: '#8884d8' },
        { dataKey: 'expenses', name: 'Expenses', fill: '#82ca9d' }
      ]}
      xAxisKey="month"
      title="Monthly Revenue"
      description="Sales and expenses comparison"
    />
  )
}
```

## Props

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `any[]` | Array of data objects to display |
| `bars` | `BarConfig[]` | Configuration for each bar series |
| `xAxisKey` | `string` | Key in data objects to use for X-axis |

### Optional Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Chart title |
| `description` | `string` | - | Chart description (also shows in tooltip) |
| `height` | `number` | `400` | Chart height in pixels |
| `showLegend` | `boolean` | `true` | Show/hide legend |
| `showGrid` | `boolean` | `true` | Show/hide grid lines |
| `xAxisLabel` | `string` | - | Label for X-axis |
| `yAxisLabel` | `string` | - | Label for Y-axis |
| `customColors` | `string[]` | - | Custom color palette |
| `stacked` | `boolean` | `false` | Stack bars on top of each other |
| `horizontal` | `boolean` | `false` | Display horizontal bars |
| `tooltipFormatter` | `(value: any, name: string) => string` | - | Custom tooltip value formatter |
| `customTooltip` | `React.ComponentType<any>` | - | Completely custom tooltip component |

### BarConfig Interface

```tsx
interface BarConfig {
  dataKey: string      // Key in data objects
  fill?: string        // Bar color (optional)
  name?: string        // Display name in legend (optional)
  stackId?: string     // Stack ID for grouped stacking (optional)
}
```

## Examples

### Simple Bar Chart

```tsx
<BarCharts
  data={[
    { name: 'Product A', value: 400 },
    { name: 'Product B', value: 300 },
    { name: 'Product C', value: 600 },
  ]}
  bars={[{ dataKey: 'value', name: 'Sales' }]}
  xAxisKey="name"
/>
```

### Stacked Bar Chart

```tsx
<BarCharts
  data={[
    { month: 'Jan', desktop: 186, mobile: 80, tablet: 45 },
    { month: 'Feb', desktop: 305, mobile: 200, tablet: 67 },
    { month: 'Mar', desktop: 237, mobile: 120, tablet: 89 },
  ]}
  bars={[
    { dataKey: 'desktop', name: 'Desktop' },
    { dataKey: 'mobile', name: 'Mobile' },
    { dataKey: 'tablet', name: 'Tablet' }
  ]}
  xAxisKey="month"
  stacked={true}
  title="Device Usage"
/>
```

### Horizontal Bar Chart

```tsx
<BarCharts
  data={[
    { category: 'Electronics', value: 4000 },
    { category: 'Clothing', value: 3000 },
    { category: 'Food', value: 2000 },
  ]}
  bars={[{ dataKey: 'value' }]}
  xAxisKey="category"
  horizontal={true}
/>
```

### Custom Colors

```tsx
<BarCharts
  data={data}
  bars={[
    { dataKey: 'revenue' },
    { dataKey: 'profit' }
  ]}
  xAxisKey="quarter"
  customColors={['#ff6b6b', '#4ecdc4', '#45b7d1']}
/>
```

### Custom Tooltip Formatter

```tsx
<BarCharts
  data={data}
  bars={[{ dataKey: 'amount' }]}
  xAxisKey="month"
  tooltipFormatter={(value, name) => `$${value.toLocaleString()}`}
/>
```

### With Axis Labels

```tsx
<BarCharts
  data={data}
  bars={[{ dataKey: 'users' }]}
  xAxisKey="date"
  xAxisLabel="Time Period"
  yAxisLabel="Number of Users"
  title="User Growth"
/>
```

### Complex Data Structure

```tsx
const complexData = [
  {
    period: 'Q1 2024',
    northAmerica: 12000,
    europe: 8500,
    asia: 15000,
    other: 3200
  },
  // ... more data
]

<BarCharts
  data={complexData}
  bars={[
    { dataKey: 'northAmerica', name: 'North America', fill: '#3b82f6' },
    { dataKey: 'europe', name: 'Europe', fill: '#10b981' },
    { dataKey: 'asia', name: 'Asia', fill: '#f59e0b' },
    { dataKey: 'other', name: 'Other Regions', fill: '#6366f1' }
  ]}
  xAxisKey="period"
  title="Regional Sales Performance"
  description="Quarterly sales across different regions"
  height={500}
/>
```

## Features

- ✅ Fully responsive
- ✅ Support for any data structure
- ✅ Multiple bar series
- ✅ Stacked and grouped bars
- ✅ Horizontal orientation
- ✅ Custom colors
- ✅ Custom tooltips
- ✅ shadcn/ui integration
- ✅ Dark mode support
- ✅ Accessible

## Notes

- The component automatically handles color assignment if not specified
- Data can be in any shape as long as you specify the correct keys
- The component is fully typed with TypeScript
- Rounded top corners on bars for modern look
- Responsive container adapts to parent width