"use client"

import Link from 'next/link'
import { useState } from 'react'

interface TestItem {
  category: string
  items: {
    name: string
    standardRange: string
    unit: string
    value: string | number
    status: 'normal' | 'high' | 'low'
  }[]
}

export default function BloodTestDetailPage({ params }: { params: { id: string } }) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'table' | 'card'>('card')

  // ダミーデータ
  const testData: TestItem[] = [
    {
      category: '身体計測・血圧測定',
      items: [
        { name: '身長', standardRange: '-', unit: 'cm', value: '165.0', status: 'normal' },
        { name: '体重', standardRange: '-', unit: 'kg', value: '58.5', status: 'normal' },
        { name: 'BMI', standardRange: '18.5～24.9', unit: '-', value: '21.5', status: 'normal' },
        { name: '腹囲', standardRange: '男性84.9以下\n女性89.9以下', unit: 'cm', value: '78.0', status: 'normal' },
        { name: '血圧（上）', standardRange: '139以下', unit: 'mmHg', value: '118', status: 'normal' },
        { name: '血圧（下）', standardRange: '89以下', unit: 'mmHg', value: '72', status: 'normal' },
      ]
    },
    {
      category: '糖代謝検査',
      items: [
        { name: '血糖値', standardRange: '65～109', unit: 'mg/dL', value: '92', status: 'normal' },
        { name: '血糖値（食後）', standardRange: '139以下', unit: 'mg/dL', value: '-', status: 'normal' },
        { name: 'HbA1c', standardRange: '4.6～6.2', unit: '%', value: '5.2', status: 'normal' },
      ]
    },
    {
      category: '脂質代謝検査',
      items: [
        { name: '総コレステロール', standardRange: '140～219', unit: 'mg/dL', value: '245', status: 'high' },
        { name: '中性脂肪', standardRange: '30～149', unit: 'mg/dL', value: '165', status: 'high' },
        { name: 'HDLコレステロール', standardRange: '40～99', unit: 'mg/dL', value: '52', status: 'normal' },
        { name: 'LDLコレステロール', standardRange: '139以下', unit: 'mg/dL', value: '158', status: 'high' },
      ]
    },
    {
      category: 'たんぱく代謝・肝機能検査',
      items: [
        { name: '総たんぱく', standardRange: '6.5～8.0', unit: 'g/dL', value: '7.2', status: 'normal' },
        { name: 'アルブミン', standardRange: '4.0～5.1', unit: 'g/dL', value: '4.5', status: 'normal' },
        { name: 'AST(GOT)', standardRange: '45以下', unit: 'U/L', value: '28', status: 'normal' },
        { name: 'ALT(GPT)', standardRange: '39以下', unit: 'U/L', value: '35', status: 'normal' },
        { name: 'γ-GT(γ-GTP)', standardRange: '79以下', unit: 'U/L', value: '45', status: 'normal' },
      ]
    },
    {
      category: '腎機能検査',
      items: [
        { name: 'クレアチニン', standardRange: '男性1.00以下\n女性0.70以下', unit: 'mg/dL', value: '0.85', status: 'normal' },
        { name: 'eGFR', standardRange: '60以上', unit: 'mL/分/1.73m²', value: '72.5', status: 'normal' },
        { name: '尿素窒素', standardRange: '8～20', unit: 'mg/dL', value: '15.2', status: 'normal' },
      ]
    },
    {
      category: '血液一般検査',
      items: [
        { name: '赤血球数', standardRange: '男性400～539\n女性360～489', unit: '万/μL', value: '465', status: 'normal' },
        { name: 'ヘモグロビン', standardRange: '男性13.1～16.6\n女性12.1～14.6', unit: 'g/dL', value: '14.8', status: 'normal' },
        { name: 'ヘマトクリット', standardRange: '男性38.5～48.9\n女性35.5～43.9', unit: '%', value: '42.5', status: 'normal' },
        { name: '白血球数', standardRange: '3300～8600', unit: '/μL', value: '5800', status: 'normal' },
        { name: '血小板数', standardRange: '15.8～34.8', unit: '万/μL', value: '22.5', status: 'normal' },
      ]
    },
    {
      category: 'ビタミン・ミネラル検査',
      items: [
        { name: 'ビタミンD', standardRange: '30～100', unit: 'ng/mL', value: '18', status: 'low' },
        { name: 'ビタミンB12', standardRange: '233～914', unit: 'pg/mL', value: '195', status: 'low' },
        { name: '葉酸', standardRange: '3.6～12.9', unit: 'ng/mL', value: '8.5', status: 'normal' },
        { name: '鉄', standardRange: '男性54～200\n女性48～154', unit: 'μg/dL', value: '65', status: 'normal' },
        { name: 'フェリチン', standardRange: '男性20～250\n女性10～120', unit: 'ng/mL', value: '35', status: 'normal' },
      ]
    }
  ]

  const categories = ['all', ...testData.map(item => item.category)]
  const filteredData = activeCategory === 'all' ? testData : testData.filter(item => item.category === activeCategory)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high':
        return <span className="text-red-500 font-bold">↑</span>
      case 'low':
        return <span className="text-blue-500 font-bold">↓</span>
      default:
        return <span className="text-green-500">-</span>
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
      case 'low':
        return 'bg-red-50 border-red-200'
      default:
        return 'bg-white'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/test-results">
                <span className="text-xl">←</span>
              </Link>
              <h1 className="text-lg font-bold text-gray-900">血液検査結果</h1>
            </div>
            <span className="text-sm text-gray-500">2024年1月15日</span>
          </div>
        </div>
      </div>

      {/* カテゴリフィルターと表示切替 */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category === 'all' ? '全て' : category}
              </button>
            ))}
          </div>
          
          {/* 表示モード切替 */}
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setViewMode('card')}
              className={`px-3 py-1 text-xs rounded-lg ${
                viewMode === 'card' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              カード表示
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 text-xs rounded-lg ${
                viewMode === 'table' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              表形式
            </button>
          </div>
        </div>
      </div>

      {/* 検査結果 */}
      <div className="px-4 py-6 space-y-6">
        {viewMode === 'card' ? (
          // カード表示（モバイル向け）
          filteredData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3">
                <h2 className="font-bold">{category.category}</h2>
              </div>
              
              <div className="p-4 space-y-3">
                {category.items.map((item, index) => (
                  <div 
                    key={index} 
                    className={`rounded-lg p-3 ${
                      item.status === 'high' || item.status === 'low' 
                        ? 'bg-red-50 border border-red-200' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm text-gray-900">{item.name}</h4>
                      {getStatusIcon(item.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">基準値: </span>
                        <span className="text-gray-700">{item.standardRange}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">測定値: </span>
                        <span className={`font-bold ${
                          item.status === 'normal' ? 'text-gray-900' : 'text-red-600'
                        }`}>
                          {item.value} {item.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          // テーブル表示（従来の表示）
          filteredData.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-3">
                <h2 className="font-bold">{category.category}</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="bg-gray-50 text-[10px] sm:text-xs text-gray-600">
                      <th className="text-left px-2 sm:px-4 py-2 sm:py-3 font-medium w-[30%]">検査項目</th>
                      <th className="text-left px-2 sm:px-4 py-2 sm:py-3 font-medium w-[25%]">基準値</th>
                      <th className="text-center px-1 sm:px-2 py-2 sm:py-3 font-medium w-[15%]">単位</th>
                      <th className="text-center px-1 sm:px-2 py-2 sm:py-3 font-medium w-[20%]">結果</th>
                      <th className="text-center px-1 sm:px-2 py-2 sm:py-3 font-medium w-[10%]">判定</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {category.items.map((item, index) => (
                      <tr key={index} className={getStatusColor(item.status)}>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-gray-600 whitespace-pre-line">
                          {item.standardRange}
                        </td>
                        <td className="px-1 sm:px-2 py-2 sm:py-3 text-[10px] sm:text-xs text-gray-600 text-center">
                          {item.unit}
                        </td>
                        <td className="px-1 sm:px-2 py-2 sm:py-3 text-xs sm:text-sm font-bold text-center">
                          {item.value}
                        </td>
                        <td className="px-1 sm:px-2 py-2 sm:py-3 text-center">
                          {getStatusIcon(item.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}

        {/* サマリーカード */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 border border-orange-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-xl">📊</span>
            検査結果サマリー
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              今回の検査で <span className="font-bold text-red-600">3項目</span> の異常値が見つかりました。
            </p>
            <ul className="space-y-1 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>脂質代謝（コレステロール値）が高めです</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span>ビタミンD、ビタミンB12が不足しています</span>
              </li>
            </ul>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="space-y-3">
          <Link
            href="/test-results/1"
            className="block w-full bg-primary-600 text-white py-4 rounded-xl font-medium text-center shadow-md active:scale-95 transition-transform"
          >
            栄養分析レポートを見る
          </Link>
          <Link
            href="/consultation"
            className="block w-full bg-white border-2 border-gray-200 text-gray-700 py-4 rounded-xl font-medium text-center active:scale-95 transition-transform"
          >
            医師に相談する
          </Link>
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}