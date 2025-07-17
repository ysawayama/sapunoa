'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

// ダミーデータ
interface TestResult {
  category: string;
  items: {
    name: string;
    value: number;
    unit: string;
    normalRange: string;
    status: 'normal' | 'high' | 'low';
  }[];
}

interface Supplement {
  id: string;
  name: string;
  image: string;
  description: string;
}

const dummyTestResults: TestResult[] = [
  {
    category: '血液検査',
    items: [
      { name: 'ヘモグロビン', value: 13.5, unit: 'g/dL', normalRange: '13.7-16.8', status: 'low' },
      { name: '赤血球数', value: 450, unit: '万/μL', normalRange: '435-555', status: 'normal' },
      { name: 'ビタミンD', value: 18, unit: 'ng/mL', normalRange: '30-100', status: 'low' },
      { name: 'フェリチン', value: 25, unit: 'ng/mL', normalRange: '30-400', status: 'low' },
    ],
  },
  {
    category: '尿検査',
    items: [
      { name: '尿蛋白', value: 0, unit: '-', normalRange: '陰性', status: 'normal' },
      { name: '尿糖', value: 0, unit: '-', normalRange: '陰性', status: 'normal' },
      { name: 'pH', value: 6.5, unit: '', normalRange: '4.5-8.0', status: 'normal' },
    ],
  },
];

const availableSupplements: Supplement[] = [
  {
    id: 's1',
    name: 'マルチビタミン&ミネラル',
    image: '/images/sapuri/multivitamin-mineral.png',
    description: '総合的な栄養補給に',
  },
  {
    id: 's2',
    name: 'ビタミンD',
    image: '/images/sapuri/vitamin-d.jpg',
    description: 'ビタミンD不足の改善に',
  },
  {
    id: 's3',
    name: '鉄分サプリメント',
    image: '/images/sapuri/multivitamin-mineral.png',
    description: '鉄分不足の改善に',
  },
  {
    id: 's4',
    name: 'DHA',
    image: '/images/sapuri/DHA.png',
    description: '血液サラサラ効果',
  },
  {
    id: 's5',
    name: 'ビタミンB群',
    image: '/images/sapuri/ビタミンB群.png',
    description: 'エネルギー代謝のサポート',
  },
];

export default function ConfirmResultPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId');
  
  const [selectedSupplements, setSelectedSupplements] = useState<string[]>([]);
  const [recommendationText, setRecommendationText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSupplementToggle = (supplementId: string) => {
    setSelectedSupplements(prev => 
      prev.includes(supplementId)
        ? prev.filter(id => id !== supplementId)
        : [...prev, supplementId]
    );
  };

  const handleSubmit = async () => {
    if (selectedSupplements.length === 0 || !recommendationText.trim()) {
      alert('サプリメントを選択し、推薦文を入力してください。');
      return;
    }

    setLoading(true);
    
    // 実際の実装では、ここでAPIを呼び出して保存
    setTimeout(() => {
      alert('推奨サプリと推薦文を送信しました。');
      router.push('/doctor/patients');
    }, 1000);
  };

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">検査結果確認</h1>
        <p className="mt-1 text-sm text-gray-500">
          患者の検査結果を確認し、サプリメントを推奨してください
        </p>
      </div>

      {/* 検査結果 */}
      <div className="space-y-4">
        {dummyTestResults.map((category) => (
          <div key={category.category} className="bg-white rounded-lg shadow">
            <div className="px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">{category.category}</h3>
            </div>
            <div className="p-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      項目
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      値
                    </th>
                    <th className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      基準値
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {category.items.map((item) => (
                    <tr key={item.name}>
                      <td className="py-2 text-sm text-gray-900">{item.name}</td>
                      <td className={`py-2 text-sm text-center font-medium ${
                        item.status === 'high' ? 'text-red-600' :
                        item.status === 'low' ? 'text-blue-600' :
                        'text-gray-900'
                      }`}>
                        {item.value} {item.unit}
                        {item.status !== 'normal' && (
                          <span className="ml-1 text-xs">
                            {item.status === 'high' ? '↑' : '↓'}
                          </span>
                        )}
                      </td>
                      <td className="py-2 text-sm text-center text-gray-500">
                        {item.normalRange}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* サプリメント推奨 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">サプリメント推奨</h3>
        
        <div className="space-y-3 mb-6">
          {availableSupplements.map((supplement) => (
            <label
              key={supplement.id}
              className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedSupplements.includes(supplement.id)}
                onChange={() => handleSupplementToggle(supplement.id)}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={supplement.image}
                  alt={supplement.name}
                  fill
                  className="object-contain rounded"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{supplement.name}</p>
                <p className="text-sm text-gray-500">{supplement.description}</p>
              </div>
            </label>
          ))}
        </div>

        {/* 推薦文 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            サプリの推薦文を書く
          </label>
          <textarea
            value={recommendationText}
            onChange={(e) => setRecommendationText(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="検査結果に基づいた推薦理由を記入してください。患者様が理解しやすい言葉でお願いします。"
          />
        </div>

        {/* 送信ボタン */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 px-4 text-white font-medium rounded-md transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? '送信中...' : '送信'}
        </button>
      </div>
    </div>
  );
}