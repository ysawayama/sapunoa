'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { HealthTrend } from '@/types/testResults';

interface HealthTrendChartProps {
  trends: HealthTrend[];
  title?: string;
  showLegend?: boolean;
  metrics?: Array<{
    key: keyof HealthTrend;
    label: string;
    color: string;
  }>;
}

const defaultMetrics = [
  { key: 'overallHealth' as keyof HealthTrend, label: 'Overall Health', color: '#3b82f6' },
  { key: 'nutritionScore' as keyof HealthTrend, label: 'Nutrition Score', color: '#10b981' },
  { key: 'vitaminLevels' as keyof HealthTrend, label: 'Vitamin Levels', color: '#f59e0b' },
  { key: 'mineralLevels' as keyof HealthTrend, label: 'Mineral Levels', color: '#8b5cf6' },
];

export const HealthTrendChart: React.FC<HealthTrendChartProps> = ({
  trends,
  title = 'Health Trends Over Time',
  showLegend = true,
  metrics = defaultMetrics,
}) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(1)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getStatusColor = (value: number) => {
    if (value >= 80) return '#10b981'; // Good
    if (value >= 60) return '#f59e0b'; // Fair
    return '#ef4444'; // Poor
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={trends}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            domain={[0, 100]}
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            ticks={[0, 20, 40, 60, 80, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Reference lines for health zones */}
          <ReferenceLine 
            y={80} 
            stroke="#10b981" 
            strokeDasharray="5 5" 
            label={{ value: "Good", position: "right", fill: "#10b981", fontSize: 12 }}
          />
          <ReferenceLine 
            y={60} 
            stroke="#f59e0b" 
            strokeDasharray="5 5" 
            label={{ value: "Fair", position: "right", fill: "#f59e0b", fontSize: 12 }}
          />
          <ReferenceLine 
            y={40} 
            stroke="#ef4444" 
            strokeDasharray="5 5" 
            label={{ value: "Poor", position: "right", fill: "#ef4444", fontSize: 12 }}
          />
          
          {metrics.map((metric) => (
            <Line
              key={metric.key}
              type="monotone"
              dataKey={metric.key}
              stroke={metric.color}
              name={metric.label}
              strokeWidth={2}
              dot={{ fill: metric.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
          
          {showLegend && (
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
              verticalAlign="bottom"
              height={36}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      
      {/* Health zones legend */}
      <div className="mt-6 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-emerald-500" />
          <span className="text-gray-600">Good (80-100)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-amber-500" />
          <span className="text-gray-600">Fair (60-80)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-red-500" />
          <span className="text-gray-600">Poor (&lt;60)</span>
        </div>
      </div>
    </div>
  );
};