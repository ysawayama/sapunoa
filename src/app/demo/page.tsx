'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor'>('patient');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            サプノア デモンストレーション
          </h1>
          <p className="text-xl text-gray-600">
            実際の画面イメージをご覧いただけます
          </p>
        </div>

        {/* タブ切り替え */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow p-1 inline-flex">
            <button
              onClick={() => setActiveTab('patient')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'patient'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              患者向け機能
            </button>
            <button
              onClick={() => setActiveTab('doctor')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeTab === 'doctor'
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              医師向け機能
            </button>
          </div>
        </div>

        {/* 患者向けデモ */}
        {activeTab === 'patient' && (
          <div className="space-y-8">
            {/* ダッシュボード */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">患者ダッシュボード</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">主な機能：</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        健康スコアの表示（0-100点）
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        最新の検査結果サマリー
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        推奨サプリメントの一覧
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        医師からのコメント表示
                      </li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <img
                      src="/api/placeholder/400/300"
                      alt="ダッシュボード画面"
                      className="w-full rounded"
                    />
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      ダッシュボード画面イメージ
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 検査結果可視化 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">検査結果の可視化</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="bg-blue-50 p-6 rounded-lg mb-3">
                      <div className="text-4xl mb-2">📊</div>
                      <h4 className="font-semibold">レーダーチャート</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      栄養バランスを一目で把握
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-50 p-6 rounded-lg mb-3">
                      <div className="text-4xl mb-2">🗺️</div>
                      <h4 className="font-semibold">ヒートマップ</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      栄養素の過不足を色分け表示
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="bg-purple-50 p-6 rounded-lg mb-3">
                      <div className="text-4xl mb-2">🏃</div>
                      <h4 className="font-semibold">人体図</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      影響を受ける部位を視覚化
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* サプリメント推奨 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">サプリメント推奨システム</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">AIによる個別最適化</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">1</span>
                          検査結果を自動分析
                        </li>
                        <li className="flex items-center">
                          <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">2</span>
                          栄養素の過不足を判定
                        </li>
                        <li className="flex items-center">
                          <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3">3</span>
                          最適なサプリメントを提案
                        </li>
                      </ul>
                    </div>
                    <div>
                      <div className="bg-white p-4 rounded-lg shadow">
                        <h4 className="font-semibold mb-2">推奨例：</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>ビタミンD3</span>
                            <span className="text-red-500">優先度: 高</span>
                          </div>
                          <div className="flex justify-between">
                            <span>マグネシウム</span>
                            <span className="text-yellow-500">優先度: 中</span>
                          </div>
                          <div className="flex justify-between">
                            <span>オメガ3</span>
                            <span className="text-green-500">優先度: 低</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 医師向けデモ */}
        {activeTab === 'doctor' && (
          <div className="space-y-8">
            {/* 患者管理 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">患者管理システム</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">管理機能：</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        患者リストの一覧表示
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        検査結果の確認・承認
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        サプリメント推奨の編集
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        医師コメントの追加
                      </li>
                    </ul>
                  </div>
                  <div>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="bg-white p-3 rounded shadow mb-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">山田 花子</span>
                          <span className="text-sm text-gray-500">最終検査: 2024/01/15</span>
                        </div>
                      </div>
                      <div className="bg-white p-3 rounded shadow mb-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">佐藤 次郎</span>
                          <span className="text-sm text-gray-500">最終検査: 2024/01/20</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 推奨編集 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">推奨カスタマイズ機能</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <p className="text-gray-700 mb-4">
                    AIの推奨に加えて、医師の専門知識に基づいたカスタマイズが可能です。
                  </p>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                      <h4 className="font-semibold mb-2">優先度設定</h4>
                      <p className="text-sm text-gray-600">
                        各サプリメントの優先度を調整
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                      <h4 className="font-semibold mb-2">用量調整</h4>
                      <p className="text-sm text-gray-600">
                        患者に合わせた用量の設定
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                      <h4 className="font-semibold mb-2">コメント追加</h4>
                      <p className="text-sm text-gray-600">
                        服用方法や注意事項の記載
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CTAセクション */}
        <div className="mt-12 text-center bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">実際に使ってみましょう</h2>
          <p className="text-gray-600 mb-6">
            テストアカウントで全機能をお試しいただけます
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              ログインして試す
            </Link>
            <Link
              href="/"
              className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              トップページに戻る
            </Link>
          </div>
          <div className="mt-6 text-sm text-gray-500">
            <p className="mb-1">患者アカウント: patient1@example.com / patient123</p>
            <p>医師アカウント: doctor@supnoa.com / doctor123</p>
          </div>
        </div>
      </div>
    </div>
  );
}