'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  UsersIcon, 
  DocumentTextIcon,
  CalendarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function DoctorDashboard() {
  const [stats, setStats] = useState({
    totalPatients: 125,
    unconfirmedResults: 18,
    todayAppointments: 8,
    monthlyRevenue: 1250000
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">医師用ダッシュボード</h1>
        <p className="mt-1 text-sm text-gray-500">
          Dr. 佐藤様、本日もお疲れ様です
        </p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">担当患者数</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
          </div>
        </div>

        <Link href="/doctor/unconfirmed-results" className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">未確認の検査結果</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unconfirmedResults}</p>
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">本日の予約</p>
              <p className="text-2xl font-bold text-gray-900">{stats.todayAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">今月の売上</p>
              <p className="text-2xl font-bold text-gray-900">¥{stats.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 最近の患者リスト */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">最近の患者</h3>
        </div>
        <ul className="divide-y divide-gray-200">
          {[
            { name: '山田 花子', lastVisit: '2025-01-15', status: '要フォロー' },
            { name: '鈴木 太郎', lastVisit: '2025-01-14', status: '正常' },
            { name: '佐藤 美咲', lastVisit: '2025-01-13', status: '要フォロー' },
          ].map((patient, index) => (
            <li key={index} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-500">最終来院: {patient.lastVisit}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  patient.status === '要フォロー' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {patient.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}