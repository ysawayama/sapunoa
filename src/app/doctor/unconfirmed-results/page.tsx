'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UserIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

// ダミーデータ
interface UnconfirmedResult {
  id: string;
  patientId: string;
  patientName: string;
  testDate: string;
  testType: string;
  status: 'unconfirmed' | 'confirmed';
}

const dummyUnconfirmedResults: UnconfirmedResult[] = [
  {
    id: 'test-1',
    patientId: 'patient-1',
    patientName: '山田 花子',
    testDate: '2025-01-15',
    testType: '血液検査・尿検査',
    status: 'unconfirmed',
  },
  {
    id: 'test-2',
    patientId: 'patient-2',
    patientName: '鈴木 太郎',
    testDate: '2025-01-14',
    testType: '血液検査',
    status: 'unconfirmed',
  },
  {
    id: 'test-3',
    patientId: 'patient-3',
    patientName: '佐藤 美咲',
    testDate: '2025-01-13',
    testType: '尿検査',
    status: 'unconfirmed',
  },
];

export default function UnconfirmedResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<UnconfirmedResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ダミーデータの読み込みシミュレーション
    setTimeout(() => {
      setResults(dummyUnconfirmedResults);
      setLoading(false);
    }, 500);
  }, []);

  const handleConfirmResult = (testId: string, patientId: string) => {
    // 検査結果確認ページへ遷移
    router.push(`/doctor/confirm-result/${testId}?patientId=${patientId}`);
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">未確認の検査結果</h1>
        <p className="mt-1 text-sm text-gray-500">
          確認が必要な患者の検査結果一覧
        </p>
      </div>

      {results.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">確認が必要な検査結果はありません</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <ul className="divide-y divide-gray-200">
            {results.map((result) => (
              <li key={result.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-gray-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {result.patientName}
                      </p>
                      <div className="mt-1 text-sm text-gray-500">
                        <p>検査日: {new Date(result.testDate).toLocaleDateString('ja-JP')}</p>
                        <p>検査項目: {result.testType}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleConfirmResult(result.id, result.patientId)}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    検査結果を確認する
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}