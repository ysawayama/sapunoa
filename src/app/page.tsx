import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-primary-600">サプノア</h1>
        </div>
      </div>

      {/* ヒーローセクション */}
      <div className="px-4 py-8 text-center">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-4">
            <Image
              src="/images/sapunoa-logo2.png"
              alt="サプノア"
              width={96}
              height={96}
              className="w-full h-full"
              priority
            />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            あなたの健康を
            <br />
            科学的にサポート
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            血液検査・尿検査の結果から
            <br />
            最適なサプリメントをご提案
          </p>
        </div>
      </div>

      {/* 特徴カード - 縦積み */}
      <div className="px-4 pb-8 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">📊</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">
                検査結果を簡単アップロード
              </h3>
              <p className="text-sm text-gray-600">
                スマホで撮影するだけでOK
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🤖</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">
                AIが健康状態を分析
              </h3>
              <p className="text-sm text-gray-600">
                医学的エビデンスに基づいた解析
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">✨</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">
                パーソナライズされた提案
              </h3>
              <p className="text-sm text-gray-600">
                あなただけの健康プランを作成
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA セクション */}
      <div className="px-4 pb-8">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-lg mb-2">
            まずは無料でお試し
          </h3>
          <p className="text-sm mb-4 opacity-90">
            デモアカウントで全機能を体験できます
          </p>
          
          <div className="space-y-3">
            <Link
              href="/quick-login"
              className="block w-full bg-white text-primary-600 py-4 rounded-xl font-bold text-center shadow-sm active:scale-95 transition-transform"
            >
              今すぐ始める
            </Link>
            
            <Link
              href="/login"
              className="block w-full bg-primary-400 bg-opacity-30 backdrop-blur text-white py-4 rounded-xl font-medium text-center active:scale-95 transition-transform"
            >
              アカウントをお持ちの方
            </Link>
          </div>
        </div>
      </div>

      {/* フッター情報 */}
      <div className="px-4 pb-8">
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-500 mb-2">開発用テストアカウント</p>
          <div className="space-y-1 text-xs">
            <p className="text-gray-600">
              <span className="font-medium">患者:</span> patient1@example.com
            </p>
            <p className="text-gray-600">
              <span className="font-medium">医師:</span> doctor@supnoa.com
            </p>
            <p className="text-gray-500 mt-2">
              パスワードは自動入力されます
            </p>
          </div>
        </div>
      </div>

      {/* 開発ツールへのリンク（開発環境のみ） */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 z-50">
          <Link
            href="/dev-tools"
            className="bg-gray-800 text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-xl active:scale-95 transition-transform"
          >
            🛠
          </Link>
        </div>
      )}
    </main>
  )
}