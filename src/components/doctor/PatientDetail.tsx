import { Patient } from '@/types';
import { UserCircleIcon, PhoneIcon, EnvelopeIcon, CalendarIcon, MapPinIcon } from '@heroicons/react/24/outline';

interface PatientDetailProps {
  patient: Patient;
}

export default function PatientDetail({ patient }: PatientDetailProps) {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-start space-x-6">
          <UserCircleIcon className="h-20 w-20 text-gray-400 flex-shrink-0" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{patient.name}</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
                {patient.email}
              </div>
              {patient.phone && (
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                  {patient.phone}
                </div>
              )}
              <div className="flex items-center text-sm text-gray-600">
                <CalendarIcon className="h-5 w-5 mr-2 text-gray-400" />
                Born: {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'Not provided'}
              </div>
              {patient.address && (
                <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                  {patient.address}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Test Results</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {patient.testResults?.length || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Recommendations</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {patient.recommendations?.filter(r => r.status === 'active').length || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-500">Last Visit</h3>
          <p className="mt-2 text-xl font-semibold text-gray-900">
            {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'}
          </p>
        </div>
      </div>

      {patient.medicalHistory && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Medical History</h3>
          <div className="space-y-3">
            {patient.medicalHistory.allergies && patient.medicalHistory.allergies.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Allergies</h4>
                <p className="mt-1 text-sm text-gray-600">
                  {patient.medicalHistory.allergies.join(', ')}
                </p>
              </div>
            )}
            {patient.medicalHistory.conditions && patient.medicalHistory.conditions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Conditions</h4>
                <p className="mt-1 text-sm text-gray-600">
                  {patient.medicalHistory.conditions.join(', ')}
                </p>
              </div>
            )}
            {patient.medicalHistory.medications && patient.medicalHistory.medications.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">Current Medications</h4>
                <p className="mt-1 text-sm text-gray-600">
                  {patient.medicalHistory.medications.join(', ')}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {patient.notes && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notes</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{patient.notes}</p>
        </div>
      )}
    </div>
  );
}