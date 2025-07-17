'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import PatientDetail from '@/components/doctor/PatientDetail';
import TestResultReview from '@/components/doctor/TestResultReview';
import RecommendationEditor from '@/components/doctor/RecommendationEditor';
import CommentEditor from '@/components/doctor/CommentEditor';
import { doctorService } from '@/services/doctor.service';
import { Patient, TestResult } from '@/types';

export default function PatientDetailPage() {
  const params = useParams();
  const patientId = params.id as string;
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'tests' | 'recommendations' | 'comments'>('details');

  useEffect(() => {
    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const [patientData, resultsData] = await Promise.all([
        doctorService.getPatient(patientId),
        doctorService.getPatientTestResults(patientId)
      ]);
      setPatient(patientData);
      setTestResults(resultsData);
    } catch (err) {
      setError('Failed to fetch patient data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Patient not found'}</p>
        <Link
          href="/doctor/patients"
          className="mt-4 inline-flex items-center px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to patients
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'Patient Details' },
    { id: 'tests', label: 'Test Results' },
    { id: 'recommendations', label: 'Recommendations' },
    { id: 'comments', label: 'Doctor Comments' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/doctor/patients"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <PatientDetail patient={patient} />
          )}
          
          {activeTab === 'tests' && (
            <TestResultReview 
              testResults={testResults}
              patientId={patientId}
            />
          )}
          
          {activeTab === 'recommendations' && (
            <RecommendationEditor
              patientId={patientId}
              testResults={testResults}
            />
          )}
          
          {activeTab === 'comments' && (
            <CommentEditor
              patientId={patientId}
            />
          )}
        </div>
      </div>
    </div>
  );
}