"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import PatientHeader from '@/components/patient/PatientHeader';
import HealthScoreCard from '@/components/patient/HealthScoreCard';
import RecentTestResults from '@/components/patient/RecentTestResults';
import SupplementRecommendations from '@/components/patient/SupplementRecommendations';
import QuickActions from '@/components/patient/QuickActions';
import HealthInsights from '@/components/patient/HealthInsights';
import { usePatientData } from '@/hooks/usePatientData';
import HealthRadarChart from '@/components/charts/HealthRadarChart';
import BodyDiagram from '@/components/charts/BodyDiagram';
import AnatomicalBodyDiagram from '@/components/charts/AnatomicalBodyDiagram';
import NutrientHeatmap from '@/components/charts/NutrientHeatmap';
import SupplementRecommendationCard from '@/components/patient/SupplementRecommendationCard';
import {
  HomeIcon,
  DocumentTextIcon,
  CalendarIcon,
  BeakerIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

interface MockUser {
  id: string
  name: string
  role: string
  email: string
  medicalRecordNumber?: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<MockUser | null>(null)
  const [viewMode, setViewMode] = useState<'patient' | 'doctor'>('patient');
  const mockUserId = 'demo-patient-1';
  const { patientData, isLoading, error } = usePatientData(mockUserId);

  useEffect(() => {
    // セッションストレージからユーザー情報を取得
    const mockUserStr = sessionStorage.getItem('mockUser')
    if (mockUserStr) {
      const userData = JSON.parse(mockUserStr)
      setUser(userData)
      setViewMode(userData.role === 'DOCTOR' ? 'doctor' : 'patient')
    }
  }, [])

  if (!user && !patientData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* モバイル用簡易ダッシュボード */}
        <MobileDashboard />
      </div>
    )
  }

  const isPatient = viewMode === 'patient'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー with logo */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center px-4 py-2">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="/images/sapunoa-logo2.png"
              alt="サプノア"
              width={32}
              height={32}
              className="h-8 w-8"
              priority
            />
            <span className="text-lg font-semibold text-gray-900">サプノア</span>
          </Link>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name || '山田 花子'}さん</span>
            <button
              onClick={() => {
                sessionStorage.removeItem('mockUser')
                router.push('/')
              }}
              className="text-sm text-gray-500"
            >
              ログアウト
            </button>
          </div>
        </div>
      </header>
      
      {/* Main content with padding for header and bottom nav */}
      <main className="pt-14 pb-20">

      {/* モバイル最適化されたコンテンツ */}
      <MobileDashboard user={user} isPatient={isPatient} />

      </main>
      
      {/* ボトムナビゲーション - 患者用のみ */}
      {isPatient && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="grid grid-cols-5">
            <Link
              href="/dashboard"
              className="flex flex-col items-center py-2 text-xs text-primary-600"
            >
              <HomeIcon className="h-5 w-5 mb-1" aria-hidden="true" />
              <span className="text-[10px]">ホーム</span>
            </Link>
            <Link
              href="/test-results"
              className="flex flex-col items-center py-2 text-xs text-gray-400"
            >
              <DocumentTextIcon className="h-5 w-5 mb-1" aria-hidden="true" />
              <span className="text-[10px]">検査結果</span>
            </Link>
            <Link
              href="/appointments"
              className="flex flex-col items-center py-2 text-xs text-gray-400"
            >
              <CalendarIcon className="h-5 w-5 mb-1" aria-hidden="true" />
              <span className="text-[10px]">予約</span>
            </Link>
            <Link
              href="/supplements"
              className="flex flex-col items-center py-2 text-xs text-gray-400"
            >
              <BeakerIcon className="h-5 w-5 mb-1" aria-hidden="true" />
              <span className="text-[10px]">サプリ</span>
            </Link>
            <Link
              href="/profile"
              className="flex flex-col items-center py-2 text-xs text-gray-400"
            >
              <UserIcon className="h-5 w-5 mb-1" aria-hidden="true" />
              <span className="text-[10px]">マイページ</span>
            </Link>
          </div>
        </nav>
      )}
    </div>
  )
}

// モバイル用ダッシュボードコンポーネント
function MobileDashboard({ user = null, isPatient = true }: { user?: MockUser | null, isPatient?: boolean }) {
  const [activeChartTab, setActiveChartTab] = useState<'nutrition' | 'energy' | 'recovery' | 'immunity'>('nutrition')
  const [bodyGender, setBodyGender] = useState<'male' | 'female'>('male')

  // 各カテゴリのデータ
  const chartData = {
    nutrition: [
      { label: 'ビタミンA', value: 85, status: 'good' as const },
      { label: 'ビタミンD', value: 35, status: 'danger' as const },
      { label: 'ビタミンB1', value: 78, status: 'good' as const },
      { label: 'ビタミンB12', value: 45, status: 'warning' as const },
      { label: 'ビタミンC', value: 92, status: 'good' as const },
      { label: '鉄分', value: 60, status: 'warning' as const },
      { label: 'カルシウム', value: 70, status: 'good' as const },
      { label: '亜鉛', value: 80, status: 'good' as const },
    ],
    energy: [
      { label: 'TP(総蛋白)', value: 75, status: 'good' as const },
      { label: 'ALB(アルブミン)', value: 82, status: 'good' as const },
      { label: 'HGB(ヘモグロビン)', value: 68, status: 'warning' as const },
      { label: 'BUN(尿素窒素)', value: 55, status: 'warning' as const },
      { label: 'グルコース', value: 88, status: 'good' as const },
      { label: 'フェリチン', value: 42, status: 'warning' as const },
      { label: 'コルチゾール', value: 70, status: 'good' as const },
    ],
    recovery: [
      { label: 'CK(CPK)', value: 65, status: 'warning' as const },
      { label: 'WBC(白血球)', value: 78, status: 'good' as const },
      { label: 'CRP', value: 85, status: 'good' as const },
      { label: 'LDH', value: 72, status: 'good' as const },
      { label: 'AST(GOT)', value: 80, status: 'good' as const },
      { label: 'ALT(GPT)', value: 76, status: 'good' as const },
      { label: 'γ-GTP', value: 88, status: 'good' as const },
    ],
    immunity: [
      { label: 'リンパ球', value: 70, status: 'good' as const },
      { label: '好中球', value: 75, status: 'good' as const },
      { label: 'IgG', value: 68, status: 'warning' as const },
      { label: 'IgA', value: 72, status: 'good' as const },
      { label: 'IgM', value: 65, status: 'warning' as const },
      { label: 'NK細胞活性', value: 58, status: 'warning' as const },
      { label: 'インターフェロン', value: 78, status: 'good' as const },
      { label: 'サイトカイン', value: 82, status: 'good' as const },
    ]
  }

  return (
    <div className="px-4 py-6 space-y-6">
      {isPatient ? (
        <>
          {/* 健康スコア概要 */}
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">健康スコア</h2>
              <span className="text-sm opacity-80">2024年1月更新</span>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">72</span>
              <span className="text-xl mb-2">/100</span>
            </div>
            <p className="text-sm mt-2 opacity-90">
              ビタミンD不足により改善の余地があります
            </p>
            <Link
              href="/test-results"
              className="inline-block mt-4 bg-white bg-opacity-20 px-4 py-2 rounded-lg text-sm font-medium"
            >
              詳細を見る →
            </Link>
          </div>

          {/* タブ付きレーダーチャート */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            {/* タブヘッダー */}
            <div className="border-b border-gray-100">
              <div className="flex overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setActiveChartTab('nutrition')}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeChartTab === 'nutrition'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  栄養バランス
                </button>
                <button
                  onClick={() => setActiveChartTab('energy')}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeChartTab === 'energy'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  エネルギー
                </button>
                <button
                  onClick={() => setActiveChartTab('recovery')}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeChartTab === 'recovery'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  リカバリー
                </button>
                <button
                  onClick={() => setActiveChartTab('immunity')}
                  className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeChartTab === 'immunity'
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  免疫
                </button>
              </div>
            </div>
            
            {/* チャートコンテンツ */}
            <div className="p-4">
              <div className="mb-4 text-center">
                <h3 className="text-lg font-bold text-gray-900">
                  {activeChartTab === 'nutrition' && '栄養バランス'}
                  {activeChartTab === 'energy' && 'エネルギー代謝'}
                  {activeChartTab === 'recovery' && 'リカバリー状態'}
                  {activeChartTab === 'immunity' && '免疫機能'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {activeChartTab === 'nutrition' && 'ビタミン・ミネラルの充足率'}
                  {activeChartTab === 'energy' && '体内のエネルギー産生に関わる指標'}
                  {activeChartTab === 'recovery' && '疲労回復・修復に関わる指標'}
                  {activeChartTab === 'immunity' && '免疫システムの状態'}
                </p>
              </div>
              
              <HealthRadarChart data={chartData[activeChartTab]} />
              
              {/* スコア表示 */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2">
                  <span className="text-sm text-gray-600">総合スコア</span>
                  <span className="text-2xl font-bold text-primary-600">
                    {Math.round(chartData[activeChartTab].reduce((sum, item) => sum + item.value, 0) / chartData[activeChartTab].length)}
                  </span>
                  <span className="text-sm text-gray-600">/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* 人体図 */}
          <AnatomicalBodyDiagram 
            data={[
              { nutrient: 'ビタミンD', bodyParts: ['骨', '免疫', '筋肉'], status: 'danger' },
              { nutrient: '鉄分', bodyParts: ['心臓', '筋肉', '血管'], status: 'warning' },
              { nutrient: 'ビタミンB12', bodyParts: ['脳', '神経'], status: 'warning' },
              { nutrient: 'ビタミンA', bodyParts: ['目', '免疫'], status: 'good' },
              { nutrient: 'カルシウム', bodyParts: ['骨', '筋肉', '心臓'], status: 'good' },
              { nutrient: 'マグネシウム', bodyParts: ['筋肉', '神経', '心臓'], status: 'warning' },
            ]} 
            gender={bodyGender}
            onGenderChange={setBodyGender}
          />

          {/* 栄養素ヒートマップ */}
          <NutrientHeatmap nutrients={[
            { name: 'ビタミンA', value: 85, status: 'good', category: 'ビタミン' },
            { name: 'ビタミンD', value: 35, status: 'danger', category: 'ビタミン' },
            { name: 'ビタミンE', value: 78, status: 'good', category: 'ビタミン' },
            { name: 'ビタミンB12', value: 45, status: 'warning', category: 'ビタミン' },
            { name: '鉄分', value: 60, status: 'warning', category: 'ミネラル' },
            { name: 'カルシウム', value: 70, status: 'good', category: 'ミネラル' },
            { name: '亜鉛', value: 80, status: 'good', category: 'ミネラル' },
            { name: 'マグネシウム', value: 55, status: 'warning', category: 'ミネラル' },
          ]} />

          {/* サプリメント推奨 */}
          <SupplementRecommendationCard recommendations={[
            {
              id: '1',
              name: 'ストロング39アミノ　マルチビタミン＆ミネラル',
              description: 'マルチビタミン＆ミネラルに9種の必須アミノ酸を含め18種のアミノ酸をプラス',
              price: 3980,
              monthlyPrice: 3580,
              doctorComment: '複数の栄養素が不足しているため、バランス良く摂取できるセットがおすすめです。相乗効果も期待できます。',
              mainNutrients: ['ビタミンB₁', '亜鉛', 'ビタミンE'],
              packType: 'pack',
              image: '/images/multivitamin-mineral.png'
            },
            {
              id: '2',
              name: 'ビタミンD強化マルチビタミン・亜鉛・乳酸菌',
              description: '1日2粒で、14種のビタミン（ビタミンD強化 25μg）・亜鉛・シールド乳酸菌®100億個をまとめて摂取',
              price: 2980,
              monthlyPrice: 2680,
              doctorComment: 'ビタミンD不足による免疫機能低下と骨密度の減少リスクを改善するため、1日2000IUの摂取を推奨します。',
              mainNutrients: ['ビタミンD', '亜鉛', '乳酸菌'],
              packType: 'single',
              image: '/images/vitamin-d.jpg'
            }
          ]} />


        </>
      ) : (
        <>
          {/* 医師用ダッシュボード */}
          {/* 統計情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">125</p>
              <p className="text-sm text-gray-500">担当患者数</p>
            </div>

            <Link href="/doctor/unconfirmed-results" className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                <span className="text-2xl">📋</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">18</p>
              <p className="text-sm text-gray-500">未確認の検査結果</p>
            </Link>
          </div>

          {/* 患者リスト */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900">最近の患者</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { name: '山田 花子', id: 'P001234', lastVisit: '2024年1月15日', status: '要フォロー' },
                { name: '田中 太郎', id: 'P001235', lastVisit: '2024年1月14日', status: '正常' },
                { name: '佐藤 美咲', id: 'P001236', lastVisit: '2024年1月13日', status: '要フォロー' },
              ].map((patient, index) => (
                <Link
                  key={index}
                  href={`/doctor/patients/${patient.id}`}
                  className="block p-4 active:bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{patient.name}</p>
                      <p className="text-xs text-gray-500">
                        {patient.id} • 最終来院: {patient.lastVisit}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        patient.status === '正常' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {patient.status}
                      </span>
                      <span className="text-gray-400">→</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/doctor/patients"
              className="block p-4 text-center text-primary-600 font-medium border-t border-gray-100"
            >
              全ての患者を見る
            </Link>
          </div>
        </>
      )}
    </div>
  )
}