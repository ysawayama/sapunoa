import { useState, useEffect } from 'react';
import { TestResultsService } from '@/services/testResults.service';
import { TestResult, NutrientData, HealthTrend } from '@/types/testResults';

export const useTestResults = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTestResults = async () => {
      try {
        setLoading(true);
        // Use mock data for now
        const results = TestResultsService.getMockTestResults();
        setTestResults(results);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch test results'));
      } finally {
        setLoading(false);
      }
    };

    fetchTestResults();
  }, []);

  return { testResults, loading, error };
};

export const useTestResult = (id: string) => {
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTestResult = async () => {
      try {
        setLoading(true);
        // Use mock data for now
        const results = TestResultsService.getMockTestResults();
        const result = results.find(r => r.id === id);
        if (result) {
          setTestResult(result);
        } else {
          throw new Error('Test result not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch test result'));
      } finally {
        setLoading(false);
      }
    };

    fetchTestResult();
  }, [id]);

  return { testResult, loading, error };
};

export const useNutrientData = (testId: string) => {
  const [nutrientData, setNutrientData] = useState<NutrientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNutrientData = async () => {
      try {
        setLoading(true);
        // Use mock data for now
        const data = TestResultsService.getMockNutrientData();
        setNutrientData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch nutrient data'));
      } finally {
        setLoading(false);
      }
    };

    fetchNutrientData();
  }, [testId]);

  return { nutrientData, loading, error };
};

export const useHealthTrends = (patientId: string) => {
  const [healthTrends, setHealthTrends] = useState<HealthTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchHealthTrends = async () => {
      try {
        setLoading(true);
        // Use mock data for now
        const trends = TestResultsService.getMockHealthTrends();
        setHealthTrends(trends);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch health trends'));
      } finally {
        setLoading(false);
      }
    };

    fetchHealthTrends();
  }, [patientId]);

  return { healthTrends, loading, error };
};