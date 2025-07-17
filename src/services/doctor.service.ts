import { apiClient } from '@/lib/api-client';
import { Patient, TestResult } from '@/types';

interface DoctorComment {
  id: string;
  content: string;
  doctorName: string;
  createdAt: string;
  updatedAt: string;
}

interface DoctorRecommendation {
  id?: string;
  supplementName: string;
  dosage: string;
  frequency: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
  notes: string;
  status?: string;
}

interface RecommendationListItem {
  id: string;
  patientId: string;
  patientName: string;
  supplementName: string;
  dosage: string;
  frequency: string;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'pending' | 'completed';
  createdAt: string;
  updatedAt: string;
}

class DoctorService {
  // Patient Management
  async getPatients(): Promise<Patient[]> {
    const response = await apiClient.get('/doctor/patients');
    return response.data;
  }

  async getPatient(patientId: string): Promise<Patient> {
    const response = await apiClient.get(`/doctor/patients/${patientId}`);
    return response.data;
  }

  async getPatientTestResults(patientId: string): Promise<TestResult[]> {
    const response = await apiClient.get(`/doctor/patients/${patientId}/test-results`);
    return response.data;
  }

  // Recommendations Management
  async getRecommendations(): Promise<RecommendationListItem[]> {
    const response = await apiClient.get('/doctor/recommendations');
    return response.data;
  }

  async getPatientRecommendations(patientId: string): Promise<DoctorRecommendation[]> {
    const response = await apiClient.get(`/doctor/patients/${patientId}/recommendations`);
    return response.data;
  }

  async updatePatientRecommendations(
    patientId: string, 
    recommendations: DoctorRecommendation[]
  ): Promise<void> {
    await apiClient.put(`/doctor/patients/${patientId}/recommendations`, {
      recommendations
    });
  }

  async updateRecommendationStatus(
    patientId: string,
    recommendationId: string,
    status: 'active' | 'pending' | 'completed'
  ): Promise<void> {
    await apiClient.patch(`/doctor/patients/${patientId}/recommendations/${recommendationId}`, {
      status
    });
  }

  // Comments Management
  async getPatientComments(patientId: string): Promise<DoctorComment[]> {
    const response = await apiClient.get(`/doctor/patients/${patientId}/comments`);
    return response.data;
  }

  async addPatientComment(patientId: string, content: string): Promise<DoctorComment> {
    const response = await apiClient.post(`/doctor/patients/${patientId}/comments`, {
      content
    });
    return response.data;
  }

  async updatePatientComment(
    patientId: string,
    commentId: string,
    content: string
  ): Promise<DoctorComment> {
    const response = await apiClient.put(`/doctor/patients/${patientId}/comments/${commentId}`, {
      content
    });
    return response.data;
  }

  async deletePatientComment(patientId: string, commentId: string): Promise<void> {
    await apiClient.delete(`/doctor/patients/${patientId}/comments/${commentId}`);
  }

  // Test Result Management
  async updateTestResultNotes(
    patientId: string,
    testResultId: string,
    notes: string
  ): Promise<void> {
    await apiClient.patch(`/doctor/patients/${patientId}/test-results/${testResultId}`, {
      doctorNotes: notes
    });
  }

  async approveTestResult(
    patientId: string,
    testResultId: string
  ): Promise<void> {
    await apiClient.post(`/doctor/patients/${patientId}/test-results/${testResultId}/approve`);
  }

  // Search and Filter
  async searchPatients(query: string): Promise<Patient[]> {
    const response = await apiClient.get('/doctor/patients/search', {
      params: { q: query }
    });
    return response.data;
  }

  async filterRecommendations(filters: {
    priority?: 'high' | 'medium' | 'low';
    status?: 'active' | 'pending' | 'completed';
    patientId?: string;
  }): Promise<RecommendationListItem[]> {
    const response = await apiClient.get('/doctor/recommendations/filter', {
      params: filters
    });
    return response.data;
  }

  // Analytics
  async getDoctorDashboardStats(): Promise<{
    totalPatients: number;
    activeRecommendations: number;
    pendingTestResults: number;
    recentActivity: Array<{
      id: string;
      type: 'comment' | 'recommendation' | 'test_review';
      patientName: string;
      description: string;
      timestamp: string;
    }>;
  }> {
    const response = await apiClient.get('/doctor/dashboard/stats');
    return response.data;
  }
}

export const doctorService = new DoctorService();