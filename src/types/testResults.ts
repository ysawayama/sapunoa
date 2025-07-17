export interface TestResult {
  id: string;
  patientId: string;
  testDate: string;
  testType: string;
  status: 'pending' | 'completed' | 'reviewed';
  summary: string;
  overallScore: number;
  nutrients?: NutrientData[];
  affectedAreas?: AffectedArea[];
}

export interface NutrientData {
  nutrient: string;
  value: number;
  unit: string;
  normalMin: number;
  normalMax: number;
  status: 'deficient' | 'low' | 'normal' | 'high';
  category?: 'vitamin' | 'mineral' | 'other';
}

export interface AffectedArea {
  bodyPart: string;
  severity: 'mild' | 'moderate' | 'severe';
  symptoms: string[];
  relatedNutrients: string[];
}

export interface HealthTrend {
  date: string;
  overallHealth: number;
  nutritionScore: number;
  vitaminLevels: number;
  mineralLevels: number;
}

export interface DeficiencyData {
  nutrient: string;
  bodyPart: string;
  severity: number; // 0-100
}

export type NutrientStatus = 'deficient' | 'low' | 'normal' | 'high';

export const getStatusColor = (status: NutrientStatus): string => {
  switch (status) {
    case 'deficient':
      return '#ef4444'; // red-500
    case 'low':
      return '#f59e0b'; // amber-500
    case 'normal':
      return '#10b981'; // emerald-500
    case 'high':
      return '#3b82f6'; // blue-500
    default:
      return '#6b7280'; // gray-500
  }
};

export const getStatusBgColor = (status: NutrientStatus): string => {
  switch (status) {
    case 'deficient':
      return 'bg-red-100';
    case 'low':
      return 'bg-amber-100';
    case 'normal':
      return 'bg-emerald-100';
    case 'high':
      return 'bg-blue-100';
    default:
      return 'bg-gray-100';
  }
};

export const getStatusTextColor = (status: NutrientStatus): string => {
  switch (status) {
    case 'deficient':
      return 'text-red-700';
    case 'low':
      return 'text-amber-700';
    case 'normal':
      return 'text-emerald-700';
    case 'high':
      return 'text-blue-700';
    default:
      return 'text-gray-700';
  }
};