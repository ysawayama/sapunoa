'use client';

import { useState } from 'react';
import Image from 'next/image';

// タブの型定義
type TabType = 'history' | 'recommended' | 'shop';

// サプリメントデータの型定義
interface SupplementItem {
  id: string;
  name: string;
  image: string;
  description?: string;
  doctorComment?: string;
  price?: number;
}

// ダミーデータ
const purchaseHistory: SupplementItem[] = [
  {
    id: 'h1',
    name: 'マルチビタミン&ミネラル',
    image: '/images/sapuri/multivitamin-mineral.png',
    description: '1日1粒で必要な栄養素をバランス良く補給',
    doctorComment: '栄養バランスの基礎として継続的な服用をお勧めします。',
  },
  {
    id: 'h2',
    name: 'ビタミンD',
    image: '/images/sapuri/vitamin-d.jpg',
    description: '骨の健康と免疫力をサポート',
    doctorComment: '日光不足の方には特に重要です。血中濃度を確認しながら服用してください。',
  },
];

const recommendedSupplements: SupplementItem[] = [
  {
    id: 'r1',
    name: 'ビタミンD',
    image: '/images/sapuri/vitamin-d.jpg',
    description: '骨の健康と免疫力をサポート',
    doctorComment: '検査結果でビタミンD値が18ng/mLと低値でした。日光不足の改善と併せて、サプリメントでの補給を強く推奨します。目標値は30ng/mL以上です。',
  },
  {
    id: 'r2',
    name: '鉄分サプリメント',
    image: '/images/sapuri/multivitamin-mineral.png',
    description: '貧血の改善と疲労感の軽減',
    doctorComment: 'フェリチン値が25ng/mLと低めです。鉄分補給により、疲労感の改善が期待できます。ビタミンCと一緒に摂取すると吸収が良くなります。',
  },
];

const shopSupplements: SupplementItem[] = [
  {
    id: 's1',
    name: 'マルチビタミン&ミネラル',
    image: '/images/sapuri/multivitamin-mineral.png',
    price: 2980,
  },
  {
    id: 's2',
    name: 'ビタミンD',
    image: '/images/sapuri/vitamin-d.jpg',
    price: 1980,
  },
  {
    id: 's3',
    name: 'DHA',
    image: '/images/sapuri/DHA.png',
    price: 3480,
  },
  {
    id: 's4',
    name: 'EPA',
    image: '/images/sapuri/EPA.png',
    price: 3680,
  },
  {
    id: 's5',
    name: 'CoQ10',
    image: '/images/sapuri/CoQ10.png',
    price: 4980,
  },
  {
    id: 's6',
    name: 'ビタミンB群',
    image: '/images/sapuri/ビタミンB群.png',
    price: 2480,
  },
  {
    id: 's7',
    name: '脂肪と血糖値のためのサプリ',
    image: '/images/sapuri/脂肪と血糖値のためのサプリ.png',
    price: 3980,
  },
  {
    id: 's8',
    name: 'オリヒロ 脂肪・尿酸ダウン',
    image: '/images/sapuri/オリヒロ 脂肪・尿酸ダウン (60粒).png',
    price: 2780,
  },
  {
    id: 's9',
    name: 'HAKU',
    image: '/images/sapuri/HAKU.png',
    price: 5980,
  },
  {
    id: 's10',
    name: 'パールスリムサプリ',
    image: '/images/sapuri/パールスリムサプリ.png',
    price: 4480,
  },
];

export default function SupplementsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('history');

  const tabs = [
    { id: 'history' as TabType, label: '購入履歴', fullLabel: '購入履歴一覧' },
    { id: 'recommended' as TabType, label: '担当医推奨', fullLabel: '担当医の推奨サプリ一覧' },
    { id: 'shop' as TabType, label: 'ショップ', fullLabel: 'ECで購入可能なサプリ一覧' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ページタイトル */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6">サプリメント</h1>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-2 sm:px-4 text-xs sm:text-sm font-medium text-center transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="sm:hidden">{tab.label}</span>
                <span className="hidden sm:inline">{tab.fullLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* タブコンテンツ */}
        <div className="space-y-4">
          {/* 購入履歴一覧 */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              {purchaseHistory.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="bg-blue-50 p-2 rounded mb-3">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">担当医からのコメント:</span> {item.doctorComment}
                        </p>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                        今すぐ購入
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 担当医の推奨サプリ一覧 */}
          {activeTab === 'recommended' && (
            <div className="space-y-4">
              {recommendedSupplements.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      <div className="bg-green-50 p-2 rounded mb-3">
                        <p className="text-sm text-green-800">
                          <span className="font-medium">担当医からのコメント:</span> {item.doctorComment}
                        </p>
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                        今すぐ購入
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ECで購入可能なサプリ一覧 */}
          {activeTab === 'shop' && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {shopSupplements.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow p-3 sm:p-4">
                  <div className="relative w-full h-32 sm:h-48 mb-2 sm:mb-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 line-clamp-2">{item.name}</h3>
                  <p className="text-lg sm:text-2xl font-bold text-blue-600 mb-2 sm:mb-3">
                    ¥{item.price?.toLocaleString()}
                  </p>
                  <div className="space-y-1 sm:space-y-2">
                    <button className="w-full bg-gray-100 text-gray-700 px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded hover:bg-gray-200 transition-colors">
                      詳細はこちら
                    </button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                      <button className="bg-orange-500 text-white px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded hover:bg-orange-600 transition-colors">
                        カゴに入れる
                      </button>
                      <button className="bg-blue-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm rounded hover:bg-blue-700 transition-colors">
                        今すぐ購入
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}