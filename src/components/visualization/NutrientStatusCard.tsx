'use client';

import React from 'react';
import { NutrientData, getStatusBgColor, getStatusTextColor } from '@/types/testResults';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface NutrientStatusCardProps {
  nutrient: NutrientData;
  trend?: 'up' | 'down' | 'stable';
  previousValue?: number;
}

export const NutrientStatusCard: React.FC<NutrientStatusCardProps> = ({
  nutrient,
  trend,
  previousValue,
}) => {
  const percentage = ((nutrient.value - nutrient.normalMin) / (nutrient.normalMax - nutrient.normalMin)) * 100;
  const isInRange = nutrient.value >= nutrient.normalMin && nutrient.value <= nutrient.normalMax;

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />;
      case 'down':
        return <TrendingDown className="w-4 h-4" />;
      case 'stable':
        return <Minus className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getChangePercentage = () => {
    if (!previousValue || previousValue === 0) return null;
    const change = ((nutrient.value - previousValue) / previousValue) * 100;
    return change.toFixed(1);
  };

  return (
    <div className={`rounded-lg p-4 border ${getStatusBgColor(nutrient.status)} ${getStatusTextColor(nutrient.status)}`}>
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{nutrient.nutrient}</h3>
        {trend && (
          <div className="flex items-center gap-1">
            {getTrendIcon()}
            {getChangePercentage() && (
              <span className="text-sm">
                {getChangePercentage()}%
              </span>
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <span className="text-2xl font-bold">
            {nutrient.value}
          </span>
          <span className="text-sm opacity-75">{nutrient.unit}</span>
        </div>

        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute h-full transition-all duration-300 ${
              isInRange ? 'bg-emerald-500' : nutrient.status === 'low' || nutrient.status === 'deficient' ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{
              width: `${Math.min(Math.max(percentage, 0), 100)}%`,
            }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-gray-400"
            style={{ left: '0%' }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-gray-400"
            style={{ left: '100%' }}
          />
        </div>

        <div className="flex justify-between text-xs opacity-75">
          <span>{nutrient.normalMin} {nutrient.unit}</span>
          <span className="font-medium">Normal Range</span>
          <span>{nutrient.normalMax} {nutrient.unit}</span>
        </div>

        <div className={`text-sm font-medium capitalize mt-2 ${getStatusTextColor(nutrient.status)}`}>
          Status: {nutrient.status}
        </div>
      </div>
    </div>
  );
};