import { useState } from 'react';
import { TestResult } from '@/types';
import { DocumentTextIcon, CalendarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface TestResultReviewProps {
  testResults: TestResult[];
  patientId: string;
}

export default function TestResultReview({ testResults, patientId }: TestResultReviewProps) {
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  if (testResults.length === 0) {
    return (
      <div className="text-center py-12">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No test results</h3>
        <p className="mt-1 text-sm text-gray-500">This patient has no test results yet.</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <DocumentTextIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <XCircleIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Test Results</h3>
          <div className="space-y-3">
            {testResults.map((result) => (
              <div
                key={result.id}
                onClick={() => setSelectedResult(result)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedResult?.id === result.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(result.status)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{result.testType}</p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {new Date(result.testDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(result.status)}`}>
                    {result.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedResult && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Result Details</h3>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Test Type</h4>
                  <p className="mt-1 text-sm text-gray-900">{selectedResult.testType}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Test Date</h4>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedResult.testDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700">Status</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedResult.status)}`}>
                    {selectedResult.status}
                  </span>
                </div>

                {selectedResult.results && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Test Results</h4>
                    <div className="bg-gray-50 rounded-md p-4 space-y-2">
                      {Object.entries(selectedResult.results).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-sm text-gray-600">{key}:</span>
                          <span className="text-sm font-medium text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedResult.analysis && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">AI Analysis</h4>
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                      {selectedResult.analysis}
                    </p>
                  </div>
                )}

                {selectedResult.doctorNotes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Doctor's Notes</h4>
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-wrap">
                      {selectedResult.doctorNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}