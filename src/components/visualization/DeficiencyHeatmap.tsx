'use client';

import React from 'react';
import { DeficiencyData } from '@/types/testResults';

interface DeficiencyHeatmapProps {
  data: DeficiencyData[];
  title?: string;
}

const bodyParts = [
  'Brain',
  'Eyes',
  'Skin',
  'Hair',
  'Heart',
  'Lungs',
  'Liver',
  'Stomach',
  'Intestines',
  'Kidneys',
  'Bones',
  'Muscles',
  'Joints',
  'Blood',
  'Immune System',
];

const nutrients = [
  'Vitamin D',
  'Vitamin B12',
  'Iron',
  'Calcium',
  'Magnesium',
  'Zinc',
  'Vitamin C',
  'Folate',
  'Vitamin A',
  'Omega-3',
];

export const DeficiencyHeatmap: React.FC<DeficiencyHeatmapProps> = ({
  data,
  title = 'Nutrient Deficiency Impact Map',
}) => {
  // Create a map for quick lookup
  const deficiencyMap = new Map<string, number>();
  data.forEach((item) => {
    const key = `${item.nutrient}-${item.bodyPart}`;
    deficiencyMap.set(key, item.severity);
  });

  const getCellColor = (severity: number | undefined) => {
    if (severity === undefined) return 'bg-gray-50';
    if (severity === 0) return 'bg-gray-50';
    if (severity < 20) return 'bg-emerald-100';
    if (severity < 40) return 'bg-yellow-100';
    if (severity < 60) return 'bg-amber-200';
    if (severity < 80) return 'bg-orange-300';
    return 'bg-red-400';
  };

  const getCellTextColor = (severity: number | undefined) => {
    if (severity === undefined || severity < 60) return 'text-gray-700';
    return 'text-white';
  };

  // Generate mock data if none provided
  const mockData: DeficiencyData[] = [];
  if (data.length === 0) {
    nutrients.forEach((nutrient) => {
      bodyParts.forEach((bodyPart) => {
        // Create realistic patterns
        let severity = 0;
        
        // Vitamin D affects bones, muscles, immune system
        if (nutrient === 'Vitamin D' && ['Bones', 'Muscles', 'Immune System'].includes(bodyPart)) {
          severity = 70 + Math.random() * 20;
        }
        // B12 affects brain, blood
        else if (nutrient === 'Vitamin B12' && ['Brain', 'Blood'].includes(bodyPart)) {
          severity = 60 + Math.random() * 20;
        }
        // Iron affects blood, muscles, brain
        else if (nutrient === 'Iron' && ['Blood', 'Muscles', 'Brain'].includes(bodyPart)) {
          severity = 50 + Math.random() * 30;
        }
        // Calcium affects bones, muscles, heart
        else if (nutrient === 'Calcium' && ['Bones', 'Muscles', 'Heart'].includes(bodyPart)) {
          severity = 40 + Math.random() * 20;
        }
        // Random low values for other combinations
        else {
          severity = Math.random() * 30;
        }
        
        if (severity > 0) {
          mockData.push({ nutrient, bodyPart, severity });
        }
      });
    });
    
    // Update the map with mock data
    mockData.forEach((item) => {
      const key = `${item.nutrient}-${item.bodyPart}`;
      deficiencyMap.set(key, item.severity);
    });
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="sticky left-0 bg-white z-10 px-2 py-2 text-left text-xs font-medium text-gray-700">
                  Body System
                </th>
                {nutrients.map((nutrient) => (
                  <th
                    key={nutrient}
                    className="px-1 py-2 text-center text-xs font-medium text-gray-700 whitespace-nowrap"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                  >
                    {nutrient}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bodyParts.map((bodyPart) => (
                <tr key={bodyPart}>
                  <td className="sticky left-0 bg-white z-10 px-2 py-1 text-xs font-medium text-gray-700 whitespace-nowrap">
                    {bodyPart}
                  </td>
                  {nutrients.map((nutrient) => {
                    const key = `${nutrient}-${bodyPart}`;
                    const severity = deficiencyMap.get(key);
                    
                    return (
                      <td
                        key={nutrient}
                        className={`px-1 py-1 text-center text-xs ${getCellColor(
                          severity
                        )} ${getCellTextColor(severity)} transition-colors duration-200 hover:opacity-80`}
                        title={`${nutrient} - ${bodyPart}: ${
                          severity ? `${severity.toFixed(0)}% impact` : 'No impact'
                        }`}
                      >
                        {severity && severity > 0 ? severity.toFixed(0) : ''}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Impact Severity</p>
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-gray-50 border border-gray-200" />
            <span className="text-xs text-gray-600">None</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-emerald-100" />
            <span className="text-xs text-gray-600">Minimal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-yellow-100" />
            <span className="text-xs text-gray-600">Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-amber-200" />
            <span className="text-xs text-gray-600">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-orange-300" />
            <span className="text-xs text-gray-600">High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-4 bg-red-400" />
            <span className="text-xs text-gray-600">Severe</span>
          </div>
        </div>
      </div>
    </div>
  );
};