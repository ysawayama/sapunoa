import { TestResult, NutrientData, HealthTrend } from '@/types/testResults';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export class TestResultsService {
  static async getTestResults(): Promise<TestResult[]> {
    const response = await fetch(`${API_BASE_URL}/test-results`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch test results');
    }
    
    return response.json();
  }

  static async getTestResultById(id: string): Promise<TestResult> {
    const response = await fetch(`${API_BASE_URL}/test-results/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch test result');
    }
    
    return response.json();
  }

  static async getNutrientData(testId: string): Promise<NutrientData[]> {
    const response = await fetch(`${API_BASE_URL}/test-results/${testId}/nutrients`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch nutrient data');
    }
    
    return response.json();
  }

  static async getHealthTrends(patientId: string): Promise<HealthTrend[]> {
    const response = await fetch(`${API_BASE_URL}/patients/${patientId}/health-trends`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch health trends');
    }
    
    return response.json();
  }

  // Mock data for development
  static getMockTestResults(): TestResult[] {
    return [
      {
        id: '1',
        patientId: 'patient-1',
        testDate: new Date().toISOString(),
        testType: 'Comprehensive Nutritional Analysis',
        status: 'completed',
        summary: 'Multiple nutrient deficiencies detected',
        overallScore: 65,
      },
      {
        id: '2',
        patientId: 'patient-1',
        testDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        testType: 'Vitamin Panel',
        status: 'completed',
        summary: 'Vitamin D deficiency',
        overallScore: 78,
      },
    ];
  }

  static getMockNutrientData(): NutrientData[] {
    return [
      { nutrient: 'Vitamin D', value: 18, unit: 'ng/mL', normalMin: 30, normalMax: 100, status: 'deficient' },
      { nutrient: 'Vitamin B12', value: 180, unit: 'pg/mL', normalMin: 200, normalMax: 900, status: 'low' },
      { nutrient: 'Iron', value: 75, unit: 'μg/dL', normalMin: 60, normalMax: 170, status: 'normal' },
      { nutrient: 'Calcium', value: 9.2, unit: 'mg/dL', normalMin: 8.5, normalMax: 10.5, status: 'normal' },
      { nutrient: 'Magnesium', value: 1.5, unit: 'mg/dL', normalMin: 1.7, normalMax: 2.2, status: 'low' },
      { nutrient: 'Zinc', value: 65, unit: 'μg/dL', normalMin: 70, normalMax: 120, status: 'low' },
      { nutrient: 'Vitamin C', value: 0.4, unit: 'mg/dL', normalMin: 0.4, normalMax: 2.0, status: 'normal' },
      { nutrient: 'Folate', value: 3.5, unit: 'ng/mL', normalMin: 2.7, normalMax: 17.0, status: 'normal' },
    ];
  }

  static getMockHealthTrends(): HealthTrend[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      date: month,
      overallHealth: 70 + Math.random() * 20,
      nutritionScore: 65 + Math.random() * 25,
      vitaminLevels: 60 + Math.random() * 30,
      mineralLevels: 70 + Math.random() * 20,
    }));
  }
}