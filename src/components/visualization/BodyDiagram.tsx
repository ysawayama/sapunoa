'use client';

import React, { useState } from 'react';
import { AffectedArea } from '@/types/testResults';

interface BodyDiagramProps {
  affectedAreas: AffectedArea[];
  title?: string;
  showLabels?: boolean;
}

export const BodyDiagram: React.FC<BodyDiagramProps> = ({
  affectedAreas,
  title = 'Affected Body Systems',
  showLabels = true,
}) => {
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  // Create a map for quick lookup
  const affectedMap = new Map<string, AffectedArea>();
  affectedAreas.forEach((area) => {
    affectedMap.set(area.bodyPart.toLowerCase(), area);
  });

  const getSeverityColor = (severity: 'mild' | 'moderate' | 'severe') => {
    switch (severity) {
      case 'mild':
        return '#fbbf24'; // amber-400
      case 'moderate':
        return '#fb923c'; // orange-400
      case 'severe':
        return '#ef4444'; // red-500
      default:
        return '#e5e7eb'; // gray-200
    }
  };

  const getSeverityOpacity = (severity: 'mild' | 'moderate' | 'severe') => {
    switch (severity) {
      case 'mild':
        return 0.5;
      case 'moderate':
        return 0.7;
      case 'severe':
        return 0.9;
      default:
        return 0.3;
    }
  };

  const bodyAreas = [
    { id: 'brain', label: 'Brain', cx: 150, cy: 50, r: 25 },
    { id: 'eyes', label: 'Eyes', cx: 130, cy: 60, r: 8, cx2: 170, cy2: 60 },
    { id: 'lungs', label: 'Lungs', cx: 120, cy: 140, r: 30, cx2: 180, cy2: 140 },
    { id: 'heart', label: 'Heart', cx: 150, cy: 140, r: 20 },
    { id: 'liver', label: 'Liver', cx: 130, cy: 200, r: 25 },
    { id: 'stomach', label: 'Stomach', cx: 150, cy: 210, r: 20 },
    { id: 'kidneys', label: 'Kidneys', cx: 115, cy: 230, r: 15, cx2: 185, cy2: 230 },
    { id: 'intestines', label: 'Intestines', cx: 150, cy: 260, r: 30 },
  ];

  // Mock affected areas if none provided
  const mockAffectedAreas: AffectedArea[] = [
    {
      bodyPart: 'Brain',
      severity: 'moderate',
      symptoms: ['Fatigue', 'Poor concentration', 'Memory issues'],
      relatedNutrients: ['Vitamin B12', 'Iron', 'Omega-3'],
    },
    {
      bodyPart: 'Heart',
      severity: 'mild',
      symptoms: ['Irregular heartbeat', 'Fatigue'],
      relatedNutrients: ['Magnesium', 'Calcium'],
    },
    {
      bodyPart: 'Stomach',
      severity: 'severe',
      symptoms: ['Digestive issues', 'Bloating', 'Discomfort'],
      relatedNutrients: ['Vitamin B12', 'Iron'],
    },
  ];

  // Use mock data if no data provided
  if (affectedAreas.length === 0) {
    mockAffectedAreas.forEach((area) => {
      affectedMap.set(area.bodyPart.toLowerCase(), area);
    });
  }

  const renderTooltip = () => {
    if (!hoveredArea) return null;
    const area = affectedMap.get(hoveredArea);
    if (!area) return null;

    return (
      <div className="absolute bg-white p-3 rounded-lg shadow-lg border border-gray-200 z-10"
           style={{ top: '20px', right: '20px', maxWidth: '250px' }}>
        <h4 className="font-semibold text-gray-900 mb-2">{area.bodyPart}</h4>
        <p className="text-sm mb-2">
          Severity: <span className={`font-medium ${
            area.severity === 'severe' ? 'text-red-600' :
            area.severity === 'moderate' ? 'text-orange-600' :
            'text-amber-600'
          }`}>{area.severity}</span>
        </p>
        <div className="text-sm text-gray-600">
          <p className="font-medium mb-1">Symptoms:</p>
          <ul className="list-disc list-inside mb-2">
            {area.symptoms.map((symptom, idx) => (
              <li key={idx}>{symptom}</li>
            ))}
          </ul>
          <p className="font-medium mb-1">Related Nutrients:</p>
          <div className="flex flex-wrap gap-1">
            {area.relatedNutrients.map((nutrient, idx) => (
              <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                {nutrient}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
      )}
      
      <div className="relative bg-gray-50 rounded-lg p-8">
        <svg
          viewBox="0 0 300 400"
          className="w-full max-w-sm mx-auto"
          style={{ maxHeight: '500px' }}
        >
          {/* Body outline */}
          <g id="body-outline">
            {/* Head */}
            <circle cx="150" cy="50" r="35" fill="none" stroke="#9ca3af" strokeWidth="2" />
            {/* Neck */}
            <rect x="140" y="80" width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="2" />
            {/* Torso */}
            <rect x="100" y="100" width="100" height="150" rx="10" fill="none" stroke="#9ca3af" strokeWidth="2" />
            {/* Arms */}
            <rect x="60" y="110" width="30" height="100" rx="15" fill="none" stroke="#9ca3af" strokeWidth="2" />
            <rect x="210" y="110" width="30" height="100" rx="15" fill="none" stroke="#9ca3af" strokeWidth="2" />
            {/* Legs */}
            <rect x="110" y="250" width="30" height="120" rx="15" fill="none" stroke="#9ca3af" strokeWidth="2" />
            <rect x="160" y="250" width="30" height="120" rx="15" fill="none" stroke="#9ca3af" strokeWidth="2" />
          </g>

          {/* Affected areas */}
          {bodyAreas.map((area) => {
            const affected = affectedMap.get(area.id);
            const isAffected = !!affected;
            
            return (
              <g key={area.id}>
                <circle
                  cx={area.cx}
                  cy={area.cy}
                  r={area.r}
                  fill={isAffected ? getSeverityColor(affected.severity) : '#e5e7eb'}
                  fillOpacity={isAffected ? getSeverityOpacity(affected.severity) : 0.3}
                  stroke={isAffected ? getSeverityColor(affected.severity) : '#9ca3af'}
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => setHoveredArea(area.id)}
                  onMouseLeave={() => setHoveredArea(null)}
                />
                {/* Render second circle for paired organs */}
                {area.cx2 && area.cy2 && (
                  <circle
                    cx={area.cx2}
                    cy={area.cy2}
                    r={area.r}
                    fill={isAffected ? getSeverityColor(affected.severity) : '#e5e7eb'}
                    fillOpacity={isAffected ? getSeverityOpacity(affected.severity) : 0.3}
                    stroke={isAffected ? getSeverityColor(affected.severity) : '#9ca3af'}
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredArea(area.id)}
                    onMouseLeave={() => setHoveredArea(null)}
                  />
                )}
                {showLabels && (
                  <text
                    x={area.cx}
                    y={area.cy + area.r + 15}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                  >
                    {area.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        
        {renderTooltip()}
        
        {/* Legend */}
        <div className="mt-6 flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-400 opacity-50" />
            <span className="text-gray-600">Mild</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-400 opacity-70" />
            <span className="text-gray-600">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 opacity-90" />
            <span className="text-gray-600">Severe</span>
          </div>
        </div>
      </div>
    </div>
  );
};