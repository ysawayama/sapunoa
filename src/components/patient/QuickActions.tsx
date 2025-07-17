import React from 'react';
import Link from 'next/link';
import {
  CalendarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline';

const actions = [
  {
    name: '予約を取る',
    href: '/appointments/new',
    icon: CalendarIcon,
    description: '医師との診察予約',
    color: 'bg-blue-500',
  },
  {
    name: '検査結果を見る',
    href: '/test-results',
    icon: DocumentTextIcon,
    description: '過去の検査結果一覧',
    color: 'bg-green-500',
  },
  {
    name: '医師に相談',
    href: '/chat',
    icon: ChatBubbleLeftRightIcon,
    description: 'オンライン相談',
    color: 'bg-purple-500',
  },
  {
    name: 'サプリメント管理',
    href: '/supplements',
    icon: BeakerIcon,
    description: '服用中のサプリ',
    color: 'bg-orange-500',
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">クイックアクション</h2>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group relative rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div>
              <span
                className={`
                  inline-flex rounded-lg p-3 ring-4 ring-white
                  ${action.color}
                `}
              >
                <action.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </span>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                {action.name}
              </h3>
              <p className="mt-1 text-xs text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}