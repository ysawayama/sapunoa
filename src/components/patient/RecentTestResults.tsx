import React, { useState } from 'react';
import Link from 'next/link';
import { ClockIcon, DocumentTextIcon, ChartBarIcon, BeakerIcon } from '@heroicons/react/24/outline';
import BloodTestHeatmap from './BloodTestHeatmap';
import Body3DNutrientMap from './Body3DNutrientMap';

interface TestResult {
  id: string;
  name: string;
  date: string;
  status: 'normal' | 'attention' | 'abnormal';
  summary: string;
}

interface RecentTestResultsProps {
  results?: TestResult[];
}

type ViewMode = 'list' | 'heatmap' | 'body';

export default function RecentTestResults({ results }: RecentTestResultsProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'normal':
        return 'text-green-600 bg-green-50';
      case 'attention':
        return 'text-yellow-600 bg-yellow-50';
      case 'abnormal':
        return 'text-red-600 bg-red-50';
    }
  };

  const getStatusText = (status: TestResult['status']) => {
    switch (status) {
      case 'normal':
        return '正常';
      case 'attention':
        return '要注意';
      case 'abnormal':
        return '異常';
    }
  };

  const defaultResults: TestResult[] = [
    {
      id: '1',
      name: '血液検査',
      date: '2024-01-10',
      status: 'normal',
      summary: 'すべての数値が正常範囲内です',
    },
    {
      id: '2',
      name: 'ビタミンD検査',
      date: '2024-01-08',
      status: 'attention',
      summary: 'ビタミンD値がやや低めです',
    },
    {
      id: '3',
      name: '甲状腺機能検査',
      date: '2024-01-05',
      status: 'normal',
      summary: 'TSH、T3、T4すべて正常です',
    },
  ];

  const testResults = results || defaultResults;

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">最近の検査結果</h2>
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <DocumentTextIcon className="h-4 w-4 inline mr-1" />
                リスト
              </button>
              <button
                onClick={() => setViewMode('heatmap')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'heatmap'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ChartBarIcon className="h-4 w-4 inline mr-1" />
                ヒートマップ
              </button>
              <button
                onClick={() => setViewMode('body')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'body'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BeakerIcon className="h-4 w-4 inline mr-1" />
                人体図
              </button>
            </div>
            <Link
              href="/test-results"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium ml-2"
            >
              すべて見る →
            </Link>
          </div>
        </div>
      
        {viewMode === 'list' && (
          <>
            <div className="space-y-4">
              {testResults.map((result) => (
                <div
                  key={result.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <h3 className="font-semibold text-gray-900">{result.name}</h3>
                        <span
                          className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            result.status
                          )}`}
                        >
                          {getStatusText(result.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{result.summary}</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 ml-4">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {new Date(result.date).toLocaleDateString('ja-JP')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {testResults.length === 0 && (
              <div className="text-center py-8">
                <DocumentTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">検査結果がまだありません</p>
              </div>
            )}
          </>
        )}
      </div>

      {viewMode === 'heatmap' && <BloodTestHeatmap />}
      {viewMode === 'body' && <Body3DNutrientMap />}
    </>
  );
}