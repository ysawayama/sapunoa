'use client';

import React from 'react';
import { NutrientData, getStatusBgColor, getStatusTextColor } from '@/types/testResults';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface TestValueTableProps {
  nutrients: NutrientData[];
  showTrends?: boolean;
  previousValues?: Record<string, number>;
}

export const TestValueTable: React.FC<TestValueTableProps> = ({
  nutrients,
  showTrends = false,
  previousValues = {},
}) => {
  const getTrend = (nutrient: string, currentValue: number) => {
    const prevValue = previousValues[nutrient];
    if (!prevValue) return null;
    
    if (currentValue > prevValue) return 'up';
    if (currentValue < prevValue) return 'down';
    return 'stable';
  };

  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="w-4 h-4 text-blue-500" />;
      case 'down':
        return <ArrowDown className="w-4 h-4 text-orange-500" />;
      case 'stable':
        return <Minus className="w-4 h-4 text-gray-500" />;
      default:
        return null;
    }
  };

  const getPercentageInRange = (nutrient: NutrientData) => {
    const range = nutrient.normalMax - nutrient.normalMin;
    const valueInRange = Math.max(0, Math.min(nutrient.value - nutrient.normalMin, range));
    return (valueInRange / range) * 100;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Test
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Normal Range
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            {showTrends && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trend
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Range Visual
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {nutrients.map((nutrient, index) => {
            const trend = getTrend(nutrient.nutrient, nutrient.value);
            const percentage = getPercentageInRange(nutrient);
            
            return (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {nutrient.nutrient}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="font-semibold">{nutrient.value}</span> {nutrient.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {nutrient.normalMin} - {nutrient.normalMax} {nutrient.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBgColor(
                      nutrient.status
                    )} ${getStatusTextColor(nutrient.status)}`}
                  >
                    {nutrient.status}
                  </span>
                </td>
                {showTrends && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getTrendIcon(trend)}
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="w-24 bg-gray-200 rounded-full h-2 relative">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        nutrient.status === 'normal'
                          ? 'bg-emerald-500'
                          : nutrient.status === 'low' || nutrient.status === 'deficient'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                      style={{
                        width: `${Math.min(Math.max(percentage, 0), 100)}%`,
                      }}
                    />
                    {/* Normal range indicators */}
                    <div className="absolute top-0 h-2 w-0.5 bg-gray-400" style={{ left: '0%' }} />
                    <div className="absolute top-0 h-2 w-0.5 bg-gray-400" style={{ left: '100%' }} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};