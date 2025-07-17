import React from 'react';
import { BellIcon, CogIcon } from '@heroicons/react/24/outline';

interface PatientHeaderProps {
  patient?: {
    name: string;
    email: string;
    avatar?: string;
    lastCheckup?: string;
  };
}

export default function PatientHeader({ patient }: PatientHeaderProps) {
  const defaultPatient = {
    name: 'ゲストユーザー',
    email: 'guest@example.com',
    lastCheckup: '2024-01-01',
  };

  const patientData = patient || defaultPatient;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {patientData.avatar ? (
                <img
                  className="h-10 w-10 rounded-full"
                  src={patientData.avatar}
                  alt={patientData.name}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {patientData.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="ml-4">
              <h1 className="text-lg font-semibold text-gray-900">
                こんにちは、{patientData.name}さん
              </h1>
              <p className="text-sm text-gray-500">
                最終検査日: {new Date(patientData.lastCheckup).toLocaleDateString('ja-JP')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-500">
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <CogIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}