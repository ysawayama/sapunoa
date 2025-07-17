import { useState, useEffect } from 'react';
import { TestResult } from '@/types';
import { doctorService } from '@/services/doctor.service';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface RecommendationEditorProps {
  patientId: string;
  testResults: TestResult[];
}

interface Recommendation {
  id?: string;
  supplementName: string;
  dosage: string;
  frequency: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
  notes: string;
}

export default function RecommendationEditor({ patientId, testResults }: RecommendationEditorProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, [patientId]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getPatientRecommendations(patientId);
      setRecommendations(data);
    } catch (err) {
      setError('Failed to fetch recommendations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addRecommendation = () => {
    setRecommendations([
      ...recommendations,
      {
        supplementName: '',
        dosage: '',
        frequency: '',
        duration: '',
        priority: 'medium',
        notes: ''
      }
    ]);
  };

  const updateRecommendation = (index: number, field: keyof Recommendation, value: string) => {
    const updated = [...recommendations];
    updated[index] = { ...updated[index], [field]: value };
    setRecommendations(updated);
  };

  const removeRecommendation = (index: number) => {
    setRecommendations(recommendations.filter((_, i) => i !== index));
  };

  const saveRecommendations = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);
      
      await doctorService.updatePatientRecommendations(patientId, recommendations);
      setSuccessMessage('Recommendations saved successfully');
      
      // Refresh recommendations after save
      await fetchRecommendations();
    } catch (err) {
      setError('Failed to save recommendations');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <p className="text-sm text-green-800">{successMessage}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Supplement Recommendations</h3>
        <button
          onClick={addRecommendation}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Recommendation
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-800">
            Based on the latest test results from {new Date(testResults[0].testDate).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Supplement Name
                </label>
                <input
                  type="text"
                  value={rec.supplementName}
                  onChange={(e) => updateRecommendation(index, 'supplementName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Vitamin D3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dosage
                </label>
                <input
                  type="text"
                  value={rec.dosage}
                  onChange={(e) => updateRecommendation(index, 'dosage', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., 1000 IU"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Frequency
                </label>
                <input
                  type="text"
                  value={rec.frequency}
                  onChange={(e) => updateRecommendation(index, 'frequency', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., Once daily"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Duration
                </label>
                <input
                  type="text"
                  value={rec.duration}
                  onChange={(e) => updateRecommendation(index, 'duration', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="e.g., 3 months"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  value={rec.priority}
                  onChange={(e) => updateRecommendation(index, 'priority', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  value={rec.notes}
                  onChange={(e) => updateRecommendation(index, 'notes', e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Additional instructions or notes..."
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => removeRecommendation(index)}
                className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No recommendations yet. Click "Add Recommendation" to create one.</p>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <button
          onClick={fetchRecommendations}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={saveRecommendations}
          disabled={saving}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Recommendations'}
        </button>
      </div>
    </div>
  );
}