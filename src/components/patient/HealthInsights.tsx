import React from 'react';
import { LightBulbIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Insight {
  id: string;
  type: 'tip' | 'warning' | 'success';
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

interface HealthInsightsProps {
  insights?: Insight[];
}

export default function HealthInsights({ insights }: HealthInsightsProps) {
  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'tip':
        return <LightBulbIcon className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
  };

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'tip':
        return 'bg-blue-50 border-blue-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'success':
        return 'bg-green-50 border-green-200';
    }
  };

  const defaultInsights: Insight[] = [
    {
      id: '1',
      type: 'tip',
      title: '水分補給を心がけましょう',
      description: '1日2リットルの水分摂取が理想的です。こまめに水を飲む習慣をつけましょう。',
      action: {
        label: '詳しく見る',
        href: '/insights/hydration',
      },
    },
    {
      id: '2',
      type: 'warning',
      title: 'ビタミンD不足の可能性',
      description: '最近の検査結果から、ビタミンD値が低めです。日光浴やサプリメントの摂取を検討してください。',
      action: {
        label: '対策を見る',
        href: '/supplements',
      },
    },
    {
      id: '3',
      type: 'success',
      title: '運動習慣が改善されています',
      description: '先月と比較して、活動量が20%増加しています。この調子で続けましょう！',
    },
  ];

  const healthInsights = insights || defaultInsights;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">健康インサイト</h2>
      
      <div className="space-y-4">
        {healthInsights.map((insight) => (
          <div
            key={insight.id}
            className={`border rounded-lg p-4 ${getInsightColor(insight.type)}`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">{getInsightIcon(insight.type)}</div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-semibold text-gray-900">{insight.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{insight.description}</p>
                {insight.action && (
                  <a
                    href={insight.action.href}
                    className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    {insight.action.label} →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {healthInsights.length === 0 && (
        <div className="text-center py-8">
          <LightBulbIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">新しいインサイトはありません</p>
        </div>
      )}
    </div>
  );
}