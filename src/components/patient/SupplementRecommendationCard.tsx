"use client"

import Link from 'next/link'
import Image from 'next/image'

interface Supplement {
  id: string
  name: string
  description: string
  price: number
  monthlyPrice: number
  doctorComment: string
  mainNutrients: string[]
  packType: 'single' | 'pack'
  image?: string
}

interface SupplementRecommendationCardProps {
  recommendations: Supplement[]
}

export default function SupplementRecommendationCard({ recommendations }: SupplementRecommendationCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-900">【医師監修】あなたに最適なサプリメント</h3>
      </div>

      <div className="space-y-4">
        {recommendations.map((supplement) => (
          <div key={supplement.id} className="border border-gray-100 rounded-xl p-4">
            <div className="space-y-4">
              {/* 上部: 画像と基本情報 */}
              <div className="flex items-start gap-4">
                {/* サプリメント画像 */}
                <div className="w-32 h-32 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {supplement.image ? (
                    <Image
                      src={supplement.image}
                      alt={supplement.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <span className="text-3xl">💊</span>
                  )}
                </div>

                {/* サプリメント基本情報 */}
                <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-bold text-gray-900">{supplement.name}</h4>
                    <p className="text-xs text-gray-500">{supplement.description}</p>
                  </div>
                  {supplement.packType === 'pack' && (
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                      セット
                    </span>
                  )}
                </div>

                {/* 主要栄養素 */}
                <div className="flex flex-wrap gap-1">
                  {supplement.mainNutrients.map((nutrient, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {nutrient}
                    </span>
                  ))}
                </div>

                </div>
              </div>
              
              {/* 医師コメント */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <span className="text-sm">👨‍⚕️</span>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {supplement.doctorComment}
                  </p>
                </div>
              </div>
              
              {/* 下部: 価格と購入オプション */}
              <div className="space-y-3">
                {/* 価格情報 */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      ¥{supplement.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500">/ 月</span>
                  </div>
                  {supplement.monthlyPrice < supplement.price && (
                    <p className="text-xs text-green-600 mt-1">
                      定期購入で¥{(supplement.price - supplement.monthlyPrice).toLocaleString()}お得
                    </p>
                  )}
                </div>
                
                {/* アクションボタン */}
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-primary-600 text-white px-4 py-3 rounded-lg text-sm font-medium active:scale-95 transition-transform">
                    今すぐ購入
                  </button>
                  <button className="bg-primary-100 text-primary-700 px-4 py-3 rounded-lg text-sm font-medium active:scale-95 transition-transform">
                    定期購入
                  </button>
                </div>
                
                {/* 詳細リンク */}
                <button className="w-full bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 active:scale-95 transition-transform">
                  商品の詳細はこちら →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 医師に相談ボタン */}
      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">不安な点がありますか？</p>
            <p className="text-xs text-gray-600">専門医師がオンラインで相談に応じます</p>
          </div>
          <Link 
            href="/consultation"
            className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 active:scale-95 transition-transform"
          >
            医師に相談する
          </Link>
        </div>
      </div>

      {/* 定期購入特典 */}
      <div className="mt-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200">
        <h4 className="text-sm font-bold text-gray-900 mb-2">🎁 定期購入特典</h4>
        <ul className="space-y-1 text-xs text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-orange-500">✓</span>
            <span>全商品10%OFF</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-orange-500">✓</span>
            <span>送料無料</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-orange-500">✓</span>
            <span>いつでも解約・変更可能</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-orange-500">✓</span>
            <span>専門医師による定期カウンセリング</span>
          </li>
        </ul>
      </div>
    </div>
  )
}