import { Patient } from '@/types';
import Link from 'next/link';
import { UserCircleIcon, CalendarIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

interface PatientListProps {
  patients: Patient[];
}

export default function PatientList({ patients }: PatientListProps) {
  if (patients.length === 0) {
    return (
      <div className="text-center py-12">
        <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">No patients</h3>
        <p className="mt-1 text-sm text-gray-500">No patients found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {patients.map((patient) => (
          <li key={patient.id}>
            <Link
              href={`/doctor/patients/${patient.id}`}
              className="block hover:bg-gray-50 px-6 py-4 transition duration-150 ease-in-out"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      {patient.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Last visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'Never'}
                </div>
              </div>
              {patient.testResults && patient.testResults.length > 0 && (
                <div className="mt-2 ml-14">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {patient.testResults.length} test results
                  </span>
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}