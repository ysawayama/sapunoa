"use client"

import { useState } from 'react'
import Link from 'next/link'

interface TestResult {
  id: string
  date: string
  type: string
  status: 'normal' | 'warning' | 'abnormal'
}

export default function TestResultsListPage() {
  const [activeTab, setActiveTab] = useState<'blood' | 'urine'>('blood')

  const bloodTests: TestResult[] = [
    { id: '1', date: '2024年1月15日', type: '血液検査', status: 'warning' },
    { id: '2', date: '2023年12月10日', type: '血液検査', status: 'normal' },
    { id: '3', date: '2023年11月5日', type: '血液検査', status: 'normal' },
  ]

  const urineTests: TestResult[] = [
    { id: '4', date: '2024年1月10日', type: '尿検査', status: 'warning' },
    { id: '5', date: '2023年12月20日', type: '尿検査', status: 'normal' },
  ]

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'normal':
        return <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">正常</span>
      case 'warning':
        return <span className="text-xs px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">要注意</span>
      case 'abnormal':
        return <span className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full">異常</span>
    }
  }

  const displayTests = activeTab === 'blood' ? bloodTests : urineTests

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <span className="text-xl">←</span>
            </Link>
            <h1 className="text-lg font-bold text-gray-900">検査結果一覧</h1>
          </div>
        </div>
      </div>

      {/* タブ */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('blood')}
              className={`py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'blood'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              血液検査
            </button>
            <button
              onClick={() => setActiveTab('urine')}
              className={`py-3 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'urine'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              尿検査
            </button>
          </div>
        </div>
      </div>

      {/* 検査結果リスト */}
      <div className="px-4 py-6">
        <div className="space-y-4">
          {displayTests.map((test) => (
            <Link
              key={test.id}
              href={activeTab === 'blood' ? `/test-results/blood/${test.id}` : `/test-results/urine/${test.id}`}
              className="block bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-98 transition-transform"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{test.type}</h3>
                  <p className="text-sm text-gray-500 mt-1">{test.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(test.status)}
                  <span className="text-gray-400">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 新規検査結果追加ボタン */}
        <div className="mt-8">
          <Link
            href="/test-results/upload"
            className="flex items-center justify-center gap-2 w-full py-4 bg-primary-100 text-primary-700 rounded-2xl font-medium"
          >
            <span className="text-xl">📷</span>
            <span>新しい検査結果をアップロード</span>
          </Link>
        </div>

        {/* 栄養分析レポート */}
        <div className="mt-6">
          <Link
            href="/test-results/1"
            className="block bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-2xl p-6 shadow-md"
          >
            <h3 className="text-lg font-bold mb-2">栄養分析レポート</h3>
            <p className="text-sm opacity-90">最新の検査結果から、あなたの栄養状態を総合的に分析</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm opacity-80">最終更新: 2024年1月15日</span>
              <span className="text-xl">→</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}