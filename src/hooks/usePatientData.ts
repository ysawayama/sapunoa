import { useState, useEffect } from 'react';
import { patientService } from '@/services/patient.service';

interface PatientData {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastCheckup: string;
  healthScore: {
    overall: number;
    categories: {
      nutrition: number;
      fitness: number;
      mental: number;
      sleep: number;
    };
  };
  recentTests: Array<{
    id: string;
    name: string;
    date: string;
    status: 'normal' | 'attention' | 'abnormal';
    summary: string;
  }>;
  supplements: Array<{
    id: string;
    name: string;
    dosage: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  insights: Array<{
    id: string;
    type: 'tip' | 'warning' | 'success';
    title: string;
    description: string;
    action?: {
      label: string;
      href: string;
    };
  }>;
}

export function usePatientData(userId?: string) {
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await patientService.getPatientData(userId);
        setPatientData(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch patient data'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
  }, [userId]);

  const refreshData = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const data = await patientService.getPatientData(userId);
      setPatientData(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh patient data'));
    } finally {
      setIsLoading(false);
    }
  };

  return { patientData, isLoading, error, refreshData };
}