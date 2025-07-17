import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  image?: string;
}

interface SupplementRecommendationsProps {
  recommendations?: Supplement[];
}

export default function SupplementRecommendations({ recommendations }: SupplementRecommendationsProps) {
  const getPriorityColor = (priority: Supplement['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-200 bg-red-50';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50';
      case 'low':
        return 'border-green-200 bg-green-50';
    }
  };

  const getPriorityText = (priority: Supplement['priority']) => {
    switch (priority) {
      case 'high':
        return '高優先度';
      case 'medium':
        return '中優先度';
      case 'low':
        return '低優先度';
    }
  };

  const defaultRecommendations: Supplement[] = [
    {
      id: '1',
      name: 'ビタミンD3',
      dosage: '2000 IU/日',
      reason: '血中ビタミンD濃度が低いため',
      priority: 'high',
    },
    {
      id: '2',
      name: 'オメガ3脂肪酸',
      dosage: '1000mg/日',
      reason: '心血管系の健康維持のため',
      priority: 'medium',
    },
    {
      id: '3',
      name: 'マグネシウム',
      dosage: '400mg/日',
      reason: '睡眠の質改善のため',
      priority: 'low',
    },
  ];

  const supplements = recommendations || defaultRecommendations;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">推奨サプリメント</h2>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          詳細を見る →
        </button>
      </div>
      
      <div className="space-y-3">
        {supplements.map((supplement) => (
          <div
            key={supplement.id}
            className={`border rounded-lg p-4 ${getPriorityColor(supplement.priority)}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-gray-900">{supplement.name}</h3>
              <span className="text-xs font-medium text-gray-600">
                {getPriorityText(supplement.priority)}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">用量: {supplement.dosage}</p>
            <p className="text-sm text-gray-500">{supplement.reason}</p>
            <button className="mt-3 flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium">
              <ShoppingCartIcon className="h-4 w-4 mr-1" />
              購入する
            </button>
          </div>
        ))}
      </div>
      
      {supplements.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">現在、推奨サプリメントはありません</p>
        </div>
      )}
      
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          ※ サプリメントの使用前に必ず医師にご相談ください
        </p>
      </div>
    </div>
  );
}