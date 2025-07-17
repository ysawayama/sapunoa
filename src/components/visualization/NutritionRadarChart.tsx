'use client';

import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { NutrientData } from '@/types/testResults';

interface NutritionRadarChartProps {
  nutrients: NutrientData[];
  title?: string;
  showLegend?: boolean;
}

export const NutritionRadarChart: React.FC<NutritionRadarChartProps> = ({
  nutrients,
  title = 'Nutrition Balance',
  showLegend = true,
}) => {
  // Transform nutrient data for radar chart
  const chartData = nutrients.map((nutrient) => {
    // Calculate percentage of normal (100% = middle of normal range)
    const normalMidpoint = (nutrient.normalMin + nutrient.normalMax) / 2;
    const percentage = (nutrient.value / normalMidpoint) * 100;
    
    return {
      nutrient: nutrient.nutrient,
      value: Math.min(percentage, 200), // Cap at 200% for visualization
      fullMark: 150, // 150% as full mark
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload[0]) {
      const data = payload[0].payload;
      const nutrient = nutrients.find(n => n.nutrient === data.nutrient);
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.nutrient}</p>
          <p className="text-sm text-gray-600">
            Level: {data.value.toFixed(1)}% of normal
          </p>
          {nutrient && (
            <>
              <p className="text-sm text-gray-600">
                Value: {nutrient.value} {nutrient.unit}
              </p>
              <p className="text-sm text-gray-600">
                Status: <span className={`font-medium ${
                  nutrient.status === 'normal' ? 'text-emerald-600' :
                  nutrient.status === 'low' || nutrient.status === 'deficient' ? 'text-red-600' :
                  'text-blue-600'
                }`}>{nutrient.status}</span>
              </p>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData}>
          <PolarGrid 
            gridType="polygon"
            radialLines={true}
          />
          <PolarAngleAxis 
            dataKey="nutrient"
            tick={{ fontSize: 12 }}
            className="text-gray-600"
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 150]}
            tickCount={4}
            tick={{ fontSize: 10 }}
          />
          <Radar
            name="Current Level"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          {/* Normal range indicator */}
          <Radar
            name="Normal Range"
            dataKey={() => 100}
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.1}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
      <div className="mt-4 flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full" />
          <span>Deficient (&lt;70%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-full" />
          <span>Low (70-90%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-full" />
          <span>Normal (90-110%)</span>
        </div>
      </div>
    </div>
  );
};